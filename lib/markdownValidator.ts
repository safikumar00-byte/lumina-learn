/**
 * Markdown Authoring Enforcement Layer
 * Enforces LUMINA_MARKDOWN_LINT.md rules with blocking/warning categorization
 * This is NOT a linter - it ENFORCES Lumina authoring standards
 */

export interface ValidationError {
    rule: string;
    message: string;
    lineNumber?: number;
    severity: 'error' | 'warning'; // BLOCKING vs non-blocking
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    blockingErrors: ValidationError[];
    warnings: ValidationError[];
    metadata: {
        h1Count: number;
        firstParagraphLineCount?: number;
        hasAeoBlock: boolean;
        hasRecapBlock: boolean;
        hasRawHtml: boolean;
    };
}

/**
 * Parse markdown to extract H1, blocks, and structure
 */
function parseMarkdown(body: string): { lines: string[]; blocks: Map<string, number[]> } {
    const lines = body.split(/\r?\n/);
    const blocks = new Map<string, number[]>();

    // Find all Lumina blocks (:::type ... :::)
    const blockRegex = /:::(note|definition|example|comparison|key|aeo|recap|image|image-caption|image-quote|image-split)\n+([\s\S]*?)\n\s*:::/g;
    let match;

    while ((match = blockRegex.exec(body)) !== null) {
        const blockType = match[1];
        if (!blocks.has(blockType)) {
            blocks.set(blockType, []);
        }
        // Find line number
        const lineNum = body.substring(0, match.index).split('\n').length;
        blocks.get(blockType)!.push(lineNum);
    }

    return { lines, blocks };
}

/**
 * ENFORCEMENT RULE 1: Exactly ONE H1
 * Severity: BLOCKING
 * Guid: Rule 2 in LUMINA_MARKDOWN_LINT.md
 */
