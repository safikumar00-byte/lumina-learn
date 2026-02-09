
import React, { useState, useEffect } from 'react';
import { ThumbsUp, Send, User } from 'lucide-react';
import { Comment } from '../types';

interface CommentsSectionProps {
  lessonId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ lessonId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    // Load likes from local storage
    const savedLikes = localStorage.getItem('user_likes');
    if (savedLikes) setLikedIds(JSON.parse(savedLikes));

    // Lesson-specific Mock Data
    const mockComments: Record<string, Comment[]> = {
      'jp-sentence-structure': [
        {
          id: 'c-sov-1',
          lessonId,
          name: 'Alex Rivera',
          content: 'This visual side-by-side comparison between SVO and SOV finally made it click for me. I was always putting the verb in the middle!',
          timestamp: '1 hour ago',
          likes: 24
        },
        {
          id: 'c-sov-2',
          lessonId,
          name: 'Yumi Takahashi',
          content: 'As a native speaker, I love how you explained particles as "markers." That is exactly how we perceive them. Great introductory content!',
          timestamp: '4 hours ago',
          likes: 42
        },
        {
          id: 'c-sov-3',
          lessonId,
          name: 'David K.',
          content: 'Does the SOV rule apply to questions as well? Or does the order change when asking something?',
          timestamp: '1 day ago',
          likes: 3
        }
      ],
      'jp-greetings': [
        {
          id: 'c1',
          lessonId,
          name: 'Sarah J.',
          content: 'This explanation of Sumimasen was exactly what I needed! Very clear.',
          timestamp: '2 hours ago',
          likes: 5
        },
        {
          id: 'c2',
          lessonId,
          name: 'Kenji',
          content: 'As a native speaker, I think this captures the nuances well. Great job!',
          timestamp: '5 hours ago',
          likes: 12
        }
      ]
    };

    setComments(mockComments[lessonId] || [
      {
        id: 'default-1',
        lessonId,
        name: 'Learner',
        content: 'Really enjoying this course so far. The layout is so clean!',
        timestamp: 'Just now',
        likes: 0
      }
    ]);
  }, [lessonId]);

  const handleLike = (id: string) => {
    if (likedIds.includes(id)) return;
    
    const newLiked = [...likedIds, id];
    setLikedIds(newLiked);
    localStorage.setItem('user_likes', JSON.stringify(newLiked));
    
    setComments(prev => prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      lessonId,
      name,
      content,
      timestamp: 'Just now',
      likes: 0
    };

    setComments([newComment, ...comments]);
    setName('');
    setContent('');
  };

  return (
    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-2xl font-serif font-bold mb-8">Discussion ({comments.length})</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <h4 className="font-bold mb-4">Leave a comment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-md text-sm text-zinc-500">
            <span className="bg-white dark:bg-zinc-600 px-2 py-1 rounded text-xs font-bold text-black dark:text-white">CAPTCHA</span>
            <span>Check this box to verify</span>
            <input type="checkbox" className="ml-auto w-4 h-4 cursor-pointer" required />
          </div>
        </div>
        <textarea 
          placeholder="What are your thoughts on this lesson?"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-black dark:focus:ring-white mb-4"
        ></textarea>
        <button 
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-md hover:opacity-80 transition-opacity"
        >
          <Send size={16} /> Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <User size={20} className="text-zinc-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">{comment.name}</span>
                <span className="text-xs text-zinc-500">• {comment.timestamp}</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 mb-2 leading-relaxed">
                {comment.content}
              </p>
              <button 
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${likedIds.includes(comment.id) ? 'text-black dark:text-white' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
              >
                <ThumbsUp size={14} className={likedIds.includes(comment.id) ? 'fill-current' : ''} />
                {comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
