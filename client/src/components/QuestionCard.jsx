// src/components/QuestionCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowBigUp, ArrowBigDown, MessageCircle, Bookmark } from "lucide-react";
import { useQuestions } from "../context/QuestionContext";
import { useTheme } from "../context/ThemeContext";

export default function QuestionCard({ q }) {
  const { upvote, downvote, bookmark } = useQuestions();
  const { isDark } = useTheme();

  // Theme colors
  const textPrimary = isDark ? "#fff" : "#111827";
  const textSecondary = isDark ? "#d1d5db" : "#6b7280";
  const bgPrimary = isDark ? "#1f1f1f" : "#ffffff";
  const bgSecondary = isDark ? "#2d2d2d" : "#f3f4f6";
  const borderColor = isDark ? "#374151" : "#e5e7eb";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const primaryColor = "var(--color-primary)";
  const primaryColorLight = "var(--color-primary-light)";
  const primaryColorDark = "var(--color-primary-dark)";

  return (
    <div
      style={{ backgroundColor: bgPrimary, borderColor }}
      className="rounded-2xl border p-5 shadow-card flex flex-col gap-3 transition-colors"
    >
      {/* Title */}
      <Link to={`/questions/${q.id}`}>
        <h2
          style={{ color: textPrimary }}
          className="text-lg font-semibold hover:underline"
        >
          {q.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p style={{ color: textSecondary }} className="text-sm line-clamp-2">
        {q.excerpt || (q.replies?.[0]?.text ?? "")}
      </p>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {q.tags?.length > 0 ? (
          q.tags.map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: bgSecondary,
                color: textSecondary,
                borderColor,
              }}
              className="px-2 py-1 text-xs rounded-full border transition-colors"
            >
              {tag}
            </span>
          ))
        ) : (
          <span
            style={{
              backgroundColor: bgSecondary,
              color: textSecondary,
              borderColor,
            }}
            className="px-2 py-1 text-xs rounded-full border italic"
          >
            No tags
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-3 items-center pt-2">
        <button
          onClick={() => upvote(q.id)}
          style={{ borderColor, backgroundColor: hoverBg, color: textPrimary }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border text-sm"
        >
          <ArrowBigUp size={16} /> {q.upvotes}
        </button>

        <button
          onClick={() => downvote(q.id)}
          style={{ borderColor, backgroundColor: hoverBg, color: textPrimary }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border text-sm"
        >
          <ArrowBigDown size={16} /> {q.downvotes || 0}
        </button>

        <Link
          to={`/questions/${q.id}`}
          style={{ borderColor, backgroundColor: hoverBg, color: textPrimary }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border text-sm"
        >
          <MessageCircle size={16} /> {Array.isArray(q.replies) ? q.replies.length : 0} replies
        </Link>

        <button
          onClick={() => bookmark(q.id)}
          style={{
            borderColor: q.bookmarked ? primaryColor : borderColor,
            backgroundColor: q.bookmarked ? primaryColorLight : hoverBg,
            color: q.bookmarked ? primaryColorDark : textPrimary,
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border text-sm ml-auto"
        >
          <Bookmark size={16} />
          {q.bookmarked ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
