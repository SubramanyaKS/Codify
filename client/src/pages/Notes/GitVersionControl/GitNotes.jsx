import React, { useState, useEffect } from 'react'
import Loader from '../../../components/Loader'
import { Routes, Route, useLocation } from 'react-router-dom'
import useMobile from '../../../hooks/useMobile'
import Breadcrumb from '../../../components/Breadcrumb'
import NotesSidebar from '../NotesSidebar'
import categories from './GitTopics.json';
import { Link } from 'react-router-dom';
import { FiGitBranch, FiBookOpen, FiChevronRight, FiZap } from 'react-icons/fi';
import CodeBlock from '../components/CodeBlock';

// ROUTES
import GitVersionControl from './GitTopics/Introduction/GitVersionControl';
import BenefitsOfVersionControl from './GitTopics/Introduction/BenefitsOfVersionControl'




const GitHeroPage = () => {
  const features = [
    {
      icon: <FiGitBranch className='w-6 h-6 text-primary-600 dark:text-primary-400' />,
      title: 'Version Control Explained',
      description: 'Understand the core concepts of version control and why Git is essential for modern development.'
    },
    {
      icon: <FiBookOpen className='w-6 h-6 text-primary-600 dark:text-primary-400' />,
      title: 'Essential Commands',
      description: 'Learn the most important Git commands with clear explanations and practical examples.'
    },
    {
      icon: <FiZap className='w-6 h-6 text-primary-600 dark:text-primary-400' />,
      title: 'Collaborate Effectively',
      description: 'Master branching, merging, and pull requests to work seamlessly in team environments.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Master <span className="text-primary-600 dark:text-primary-400">Git & Version Control</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Dive into the world of Git to track changes, collaborate with ease, and manage your codebase like a professional.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/notes/git/what-is-version-control"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
          >
            Get Started with Git
            <FiChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
          What You'll Learn About Git
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 flex items-center justify-center bg-primary-50 dark:bg-primary-900/30 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start Section */}
      <section className="mt-16 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Git Quick Start: Basic Workflow</h2>
        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Initialize a repo, add, and commit</h3>
          <CodeBlock
            code={`# Initialize a new Git repository
git init

# Add a file to the staging area
git add index.html

# Commit changes with a message
git commit -m "Initial commit: Add index.html"

# Check the status of your repository
git status

# View commit history
git log`}
          />
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            These are the very first steps to use Git in a new project. Try them in your terminal!
          </p>
        </div>
      </section>
    </div>
  );
};


const GitNotes = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMobile(768);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="relative min-h-screen">
      {/* Background grid and gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[size:30px_30px]">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-bg-primary/90 via-transparent to-dark-bg-primary/50"></div>
      </div>

      <div className="flex min-h-screen relative">
        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:sticky top-14 sm:top-16 left-0 h-[calc(100vh-3.6rem)] sm:h-[calc(100vh-4rem)] z-30
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:w-64 w-64
        `}>
          <NotesSidebar categories={categories} title={"Git Fundamentals"} basePath={"/notes/git"} onNavigate={toggleSidebar} />
        </div>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'md:ml-0'}`}>
          {/* Breadcrumb */}
          <Breadcrumb isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} className={"p-4"} />

          {/* Page Title Manager */}
          {/* <GitPageTitleManager /> */}

          {/* ROUTES OF THE SUB NOTES */}
          <div className="p-4 md:p-8">
            <React.Suspense fallback={<Loader />}>
              <Routes>
                <Route index element={<GitHeroPage />} />

                {/* Introduction */}
                <Route path="what-is-version-control" element={<GitVersionControl />} />
                <Route path="benefits-of-version-control" element={<BenefitsOfVersionControl />} />

              </Routes>
            </React.Suspense>
          </div>

        </main>
      </div>
    </div>
  )
}

export default GitNotes
