// src/components/QuestionCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import { useQuestions } from "../context/QuestionContext";
import { useTheme } from "../context/ThemeContext";

export default function QuestionCard({ q }) {
  const { voteQuestion, voteReply, toggleBookmark } = useQuestions(); // use backend-aware functions
  const { isDark } = useTheme();

  // Theme colors
  // const textPrimary = isDark ? "#fff" : "#111827";
  // const textSecondary = isDark ? "#d1d5db" : "#6b7280";
  // const bgPrimary = isDark ? "#1f1f1f" : "#ffffff";
  // const bgSecondary = isDark ? "#2d2d2d" : "#f3f4f6";
  // const borderColor = isDark ? "#374151" : "#e5e7eb";
  // const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  // const primaryColor = "var(--color-primary)";
  // const primaryColorLight = "var(--color-primary-light)";
  // const primaryColorDark = "var(--color-primary-dark)";

  
  return (
    <div
      className={`rounded-2xl border p-5 shadow-card flex flex-col gap-3 transition-colors hover:border-b-2 hover:border-r-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl ${isDark ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl' : 'bg-light-bg-secondary border border-light-border hover:border-primary/50'} transition-all duration-300 overflow-hidden`}
    >
      {/* Title */}
      <Link to={`/questions/${q._id}`}>
        <h2
          className="text-lg text-white dark:text-black font-semibold hover:underline"
        >
          {q.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p  className="text-sm text-gray-300 dark:text-gray-700 line-clamp-2">
        {q.excerpt || (q.replies?.[0]?.text ?? "")}
      </p>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {q.tags?.length > 0 ? (
          q.tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`} // ensures uniqueness
              className="px-2 py-1 text-xs bg-primary-300 text-white dark:text-black rounded-full border transition-colors"
            >
              {tag || "Untitled"}
            </span>
          ))
        ) : (
          <span
            className="px-2 py-1 text-xs bg-primary-300 text-white dark:text-black rounded-full border italic"
          >
            No tags
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-3 items-center pt-2">
        <button
          onClick={() => voteQuestion(q._id, "upvote")}
          className="flex items-center gap-1 bg-primary hover:bg-primary-dark text-white font-semibold px-2 py-1 rounded-lg border text-sm"
        >
          <ArrowBigUp size={16} /> {q.upvotes || 0}
        </button>

        <button
          onClick={() => voteQuestion(q._id, "downvote")}
          className="flex items-center bg-primary hover:bg-primary-dark text-white font-semibold gap-1 px-2 py-1 rounded-lg border text-sm"
        >
          <ArrowBigDown size={16} /> {q.downvotes || 0}
        </button>

        <Link
          to={`/questions/${q._id}`}
          className="flex bg-primary hover:bg-primary-dark text-white font-semibold items-center gap-1 px-2 py-1 rounded-lg border text-sm"
        >
          <MessageCircle size={16} />{" "}
          {Array.isArray(q.replies) ? q.replies.length : 0} replies
        </Link>

        <button
          onClick={() => toggleBookmark(q._id)}
          className="flex bg-primary hover:bg-primary-dark text-white font-semibold items-center text-bold  gap-1 px-2 py-1 rounded-lg border text-sm ml-auto"
        >
          <Bookmark size={16} />
          {q.bookmarked ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
