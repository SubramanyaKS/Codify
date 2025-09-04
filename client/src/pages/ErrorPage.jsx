import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'
import { FaHome, FaSearch, FaBook, FaQuestionCircle, FaExclamationTriangle } from 'react-icons/fa'

// Variants (reused from Login.jsx for consistency)
const backgroundVariants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};
const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};


function ErrorPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchTips, setShowSearchTips] = useState(false);

  // Fun error messages that rotate
  const errorMessages = [
    "Looks like this page took a vacation without telling us.",
    "We've looked everywhere, but this page is playing hide and seek.",
    "This page is exploring the digital wilderness.",
    "Our digital compass can't find this page.",
    "Houston, we have a problem finding this page."
  ];

  const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would redirect to search results
    // For now, we'll just clear the input
    setSearchQuery('');
    setShowSearchTips(true);
  };

  return (
    <div
      className={`relative min-h-screen-minus-nav flex items-center justify-center overflow-hidden z-10 ${
        isDark
          ? "bg-dark-bg-primary text-dark-text-primary"
          : "bg-light-bg-primary text-light-text-primary"
      }`}
    >
      {/* Animated background pattern */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        className={`absolute top-0 left-0 w-full h-full -z-10 bg-[size:30px_30px] ${
          isDark ? "bg-grid-pattern-dark" : "bg-grid-pattern-light"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-br from-dark-bg-primary/90 via-transparent to-dark-bg-primary/50"
              : "bg-gradient-to-br from-light-bg-primary/90 via-transparent to-light-bg-primary/50"
          }`}
        ></div>
      </motion.div>

      {/* Decorative gradient blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl -z-5"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl -z-5"
      ></motion.div>

      <div className="max-w-3xl mx-auto px-6 py-16 text-center relative z-10">
        {/* Illustration */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/404-error-illustration-download-in-svg-png-gif-file-formats--concept-ui-ux-empty-state-page-pack-design-development-illustrations-3119148.png?f=webp"
            alt="404 Error Illustration"
            className="w-[300px] mx-auto mb-8 animate-float drop-shadow-xl"
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-6xl font-righteous tracking-wider text-primary mb-4"
        >
          404
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="h-1 rounded-full bg-gradient-to-r from-primary via-primary-dark to-primary mx-auto mb-6"
        ></motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="text-2xl font-semibold mb-4"
        >
          Oops! Page not found
        </motion.p>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className={`text-lg mb-10 ${
            isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
          }`}
        >
          {randomMessage}
        </motion.p>

        {/* Search Box */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className={`group w-full max-w-xl p-6 rounded-2xl shadow-2xl hover:border-b-2 hover:border-r-2
    bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl
    ${isDark
              ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl"
              : "bg-light-bg-secondary border border-light-border hover:border-primary/50"
            } transition-all duration-300 overflow-hidden mb-10`}
        >
          <h2
            className={`text-lg font-semibold mb-3 flex items-center justify-center ${isDark ? "text-dark-text-primary" : "text-light-text-primary"
              }`}
          >

            <FaSearch className="mr-2" /> Try searching for what you need
          </h2>

          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for courses, topics, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-grow px-4 py-2.5 rounded-l-xl bg-transparent border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ${isDark
                    ? "border-dark-border text-dark-text-primary placeholder-dark-text-secondary"
                    : "border-light-border text-light-text-primary placeholder-light-text-secondary"
                  }`}
              />
              <motion.button
                type="submit"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-r-xl text-sm font-semibold transition-colors"
              >
                Search
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={6}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <NavLink
              to="/"
              className="py-3 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center"
            >
              <FaHome className="mr-2" /> Return to Home
            </NavLink>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <NavLink
              to="/courses"
              className={`py-3 px-6 font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center ${
                isDark
                  ? "bg-dark-bg-secondary hover:bg-dark-bg-tertiary text-dark-text-primary border border-dark-border"
                  : "bg-light-bg-secondary hover:bg-light-bg-tertiary text-light-text-primary border border-light-border"
              }`}
            >
              <FaBook className="mr-2" /> Browse Courses
            </NavLink>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <NavLink
              to="/contact"
              className={`py-3 px-6 font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center ${
                isDark
                  ? "bg-dark-bg-secondary hover:bg-dark-bg-tertiary text-dark-text-primary border border-dark-border"
                  : "bg-light-bg-secondary hover:bg-light-bg-tertiary text-light-text-primary border border-light-border"
              }`}
            >
              <FaQuestionCircle className="mr-2" /> Get Help
            </NavLink>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ErrorPage;