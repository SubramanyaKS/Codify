import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useTheme } from "../context/ThemeContext";
import { RiMenu3Fill } from "react-icons/ri";
import { FaGraduationCap } from "react-icons/fa";
import ThemeSwitcher from "./ThemeSwitcher";
import ThemeColorSelector from "./ThemeColorSelector";
import MobileMenu from "./MobileMenu";

function NavBar() {
  const { isLoggedIn, userdata } = useAuth();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = theme === 'dark';

  // Function to handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Close mobile menu when window is resized to desktop size
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle the side menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
    className={`
      sticky top-0 z-50 w-full transition-all duration-300
      ${scrolled
        ? `${isDark ? 'bg-dark-bg-primary/70 border-white/50' : 'bg-light-bg-primary/70 border-black/50'} border-b-2 shadow-nav backdrop-blur-sm`
        : `${isDark ? 'border-white' : ' border-black'} border-0`}
      ${isDark ? 'text-dark-text-primary' : 'text-white'}
    `}
    >
      <div className=" mx-auto px-4 sm:px-6 lg:4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className={`flex items-center space-x-2 font-bold text-xl text-primary-500 transition-colors`}>
              <FaGraduationCap className="text-2xl" />
              <span className="font-righteous">Codify</span>
            </NavLink>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) => `
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : `${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} hover:bg-primary-400 hover:text-white`}
                `}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => `
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : `${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} hover:bg-primary-400 hover:text-white`}
                `}
              >
                About
              </NavLink>
              <NavLink
                to="/courses"
                className={({ isActive }) => `
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : `${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} hover:bg-primary-400 hover:text-white`}
                `}
              >
                Courses
              </NavLink>
              <NavLink
                to="/roadmap"
                className={({ isActive }) => `
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : `${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} hover:bg-primary-400 hover:text-white`}
                `}
              >
                Roadmaps
              </NavLink>
              <NavLink
                to="/ide"
                className={({ isActive }) => `
                  px-3 py-2 rounded-md text-sm font-medium transition-colors relative
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : `${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} hover:bg-primary-400 hover:text-white`}
                `}
              >
                IDE
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">AI</span>
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => `
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : `${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} hover:bg-primary-400 hover:text-white`}
                `}
              >
                Contact
              </NavLink>
            </div>
          </div>

          {/* Right Side - Auth Buttons and Theme Controls */}
          <div className="hidden md:flex items-center justify-end gap-3 min-w-[250px]">
            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <NavLink
                  to="/logout"
                  className={`px-2 py-1.5 rounded-md text-sm font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} hover:bg-primary-400 hover:text-white transition-colors`}
                >
                  Logout
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={`px-2 py-1.5 rounded-md text-sm font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} hover:bg-primary-400 hover:text-white transition-colors`}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={`px-2 py-1.5 rounded-md text-sm font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} hover:bg-primary-400 hover:text-white transition-colors`}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>

            {/* Theme Controls */}
            <div className="flex items-center gap-2 border-l pl-3 border-gray-200 dark:border-gray-700">
              <ThemeSwitcher />
              <ThemeColorSelector />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeSwitcher />
            <ThemeColorSelector />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <RiMenu3Fill className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        isLoggedIn={isLoggedIn}
        userdata={userdata}
      />
    </nav>
  );
}

export default NavBar;
// src/components/NavBar.jsx
// import React, { useEffect, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../store/auth';
// import './css/Navbar.css'; // Import your CSS styles
// import { RiCloseLargeLine, RiMenu3Fill } from 'react-icons/ri';

// const NavBar = () => {
//   const { isLoggedIn, LogoutUser, userdata } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
//   const navigate = useNavigate();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleLogout = () => {
//     LogoutUser();
//     navigate('/login'); // Redirect to login after logout
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 1024);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <h1>Codify</h1>
//         {isMobile ? (
//           <button onClick={toggleMenu} className="menu-toggle">
//             {isMenuOpen ? <RiCloseLargeLine /> : <RiMenu3Fill />}
//           </button>
//         ) : null}
//       </div>
//       {(isMenuOpen || !isMobile) && (
//         <ul className="navbar-links">
//           <li>
//             <NavLink to="/courses" onClick={toggleMenu}>
//               Courses
//             </NavLink>
//           </li>
//           {isLoggedIn ? (
//             <>
//               <li>
//                 <NavLink to={userdata.isAdmin ? '/admin' : '/dashboard'} onClick={toggleMenu}>
//                   Dashboard
//                 </NavLink>
//               </li>
//               <li>
//                 <button onClick={handleLogout}>Logout</button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li>
//                 <NavLink to="/login" onClick={toggleMenu}>
//                   Login
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink to="/signup" onClick={toggleMenu}>
//                   Signup
//                 </NavLink>
//               </li>
//             </>
//           )}
//           {userdata.isAdmin && (
//             <li>
//               <NavLink to="/admin" onClick={toggleMenu}>
//                 Admin Panel
//               </NavLink>
//             </li>
//           )}
//         </ul>
//       )}
//     </nav>
//   );
// };

// export default NavBar;
