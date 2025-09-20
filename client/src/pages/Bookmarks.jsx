import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../store/auth"; 
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";

const Bookmarks = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { API, isLoggedIn } = useAuth();

  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/v1/bookmarks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setBookmarks(data.data || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };

    fetchBookmarks();
  }, [API, isLoggedIn]);

  const toggleBookmark = async (item) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/api/v1/bookmarks/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: item.name }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookmarks(prev => prev.filter(b => b.name !== item.name));
        toast.success(data.message || "Bookmark removed!");
      } else {
        toast.error(data.message || "Failed to update bookmark");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const filteredBookmarks = {
    roles: bookmarks.filter(b => b.type === "role" && b.name.toLowerCase().includes(searchQuery.toLowerCase())),
    skills: bookmarks.filter(b => b.type === "skill" && b.name.toLowerCase().includes(searchQuery.toLowerCase())),
  };

  // Animation variants (copied from Roadmap.js)
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } } };
  const cardVariants = { hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }, hover: { y: -8, scale: 1.02, transition: { duration: 0.2, ease: "easeInOut" } } };
  const buttonVariants = { initial: { scale: 1 }, hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } }, tap: { scale: 0.98, transition: { duration: 0.1 } } };
  const iconVariants = { initial: { x: 0 }, hover: { x: 4, transition: { duration: 0.2, ease: "easeInOut" } } };
  const backgroundVariants = { hidden: { opacity: 0, scale: 1.05 }, visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } } };
  const headerVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const sectionHeaderVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } };
  const rolesSectionVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.4, duration: 0.4 } } };
  const skillsSectionVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.6, duration: 0.4 } } };
  const ctaSectionVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.6, ease: "easeOut" } } };

  return (
    <div className={`relative min-h-screen-minus-nav overflow-hidden z-10 ${isDark ? 'bg-dark-bg-primary text-dark-text-primary' : 'bg-light-bg-primary text-light-text-primary'}`}>
      {/* Background */}
      <motion.div variants={backgroundVariants} initial="hidden" animate="visible" className={`absolute top-0 left-0 w-full h-full -z-10 bg-[size:30px_30px] ${isDark ? 'bg-grid-pattern-dark' : 'bg-grid-pattern-light'}`}>
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-dark-bg-primary/90 via-transparent to-dark-bg-primary/50' : 'bg-gradient-to-br from-light-bg-primary/90 via-transparent to-light-bg-primary/50'}`}></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Header */}
        <motion.div variants={headerVariants} initial="hidden" animate="visible" className="text-center mb-12">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-righteous tracking-wider mb-4 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>Bookmarked Roadmaps</h1>
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} className={`h-1 rounded-full bg-gradient-to-r ${isDark ? 'from-primary via-primary-dark to-primary' : 'from-primary via-primary-dark to-primary'}`}></motion.div>
        </motion.div>

        {/* Search */}
        <motion.div className="mb-16 flex flex-col items-center space-y-6">
          <motion.div className="relative w-full max-w-2xl">
            <div className={`relative rounded-2xl overflow-hidden ${isDark ? 'bg-dark-bg-secondary border border-dark-border' : 'bg-light-bg-secondary border border-light-border'} transition-all duration-300`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 text-lg placeholder-opacity-50 bg-transparent border-none outline-none focus:ring-0 ${isDark ? 'text-dark-text-primary placeholder-dark-text-secondary' : 'text-light-text-primary placeholder-light-text-secondary'}`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className={`absolute inset-y-0 right-0 pr-4 flex items-center ${isDark ? 'text-dark-text-secondary hover:text-dark-text-primary' : 'text-light-text-secondary hover:text-light-text-primary'} transition-colors duration-200`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Role Bookmarks Section */}
        {(activeFilter === 'all' || activeFilter === 'roles') && filteredBookmarks.roles.length > 0 && (
          <motion.section variants={rolesSectionVariants} initial="hidden" animate="visible" className="mb-24">
            <motion.div variants={sectionHeaderVariants} initial="hidden" animate="visible" className="flex items-center justify-center mb-12">
              <div className={`h-px flex-1 ${isDark ? 'bg-dark-border' : 'bg-light-border'}`}></div>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-righteous tracking-wider px-4 sm:px-8 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>Role Based Bookmarks</h2>
              <div className={`h-px flex-1 ${isDark ? 'bg-dark-border' : 'bg-light-border'}`}></div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBookmarks.roles.map((item, idx) => (
                <motion.div key={idx} variants={cardVariants} whileHover="hover" className={`group relative p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg flex flex-col justify-between min-h-[300px] hover:border-b-2 hover:border-r-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl  ${isDark ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl' : 'bg-light-bg-secondary border border-light-border hover:border-primary/50'} transition-all duration-300 overflow-hidden`}>
                  <button onClick={() => toggleBookmark(item)} className="absolute top-4 right-4 z-20 text-primary hover:text-primary-dark">
                    <FaBookmark size={22}/>
                  </button>

                  <motion.div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-4 flex items-center justify-center ${isDark ? 'bg-dark-bg-primary' : 'bg-light-bg-primary'}`} whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <span className="text-xl sm:text-2xl">{item.icon || "⚡"}</span>
                  </motion.div>

                  <div className="flex-1 relative z-10">
                    <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 leading-tight ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} group-hover:text-primary transition-colors duration-300`}>
                      {item.name || 'Untitled Roadmap'}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} mb-6`}>
                      Master the skills needed for this role with our comprehensive learning path.
                    </p>
                  </div>

                  <motion.a href={item.link} target="_blank" rel="noopener noreferrer" variants={buttonVariants} whileHover="hover" whileTap="tap" className="relative z-10 inline-flex items-center justify-center py-3 px-4 sm:px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base">
                    Explore Path
                    <motion.svg variants={iconVariants} className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.a>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Skill Bookmarks Section */}
        {(activeFilter === 'all' || activeFilter === 'skills') && filteredBookmarks.skills.length > 0 && (
          <motion.section variants={skillsSectionVariants} initial="hidden" animate="visible">
            <motion.div variants={sectionHeaderVariants} initial="hidden" animate="visible" className="flex items-center justify-center mb-12">
              <div className={`h-px flex-1 ${isDark ? 'bg-dark-border' : 'bg-light-border'}`}></div>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-righteous tracking-wider px-4 sm:px-8 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>Skill Based Bookmarks</h2>
              <div className={`h-px flex-1 ${isDark ? 'bg-dark-border' : 'bg-light-border'}`}></div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBookmarks.skills.map((item, idx) => (
                <motion.div key={idx} variants={cardVariants} whileHover="hover" className={`group relative p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg flex flex-col justify-between min-h-[300px] hover:border-b-2 hover:border-r-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl  ${isDark ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl' : 'bg-light-bg-secondary border border-light-border hover:border-primary/50'} transition-all duration-300 overflow-hidden`}>
                  <button onClick={() => toggleBookmark(item)} className="absolute top-4 right-4 z-20 text-primary hover:text-primary-dark">
                    <FaBookmark size={22}/>
                  </button>

                  <motion.div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg mb-4 flex items-center justify-center ${isDark ? 'bg-dark-bg-primary' : 'bg-light-bg-primary'}`} whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <span className="text-xl sm:text-2xl">{item.icon || "🎯"}</span>
                  </motion.div>

                  <div className="flex-1 relative z-10">
                    <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 leading-tight ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} group-hover:text-primary transition-colors duration-300`}>
                      {item.name || 'Untitled Roadmap'}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} mb-6 `}>
                      Master the skills needed for this role with our comprehensive learning path.
                    </p>
                  </div>

                  <motion.a href={item.link} target="_blank" rel="noopener noreferrer" variants={buttonVariants} whileHover="hover" whileTap="tap" className="relative z-10 inline-flex items-center justify-center py-3 px-4 sm:px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base">
                    Explore Path
                    <motion.svg 
                      variants={iconVariants}
                      className="ml-2 w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.a>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* CTA Section */}
        {bookmarks.length === 0 && (
          <motion.section variants={ctaSectionVariants} initial="hidden" animate="visible" className={`mt-24 text-center p-8 sm:p-12 rounded-3xl ${isDark ? 'bg-dark-bg-secondary' : 'bg-light-bg-secondary'}`}>
            <h3 className={`text-xl sm:text-2xl md:text-3xl font-righteous mb-4 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>No Bookmarks Yet</h3>
            <p className={`text-base sm:text-lg ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Go back to the Roadmaps page and bookmark your favorite learning paths to see them here.</p>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
