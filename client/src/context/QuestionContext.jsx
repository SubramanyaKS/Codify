import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

const QuestionsContext = createContext(null);

export function useQuestions() {
  const ctx = useContext(QuestionsContext);
  if (!ctx) throw new Error("useQuestions must be used within <QuestionsProvider>");
  return ctx;
}

export function QuestionsProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // Load mock questions (simulate API)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        const mock = [
          {
            id: "q1",
            author: { name: "Muhammad Zunnoorain Rafi" },
            updatedAgo: "13 hours ago",
            title: "Video cannot be loaded",
            excerpt: "Video fails to load intermittently on course page.",
            tags: ["Server Failed", "Network Failed"],
            upvotes: 442,
            downvotes: 0,
            replies: [
              { id: "r1", author: "Admin", text: "We are checking the server logs.", updatedAgo: "12 hours ago" },
              { id: "r2", author: "Student", text: "I also face this issue sometimes.", updatedAgo: "11 hours ago" }
            ],
            bookmarked: false
          },
          {
            id: "q2",
            author: { name: "Sadam Khan" },
            updatedAgo: "1 day ago",
            title: "Other courses missing",
            excerpt: "Some tracks are missing from the dashboard menu.",
            tags: [],
            upvotes: 240,
            downvotes: 0,
            replies: [
              { id: "r3", author: "Support", text: "We temporarily removed them for updates.", updatedAgo: "22 hours ago" }
            ],
            bookmarked: false
          },
          {
            id: "q3",
            author: { name: "Ratan Pyla" },
            updatedAgo: "3 days ago",
            title: "Discord Complaint",
            excerpt: "I am unable to join discord server. Logged in with a wrong account.",
            tags: ["Discord", "Support", "Account"],
            upvotes: 135,
            downvotes: 0,
            replies: [
              { id: "r4", author: "Arsalaan", text: "Same issue here.", updatedAgo: "9 days ago" },
              { id: "r5", author: "AMAN", text: "Cannot join either.", updatedAgo: "8 days ago", parentId: "r4", replyToAuthor: "Arsalaan" }
            ],
            bookmarked: false
          },
          {
            id: "q4",
            author: { name: "Sushmitha Halli Sudhakara" },
            updatedAgo: "1 day ago",
            title: "Machine Learning Course Access",
            excerpt: "Cannot access videos for the ML module.",
            tags: ["ML", "Course Access"],
            upvotes: 106,
            downvotes: 0,
            replies: [],
            bookmarked: true
          }
        ];

        setQuestions(mock);
        setLoading(false);
      } catch (e) {
        setError("Failed to load questions");
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Add a new question
  const askQuestion = (payload) => {
    const newQuestion = {
      id: Math.random().toString(36).slice(2),
      author: { name: payload.author ?? "You" },
      updatedAgo: "just now",
      title: payload.title,
      excerpt: payload.excerpt ?? "",
      tags: payload.tags ?? [],
      upvotes: 0,
      downvotes: 0,
      replies: [],
      bookmarked: false
    };
    setQuestions(prev => [newQuestion, ...prev]);
  };

  // Add a reply (supports nested replies)
  const addReply = (questionId, reply) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
              ...q,
              replies: [
                ...(q.replies || []),
                {
                  id: Math.random().toString(36).slice(2),
                  author: reply.author ?? "You",
                  text: reply.text,
                  parentId: reply.parentId || null,
                  replyToAuthor: reply.replyToAuthor || null,
                  updatedAgo: "just now",
                  upvotes: 0,
                  downvotes: 0
                }
              ]
            }
          : q
      )
    );
  };

  // Voting & Bookmarking
  const upvote = (id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q));
  };

  const downvote = (id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, downvotes: q.downvotes + 1 } : q));
  };

  const bookmark = (id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, bookmarked: !q.bookmarked } : q));
  };

  // Filter & Sort
  const filtered = useMemo(() => {
    let result = [...questions];
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(q => q.title.toLowerCase().includes(term) || q.excerpt.toLowerCase().includes(term));
    }
    if (sort === "upvotes") return result.sort((a, b) => b.upvotes - a.upvotes);
    if (sort === "replies") return result.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0));
    return result; // latest by default
  }, [questions, search, sort]);

  return (
    <QuestionsContext.Provider value={{
      questions: filtered,
      loading,
      error,
      search,
      sort,
      setSearch,
      setSort,
      askQuestion,
      upvote,
      downvote,
      bookmark,
      addReply
    }}>
      {children}
    </QuestionsContext.Provider>
  );
}
