import React, { useState, useRef } from "react";
import { 
  ArrowBigUp, ArrowBigDown, Reply, Bookmark, ArrowLeft, Search, MoreHorizontal, Send, MessageCircle 
} from "lucide-react";
import { useQuestions } from "../context/QuestionContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import {motion} from "framer-motion"
export default function QuestionDetail() {
  const { id: questionId } = useParams(); 
  const { questions, upvote, downvote, bookmark, addReply } = useQuestions();
  const { isDark, themeColor, availableColors } = useTheme();
  const question = questions.find(q => q.id === questionId);
  const [replyText, setReplyText] = useState("");
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const messagesEndRef = useRef(null);
  const Navigate = useNavigate(null);
  const currentThemeColor = availableColors[themeColor];

  
  const colors = isDark
    ? {
        textPrimary: "#ffffff",
        textSecondary: "#a0a0a0", 
        textMuted: "#6b7280",
        bgPrimary: "#0a0a0a",
        bgSecondary: "#1a1a1a",
        bgCard: "#141414",
        bgHover: "#252525",
        border: "#2a2a2a",
        accent: currentThemeColor.value,
        accentHover: currentThemeColor.dark,
        success: "#22c55e",
        warning: "#f59e0b"
      }
    : {
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        textMuted: "#64748b", 
        bgPrimary: "#ffffff",
        bgSecondary: "#f8fafc",
        bgCard: "#ffffff",
        bgHover: "#f1f5f9",
        border: "#e2e8f0",
        accent: currentThemeColor.value,
        accentHover: currentThemeColor.dark,
        success: "#10b981",
        warning: "#f59e0b"
      };

  if (!question) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPrimary, color: colors.textPrimary }}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Question not found</h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>The question you're looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  // Organize replies into threads
  const organizeReplies = (replies) => {
    const topLevel = replies.filter(r => !r.parentId);
    const nested = replies.filter(r => r.parentId);
    return topLevel.map(reply => ({
      ...reply,
      children: nested.filter(n => n.parentId === reply.id)
    }));
  };

  const organizedReplies = organizeReplies(question.replies || []);

  const handleMainReplySubmit = () => {
    if (!replyText.trim()) return;

    addReply(question.id, { text: replyText, author: "You" });
    setReplyText("");
    setShowReplyEditor(false);

     
  };

  const handleInlineReplySubmit = (replyId, text) => {
    if (!text.trim()) return;
    const parentReply = question.replies.find(r => r.id === replyId);
    addReply(question.id, {
      text,
      author: "You",
      parentId: replyId,
      replyToAuthor: parentReply?.author
    });
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      newSet.delete(replyId);
      return newSet;
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colorKeys = Object.keys(availableColors);
    const index = name.length % colorKeys.length;
    return availableColors[colorKeys[index]].value;
  };

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };
  const gridPattern = isDark ? "bg-grid-pattern-dark" : "bg-grid-pattern-light";
  const gradientOverlay = isDark
    ? "bg-gradient-to-br from-dark-bg-primary/90 via-transparent to-dark-bg-primary/50"
    : "bg-gradient-to-br from-light-bg-primary/90 via-transparent to-light-bg-primary/50";

  return (
    <div className="min-h-screen  " style={{ backgroundColor: colors.bgPrimary, color: colors.textPrimary }}>
      {/* Header - 100xDevs style */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        className={`absolute inset-0 -z-10 bg-[size:30px_30px] ${gridPattern}`}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 ${gradientOverlay}`} />
      </motion.div>

      <div className="border-b" style={{ borderColor: colors.border, backgroundColor: colors.bgPrimary }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded hover:bg-opacity-80" style={{ backgroundColor: colors.bgHover }}>
              <ArrowLeft size={20} onClick={()=>Navigate("/Questions")} />
            </button>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-white text-sm"
                style={{ backgroundColor: getAvatarColor(question.author.name) }}
              >
                {getInitials(question.author.name)}
              </div>
              <span className="font-medium">{question.author.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Question Card - 100xDevs style with horizontally aligned vote buttons */}
        <div className="py-6 border-b" style={{ borderColor: colors.border }}>
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-4 leading-tight">{question.title}</h1>
            <div className="mb-4">
              <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
                {question.excerpt}
              </p>
            </div>
            
            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 rounded text-xs"
                    style={{ 
                      backgroundColor: colors.bgHover, 
                      color: colors.textSecondary
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta info with horizontally aligned vote buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm" style={{ color: colors.textMuted }}>
                  Updated {question.updatedAgo || 'recently'}
                </div>
                
                {/* Vote Section - Aligned horizontally */}
                <div className="flex items-center gap-2">
  
                <button
                    onClick={() => upvote(question.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-opacity-80 transition-colors"
                    style={{ backgroundColor: colors.bgHover, color: colors.textMuted }}
                >
                    <ArrowBigUp size={16} />
                    <span className="text-sm font-medium">{question.upvotes}</span>
                </button>

                {/* Downvote Button */}
                <button
                    onClick={() => downvote(question.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-opacity-80 transition-colors"
                    style={{ backgroundColor: colors.bgHover, color: colors.textMuted }}
                >
                    <ArrowBigDown size={16} />
                    <span className="text-sm font-medium">{question.downvotes}</span>
                </button>
                </div>

              </div>
              
              <button 
                onClick={() => bookmark(question.id)}
                className="p-2 rounded hover:bg-opacity-80 transition-colors"
                style={{ backgroundColor: colors.bgHover }}
              >
                <Bookmark 
                  size={16} 
                  style={{ color: question.bookmarked ? colors.warning : colors.textMuted }}
                  fill={question.bookmarked ? colors.warning : 'none'}
                />
              </button>
            </div>
          </div>
        </div>

        
        <div className="py-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold">
                {organizedReplies.length} {organizedReplies.length === 1 ? 'Reply' : 'Replies'}
              </h3>
              <div className="flex items-center gap-2">
                <Reply size={16} style={{ color: colors.textMuted }} />
                <span className="text-sm" style={{ color: colors.textMuted }}>Reply</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 rounded text-sm hover:bg-opacity-80" style={{ 
              backgroundColor: colors.bgHover, 
              color: colors.textMuted 
            }}>
              <span>Sort by</span>
            </button>
          </div>
        </div>

        
        <div className="py-4">
          {organizedReplies.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={32} className="mx-auto mb-3 opacity-30" style={{ color: colors.textMuted }} />
              <p style={{ color: colors.textMuted }}>No replies yet. Be the first to respond!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {organizedReplies.map(reply => (
                <ReplyThread
                  key={reply.id}
                  reply={reply}
                  colors={colors}
                  expandedReplies={expandedReplies}
                  handleInlineReplySubmit={handleInlineReplySubmit}
                  setExpandedReplies={setExpandedReplies}
                  getInitials={getInitials}
                  getAvatarColor={getAvatarColor}
                />
              ))}
            </div>
          )}
        </div>

        
        <div className="py-6 border-t" style={{ borderColor: colors.border }}>
          {!showReplyEditor ? (
            <button 
              onClick={() => setShowReplyEditor(true)} 
              className="w-full p-4 text-left rounded border hover:bg-opacity-80 transition-colors" 
              style={{ 
                backgroundColor: colors.bgCard, 
                borderColor: colors.border,
                color: colors.textMuted 
              }}
            >
              Add a reply...
            </button>
          ) : (
            <div>
              <textarea 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                className="w-full h-32 p-4 rounded border resize-none text-sm" 
                style={{ 
                  backgroundColor: colors.bgCard, 
                  borderColor: colors.border, 
                  color: colors.textPrimary
                }} 
                placeholder="Write your reply..."
              />
              <div className="flex justify-end gap-3 mt-3">
                <button 
                  onClick={() => setShowReplyEditor(false)} 
                  className="px-4 py-2 rounded text-sm hover:bg-opacity-80 transition-colors" 
                  style={{ color: colors.textMuted, backgroundColor: colors.bgHover }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleMainReplySubmit} 
                  className="px-6 py-2 rounded text-white text-sm hover:bg-opacity-90 transition-colors" 
                  style={{ backgroundColor: colors.accent }}
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

// Reply Thread Component - Vote buttons aligned horizontally with Reply button
function ReplyThread({ reply, colors, expandedReplies, handleInlineReplySubmit, setExpandedReplies, getInitials, getAvatarColor }) {
  return (
    <div className="flex gap-3">
      {/* Reply Content */}
      <div className="flex-1 min-w-0">
        {/* Author and metadata */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0"
            style={{ backgroundColor: getAvatarColor(reply.author) }}
          >
            {getInitials(reply.author)}
          </div>
          
          <span className="font-medium text-sm truncate" style={{ color: colors.textPrimary }}>
            {reply.author}
          </span>
          
          {reply.replyToAuthor && (
            <>
              <span className="text-xs whitespace-nowrap" style={{ color: colors.textMuted }}>
                replied to
              </span>
              <span className="font-medium text-xs truncate" style={{ color: colors.accent }}>
                {reply.replyToAuthor}
              </span>
            </>
          )}
          
          <span className="text-xs whitespace-nowrap ml-auto" style={{ color: colors.textMuted }}>
            {reply.updatedAgo || 'just now'}
          </span>
        </div>

        {/* Reply text */}
        <div className="mb-3">
          <p className="text-sm leading-relaxed break-words" style={{ color: colors.textSecondary }}>
            {reply.text}
          </p>
        </div>

        {/* Reply button and Vote buttons aligned horizontally */}
        <div className="flex items-center gap-4">
          {/* Reply button - only for top-level replies */}
          {!reply.parentId && (
            <button
              onClick={() =>
                setExpandedReplies(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(reply.id)) newSet.delete(reply.id);
                  else newSet.add(reply.id);
                  return newSet;
                })
              }
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs hover:bg-opacity-10 transition-colors"
              style={{ color: colors.textMuted }}
            >
              <Reply size={12} />
              Reply
            </button>
          )}

          {/* Vote Section - Aligned with reply button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => upvote(reply.id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-opacity-10 transition-colors group"
              style={{ color: colors.textMuted }}
            >
              <ArrowBigUp size={14} className="group-hover:scale-110 transition-transform" />
            </button>
            
            <span 
              className="text-xs font-medium min-w-[20px] text-center"
              style={{ color: colors.textSecondary }}
            >
              {reply.upvotes || 0}
            </span>
            
            <button
              onClick={() => downvote(reply.id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-opacity-10 transition-colors group"
              style={{ color: colors.textMuted }}
            >
              <ArrowBigDown size={14} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Inline Reply Editor */}
        {expandedReplies.has(reply.id) && (
          <div className="mb-4 mt-3">
            <InlineReplyEditor
              replyId={reply.id}
              onSubmit={handleInlineReplySubmit}
              onCancel={() =>
                setExpandedReplies(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(reply.id);
                  return newSet;
                })
              }
              colors={colors}
            />
          </div>
        )}

        {/* Nested Replies */}
        {reply.children && reply.children.length > 0 && (
          <div className="mt-4 border-l pl-4 space-y-4" style={{ borderColor: colors.border, borderLeftWidth: '1px' }}>
            {reply.children.map(child => (
              <ReplyThread
                key={child.id}
                reply={child}
                colors={colors}
                expandedReplies={expandedReplies}
                handleInlineReplySubmit={handleInlineReplySubmit}
                setExpandedReplies={setExpandedReplies}
                getInitials={getInitials}
                getAvatarColor={getAvatarColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

 
function InlineReplyEditor({ replyId, onSubmit, onCancel, colors }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(replyId, text);
    setText("");
  };

  return (
    <div className="mt-3 p-3 rounded border" style={{ backgroundColor: colors.bgCard, borderColor: colors.border }}>
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        className="w-full h-24 p-3 rounded border resize-none text-sm" 
        style={{ 
          backgroundColor: colors.bgHover, 
          borderColor: colors.border, 
          color: colors.textPrimary 
        }} 
        placeholder="Write your reply..."
      />
      <div className="flex justify-end gap-2 mt-2">
        <button 
          onClick={onCancel} 
          className="px-3 py-1 rounded text-sm hover:bg-opacity-80 transition-colors" 
          style={{ color: colors.textMuted, backgroundColor: colors.bgHover }}
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          className="px-4 py-1 rounded text-white text-sm hover:bg-opacity-90 transition-colors" 
          style={{ backgroundColor: colors.accent }}
        >
          Reply
        </button>
      </div>
    </div>
  );
}