function validateH1Count(lines: string[]): ValidationError[] {
    const h1Lines = lines.filter((line) => /^# [^#]/.test(line));

    const errors: ValidationError[] = [];

    if (h1Lines.length === 0) {
        errors.push({
            rule: 'missing-h1',
            message: 'Document must contain exactly ONE H1 heading. This is required for AEO (Answer Engine Optimization).',
            severity: 'error',
        });
    } else if (h1Lines.length > 1) {
        errors.push({
            rule: 'multiple-h1',
            message: `Document contains ${h1Lines.length} H1 headings. Only one H1 is allowed per lesson. Use H2 for section headings instead.`,
            severity: 'error',
        });
    }

    return errors;
}

/**
 * ENFORCEMENT RULE 2: H1 must be first content
 * Severity: BLOCKING
 * Guid: Rule 3 in LUMINA_MARKDOWN_LINT.md
 */
function validateH1Position(lines: string[]): ValidationError[] {
    const errors: ValidationError[] = [];
    const firstContentIndex = lines.findIndex((line) => line.trim() !== '');

    if (firstContentIndex === -1) {
        errors.push({
            rule: 'empty-content',
            message: 'Document body is empty.',
            severity: 'error',
        });
        return errors;
    }

    const firstContentLine = lines[firstContentIndex];
    if (!/^# [^#]/.test(firstContentLine)) {
        errors.push({
            rule: 'h1-not-first',
            message: `H1 must be the FIRST content line (after frontmatter). Found: "${firstContentLine.substring(0, 50)}..."`,
            lineNumber: firstContentIndex + 1,
            severity: 'error',
        });
    }

    return errors;
}

/**
 * ENFORCEMENT RULE 3: Lead Answer Rule
 * Severity: BLOCKING
 * Guid: Rule 3 in LUMINA_MARKDOWN_LINT.md
 * The very first paragraph after H1 must be a direct, 2-3 sentence answer
 */
function validateLeadAnswer(lines: string[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Find H1
    const h1Index = lines.findIndex((line) => /^# [^#]/.test(line));
    if (h1Index === -1) return errors; // Already reported by validateH1Count

    // Find first paragraph after H1
    let paragraphStart = h1Index + 1;
    while (paragraphStart < lines.length && lines[paragraphStart].trim() === '') {
        paragraphStart++;
    }

    if (paragraphStart >= lines.length) {
        errors.push({
            rule: 'missing-lead-answer',
            message: 'No content found after H1. A 2-3 sentence answer must follow the title immediately.',
            severity: 'error',
        });
        return errors;
    }

    // Check if next non-empty line is a block or heading (should be paragraph)
    const nextLine = lines[paragraphStart];
    if (!nextLine.trim()) {
        errors.push({
            rule: 'missing-lead-answer',
            message: 'The first paragraph after H1 is required. Provide a 2-3 sentence answer to your H1 question.',
            lineNumber: paragraphStart + 1,
            severity: 'error',
        });
        return errors;
    }

    if (/^#+\s/.test(nextLine) || /^:::/.test(nextLine)) {
        errors.push({
            rule: 'missing-lead-answer',
            message: 'H1 must be immediately followed by a 2-3 sentence paragraph answering the title question. Do not start with a heading or block.',
            lineNumber: paragraphStart + 1,
            severity: 'error',
        });
        return errors;
    }

    // Extract paragraph and count sentences (rough estimation)
    const paragraphLines: string[] = [];
    let idx = paragraphStart;
    while (idx < lines.length && lines[idx].trim() !== '' && !/^#+/.test(lines[idx]) && !/^:::/.test(lines[idx])) {
        paragraphLines.push(lines[idx]);
        idx++;
    }

    const paragraph = paragraphLines.join(' ');
    const sentenceCount = (paragraph.match(/[.!?]+/g) || []).length;

    // Warn if it's too long (> 3 sentences), but don't block
    if (sentenceCount > 4) {
        console.warn(
            `[Markdown Validator] Lead paragraph has ${sentenceCount} sentences (target: 2-3). Keep it concise for better AEO performance.`
        );
    }

    return errors;
}

/**
 * ENFORCEMENT RULE 4: Heading Hierarchy
 * Severity: BLOCKING
 * Guid: Rule 4 in LUMINA_MARKDOWN_LINT.md
 * No skipped levels (H1 → H3 is invalid)
 */
function validateHeadingHierarchy(lines: string[]): ValidationError[] {
    const errors: ValidationError[] = [];
    const headingLevels: Map<number, string> = new Map();

    lines.forEach((line, index) => {
        const match = line.match(/^(#{1,6})\s/);
        if (match) {
            headingLevels.set(index, match[1]);
        }
    });

    const sortedIndices = Array.from(headingLevels.keys()).sort((a, b) => a - b);
    const levelSequence = sortedIndices.map((i) => headingLevels.get(i)!.length);

    for (let i = 0; i < levelSequence.length - 1; i++) {
        const current = levelSequence[i];
        const next = levelSequence[i + 1];

        if (next > current + 1) {
            const nextIndex = sortedIndices[i + 1];
            errors.push({
                rule: 'skipped-heading-level',
                message: `Skipped heading level: H${current} → H${next}. Use consecutive levels (H1 → H2 → H3, not H1 → H3).`,
                lineNumber: nextIndex + 1,
                severity: 'error',
            });
            break; // Report only first occurrence
        }
    }

    return errors;
}

/**
 * ENFORCEMENT RULE 5: No Raw HTML
 * Severity: BLOCKING
 * Guid: Rule 10 in LUMINA_MARKDOWN_LINT.md
 */
function validateNoRawHtml(body: string): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for raw HTML tags
    const htmlRegex = /<(div|span|p|section|article|style|script|html|body|head|iframe)[^>]*>/gi;
    const matches = body.match(htmlRegex);

    if (matches && matches.length > 0) {
        errors.push({
            rule: 'raw-html-forbidden',
            message: `Found ${matches.length} raw HTML tag(s): ${matches[0]}.  Only use Lumina Markdown blocks (:::type). HTML is not allowed.`,
            severity: 'error',
        });
    }

    return errors;
}

/**
 * ENFORCEMENT RULE 6: At least ONE :::aeo block
 * Severity: BLOCKING
 * Guid: Rule 6 in LUMINA_MARKDOWN_LINT.md
 */
function validateAeoBlock(body: string, blocks: Map<string, number[]>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!blocks.has('aeo') || blocks.get('aeo')!.length === 0) {
        errors.push({
            rule: 'missing-aeo-block',
            message: 'Document must contain at least one :::aeo block. This is required for Answer Engine Optimization (AEO). Format: :::aeo ... :::',
            severity: 'error',
        });
    }

    return errors;
}

/**
 * ENFORCEMENT RULE 7: Must end with :::recap
 * Severity: BLOCKING
 * Guid: Rule 9 in LUMINA_MARKDOWN_LINT.md
 */
function validateRecapBlock(body: string, blocks: Map<string, number[]>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!blocks.has('recap') || blocks.get('recap')!.length === 0) {
        errors.push({
            rule: 'missing-recap-block',
            message: 'Document must conclude with a :::recap block summarizing the 3-5 key takeaways. Format: :::recap ... :::',
            severity: 'error',
        });
        return errors;
    }

    // Check if recap is near the end (within last 20% of lines)
    const recapLine = blocks.get('recap')![blocks.get('recap')!.length - 1];
    const totalLines = body.split('\n').length;

    if (recapLine < totalLines * 0.8) {
        console.warn(
            `[Markdown Validator] :::recap block is not at the end of the document (line ${recapLine} of ${totalLines}). Move it to the end.`
        );
    }

    return errors;
}

/**
 * ENFORCEMENT RULE 8: Image Block Validation
 * Severity: BLOCKING
 * Enforces structural integrity of image blocks
 */
function validateImageBlocks(body: string, blocks: Map<string, number[]>): ValidationError[] {
    const errors: ValidationError[] = [];

    // Get all image block types
    const imageBlockTypes = ['image', 'image-caption', 'image-quote', 'image-split'];

    for (const blockType of imageBlockTypes) {
        if (!blocks.has(blockType)) continue;

        const blockLines = blocks.get(blockType) || [];

        // Find all occurrences of this block type in the body
        const blockRegex = new RegExp(`:::\\s*${blockType}\\s*\\n([\\s\\S]*?)\\n\\s*:::`, 'g');
        let match;

        while ((match = blockRegex.exec(body)) !== null) {
            const blockContent = match[1];
            const lineNum = body.substring(0, match.index).split('\n').length;

            // Parse block parameters
            const params: Record<string, string> = {};
            const contentLines = blockContent.split('\n');

            for (const line of contentLines) {
                const keyMatch = line.trim().match(/^(\w+):\s*(.*?)$/);
                if (keyMatch) {
                    params[keyMatch[1]] = keyMatch[2];
                }
            }

            // Validate required parameters
            if (!params.src) {
                errors.push({
                    rule: 'image-block-missing-src',
                    message: `:::${blockType} block is missing required 'src' parameter. Provide: src: /images/path/to/image.png`,
                    lineNumber: lineNum,
                    severity: 'error',
                });
            }

            if (!params.alt) {
                errors.push({
                    rule: 'image-block-missing-alt',
                    message: `:::${blockType} block is missing required 'alt' parameter. Provide descriptive alt text (8-15 words).`,
                    lineNumber: lineNum,
                    severity: 'error',
                });
            } else if (params.alt.length < 5) {
                errors.push({
                    rule: 'image-block-alt-too-short',
                    message: `Alt text is too short: "${params.alt}". Use descriptive text (8-15 words) for accessibility.`,
                    lineNumber: lineNum,
                    severity: 'warning',
                });
            } else if (params.alt.toLowerCase() === 'image' || params.alt.toLowerCase() === 'diagram') {
                errors.push({
                    rule: 'image-block-alt-generic',
                    message: `Alt text is too generic: "${params.alt}". Describe what the image shows, not the file type.`,
                    lineNumber: lineNum,
                    severity: 'warning',
                });
            }

            // Type-specific validation
            if (blockType === 'image-split') {
                if (!params.side) {
                    errors.push({
                        rule: 'image-split-missing-side',
                        message: `:::image-split block is missing 'side' parameter. Provide: side: left (or right)`,
                        lineNumber: lineNum,
                        severity: 'error',
                    });
                } else if (params.side !== 'left' && params.side !== 'right') {
                    errors.push({
                        rule: 'image-split-invalid-side',
                        message: `Invalid 'side' value: "${params.side}". Must be 'left' or 'right'.`,
                        lineNumber: lineNum,
                        severity: 'error',
                    });
                }

                if (!params.content) {
                    errors.push({
                        rule: 'image-split-missing-content',
                        message: `:::image-split block is missing 'content' parameter. Provide descriptive text.`,
                        lineNumber: lineNum,
                        severity: 'error',
                    });
                }
            }
        }
    }

    return errors;
}

/**
 * Main validation function
 * Enforces all LUMINA_MARKDOWN_LINT.md rules
 */
export function validateMarkdown(content: string, slug: string): ValidationResult {
    // Split frontmatter from body
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

    if (!frontmatterMatch) {
        return {
            isValid: false,
            errors: [
                {
                    rule: 'malformed-frontmatter',
                    message: 'Invalid document structure. Must start with YAML frontmatter: ---\\n..metadata..\\n---\\n..body..',
                    severity: 'error',
                },
            ],
            blockingErrors: [],
            warnings: [],
            metadata: {
                h1Count: 0,
                hasAeoBlock: false,
                hasRecapBlock: false,
                hasRawHtml: false,
            },
        };
    }

    const [, , body] = frontmatterMatch;
    const { lines, blocks } = parseMarkdown(body);

    // Collect all errors
    const allErrors: ValidationError[] = [];

    // Run all validation checks
    allErrors.push(...validateH1Count(lines));
    allErrors.push(...validateH1Position(lines));
    allErrors.push(...validateLeadAnswer(lines));
    allErrors.push(...validateHeadingHierarchy(lines));
    allErrors.push(...validateNoRawHtml(body));
    allErrors.push(...validateAeoBlock(body, blocks));
    allErrors.push(...validateRecapBlock(body, blocks));
    allErrors.push(...validateImageBlocks(body, blocks));

    // Categorize errors
    const blockingErrors = allErrors.filter((e) => e.severity === 'error');
    const warnings = allErrors.filter((e) => e.severity === 'warning');

    return {
        isValid: blockingErrors.length === 0,
        errors: allErrors,
        blockingErrors,
        warnings,
        metadata: {
            h1Count: lines.filter((l) => /^# [^#]/.test(l)).length,
            firstParagraphLineCount: undefined,
            hasAeoBlock: blocks.has('aeo'),
            hasRecapBlock: blocks.has('recap'),
            hasRawHtml: /<(div|span|p|section|article|style|script)[^>]*>/gi.test(body),
        },
    };
}

/**
 * Format validation errors for display (console or UI)
 */
export function formatValidationErrors(slug: string, result: ValidationResult): string {
    if (result.isValid) {
        return '';
    }

    const lines: string[] = [];
    lines.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`❌ MARKDOWN AUTHORING VIOLATION: ${slug}.md`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    if (result.blockingErrors.length > 0) {
        lines.push(`\n🚫 BLOCKING ERRORS (${result.blockingErrors.length}):`);
        result.blockingErrors.forEach((err) => {
            const lineNum = err.lineNumber ? ` [Line ${err.lineNumber}]` : '';
            lines.push(`   • ${err.rule}${lineNum}`);
            lines.push(`     ${err.message}`);
        });
    }

    if (result.warnings.length > 0) {
        lines.push(`\n⚠️  WARNINGS (${result.warnings.length}):`);
        result.warnings.forEach((err) => {
            const lineNum = err.lineNumber ? ` [Line ${err.lineNumber}]` : '';
            lines.push(`   • ${err.rule}${lineNum}`);
            lines.push(`     ${err.message}`);
        });
    }

    lines.push(`\n📖 See: LUMINA_MARKDOWN_LINT.md`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    return lines.join('\n');
}
