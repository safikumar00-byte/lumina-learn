import React, { useState } from "react";
import { ChevronDown, CheckCircle, AlertCircle } from "lucide-react";

interface AssignmentQuestion {
  type: "multiple-choice" | "fill-blank" | "match";
  question: string;
  options?: string[];
  answer: string | string[];
  items?: string[];
  matches?: Record<string, string>;
}

interface AssignmentBlockProps {
  content: string;
}

const AssignmentBlock: React.FC<AssignmentBlockProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    Record<number, string | string[]>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(
    null,
  );

  // Parse assignment content to extract questions
  const parseAssignments = (): AssignmentQuestion[] => {
    const questions: AssignmentQuestion[] = [];
    const lines = content.split("\n").filter((line) => line.trim());

    let currentQuestion: Partial<AssignmentQuestion> = {};
    let optionsList: string[] = [];
    let matchesList: Record<string, string> = {};
    let itemsList: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("type:")) {
        if (Object.keys(currentQuestion).length > 0) {
          if (optionsList.length > 0) currentQuestion.options = optionsList;
          if (Object.keys(matchesList).length > 0)
            currentQuestion.matches = matchesList;
          if (itemsList.length > 0) currentQuestion.items = itemsList;
          questions.push(currentQuestion as AssignmentQuestion);
        }
        currentQuestion = { type: trimmed.replace("type:", "").trim() as any };
        optionsList = [];
        matchesList = {};
        itemsList = [];
      } else if (trimmed.startsWith("question:")) {
        currentQuestion.question = trimmed.replace("question:", "").trim();
      } else if (trimmed.startsWith("options:")) {
        // Options follow on next lines
      } else if (trimmed.startsWith("answer:")) {
        const answerValue = trimmed.replace("answer:", "").trim();
        // Check if it's a list (for matching type)
        if (answerValue.includes("[")) {
          currentQuestion.answer = JSON.parse(answerValue);
        } else {
          currentQuestion.answer = answerValue;
        }
      } else if (trimmed.startsWith("-") && !trimmed.includes(":")) {
        // This is an option or item
        const value = trimmed.replace(/^-\s*/, "");
        optionsList.push(value);
      } else if (trimmed.includes(":") && currentQuestion.type === "match") {
        // This is a match pair
        const [key, value] = trimmed.split(":").map((s) => s.trim());
        matchesList[key] = value;
      }
    }

    // Add the last question
    if (Object.keys(currentQuestion).length > 0) {
      if (optionsList.length > 0) currentQuestion.options = optionsList;
      if (Object.keys(matchesList).length > 0)
        currentQuestion.matches = matchesList;
      if (itemsList.length > 0) currentQuestion.items = itemsList;
      questions.push(currentQuestion as AssignmentQuestion);
    }

    return questions;
  };

  const questions = parseAssignments();

  const handleMultipleChoice = (questionIndex: number, option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleFillBlank = (questionIndex: number, option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleMatch = (
    questionIndex: number,
    leftItem: string,
    rightItem: string,
  ) => {
    const currentMatches =
      (userAnswers[questionIndex] as Record<string, string>) || {};
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        ...currentMatches,
        [leftItem]: rightItem,
      },
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];

      if (
        question.type === "multiple-choice" ||
        question.type === "fill-blank"
      ) {
        if (userAnswer === question.answer) {
          correctCount++;
        }
      } else if (question.type === "match") {
        // Check if all matches are correct
        const userMatches = userAnswer as Record<string, string>;
        const answerMatches = question.matches || {};
        const allCorrect = Object.keys(answerMatches).every(
          (key) => userMatches && userMatches[key] === answerMatches[key],
        );
        if (allCorrect) {
          correctCount++;
        }
      }
    });

    setScore({ correct: correctCount, total: questions.length });
    setSubmitted(true);
  };

  const getPerformanceLevel = () => {
    if (!score) return "";
    const percentage = (score.correct / score.total) * 100;
    if (percentage >= 90) return "Excellent";
    if (percentage >= 75) return "Good";
    if (percentage >= 60) return "Needs Review";
    return "Retry Lesson";
  };

  const getPerformanceColor = () => {
    if (!score) return "";
    const percentage = (score.correct / score.total) * 100;
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 75) return "text-blue-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="my-8 rounded-lg border border-blue-500/30 bg-blue-500/5 p-6">
      {/* Accordion Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-4 py-2"
      >
        <h3 className="text-lg font-semibold text-blue-400">
          📝 Practice Assignment
        </h3>
        <ChevronDown
          size={20}
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Accordion Content */}
      {isExpanded && (
        <div className="mt-6 space-y-8 border-t border-blue-500/20 pt-6">
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="space-y-4">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                Question {questionIndex + 1}: {question.question}
              </h4>

              {/* Multiple Choice */}
              {question.type === "multiple-choice" && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={option}
                        checked={userAnswers[questionIndex] === option}
                        onChange={(e) =>
                          handleMultipleChoice(questionIndex, e.target.value)
                        }
                        disabled={submitted}
                        className="h-4 w-4 cursor-pointer accent-blue-500"
                      />
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Fill Blank */}
              {question.type === "fill-blank" && question.options && (
                <div className="space-y-2">
                  <select
                    value={(userAnswers[questionIndex] as string) || ""}
                    onChange={(e) =>
                      handleFillBlank(questionIndex, e.target.value)
                    }
                    disabled={submitted}
                    className="input-accent w-full rounded-md border bg-white p-2 dark:bg-zinc-800"
                  >
                    <option value="">-- Select Answer --</option>
                    {question.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Match Type */}
              {question.type === "match" && question.matches && (
                <div className="space-y-3">
                  {Object.keys(question.matches).map((leftItem) => {
                    const rightOptions = Object.values(question.matches!);
                    return (
                      <div key={leftItem} className="flex items-center gap-4">
                        <span className="w-1/3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {leftItem}
                        </span>
                        <span className="text-zinc-400">→</span>
                        <select
                          value={
                            ((
                              userAnswers[questionIndex] as Record<
                                string,
                                string
                              >
                            )?.[leftItem] || "") as string
                          }
                          onChange={(e) =>
                            handleMatch(questionIndex, leftItem, e.target.value)
                          }
                          disabled={submitted}
                          className="input-accent flex-1 rounded-md border bg-white p-2 dark:bg-zinc-800"
                        >
                          <option value="">-- Select --</option>
                          {rightOptions.map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Submit Button */}
          {!submitted && (
            <button onClick={calculateScore} className="btn-accent mt-6 w-full">
              Submit Answers
            </button>
          )}

          {/* Score Display */}
          {submitted && score && (
            <div className="mt-6 space-y-4 rounded-lg border border-blue-500/30 bg-blue-500/5 p-6">
              <div className="flex items-center gap-3">
                {score.correct === score.total ? (
                  <CheckCircle size={24} className="text-green-400" />
                ) : (
                  <AlertCircle size={24} className={getPerformanceColor()} />
                )}
                <div>
                  <h5 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Score: {score.correct} / {score.total}
                  </h5>
                  <p className={`text-sm font-medium ${getPerformanceColor()}`}>
                    {getPerformanceLevel()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setScore(null);
                  setUserAnswers({});
                }}
                className="btn-accent w-full"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentBlock;
