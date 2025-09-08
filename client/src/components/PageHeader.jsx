import React, { useState } from "react";
import { Search, Filter, Plus, ChevronDown } from "lucide-react";
import { useQuestions } from "../context/QuestionContext";
import { useTheme } from "../context/ThemeContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Modal({ children, onClose, isDark }) {
  const bgPrimary = isDark ? "bg-gray-900" : "bg-white";
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`${bgPrimary} rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto p-6 shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default function PageHeader() {
  const { search, setSearch, sort, setSort, askQuestion } = useQuestions();
  const { isDark, themeColor } = useTheme();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [questionContent, setQuestionContent] = useState("");

  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-500";
  const bgTertiary = isDark ? "bg-gray-800" : "bg-gray-100";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const bgSecondaryHover = isDark
    ? "hover:bg-gray-700/50"
    : "hover:bg-gray-200";

  const handleSubmit = () => {
    askQuestion({
      title,
      excerpt: questionContent.replace(/<[^>]+>/g, "").slice(0, 100),
      description: questionContent,
      tags: tags.split(",").map((t) => t.trim()),
    });
    setModalOpen(false);
    setTitle("");
    setTags("");
    setQuestionContent("");
  };

  return (
    <div className="space-y-6">
      {/* Header Title and Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        <div>
          <h1
            className={`text-3xl md:text-4xl font-semibold tracking-tight ${textPrimary}`}
          >
            Questions
          </h1>
          <p className={`mt-1 text-sm ${textSecondary}`}>
            Please maintain a respectful and civil tone in all interactions.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium bg-${themeColor}  text-black dark:text-white shadow hover:bg-${themeColor}-600 transition`}
        >
          <Plus size={16} /> Ask a Question
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative w-full">
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${textSecondary}`}
          >
            <Search size={18} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={`w-full rounded-xl border px-3 py-2 pl-9 pr-3 ${bgTertiary} ${textPrimary} placeholder:text-gray-400 ${borderColor} focus:outline-none focus:ring-2 focus:ring-${themeColor}/60 transition-colors`}
          />
        </div>
        <div className="flex flex-wrap gap-2 md:gap-2">
          <button
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${textSecondary} ${borderColor} ${bgSecondaryHover} transition-colors`}
          >
            <Filter size={16} /> Filters
          </button>
          <div className="relative w-full md:w-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={`appearance-none rounded-xl border px-3 py-2 pr-8 text-sm w-full md:w-auto ${bgTertiary} ${textPrimary} ${borderColor} focus:outline-none transition-colors`}
            >
              <option value="latest">Sort by: Latest</option>
              <option value="upvotes">Sort by: Upvotes</option>
              <option value="replies">Sort by: Replies</option>
            </select>
            <ChevronDown
              className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ${textSecondary} transition-colors`}
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)} isDark={isDark}>
          <h2 className={`text-xl font-bold mb-4 ${textPrimary}`}>
            Ask a Question
          </h2>
          <label className={`block mb-2 text-sm font-medium ${textPrimary}`}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full mb-4 rounded-xl border px-3 py-2 ${bgTertiary} ${textPrimary} ${borderColor} focus:outline-none focus:ring-2 focus:ring-${themeColor}/60`}
            placeholder="Enter your question title"
          />
          <label className={`block mb-2 text-sm font-medium ${textPrimary}`}>
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={`w-full mb-4 rounded-xl border px-3 py-2 ${bgTertiary} ${textPrimary} ${borderColor} focus:outline-none focus:ring-2 focus:ring-${themeColor}/60`}
            placeholder="e.g., javascript, react"
          />
          <label className={`block mb-2 text-sm font-medium ${textPrimary}`}>Question</label>
          <div className={`mb-4 ${isDark ? 'quill-dark' : ''}`}>
            <ReactQuill
              theme="snow"
              value={questionContent}
              onChange={setQuestionContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["code-block", "link"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "code-block",
                "link",
              ]}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-end gap-2 mt-2">
            <button
              onClick={() => setModalOpen(false)}
              className={`px-4 py-2 rounded-xl border ${textSecondary} ${borderColor} ${bgSecondaryHover} transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-xl bg-${themeColor}  text-black dark:text-white hover:bg-${themeColor}-600 transition-colors`}
            >
              Submit
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}