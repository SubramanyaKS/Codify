import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { Navigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function LogOut() {
  const { LogoutUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      try {
        setTimeout(() => {
          LogoutUser();
          toast.success("Logged out successfully");
          setIsLoggingOut(false);
        }, 1500);
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("There was an issue logging out");
        setIsLoggingOut(false);
      }
    };
    performLogout();
  }, [LogoutUser]);

  if (!isLoggingOut) {
    return <Navigate to='/login' />;
  }

  return (
    <div className={`min-h-screen-minus-nav flex items-center justify-center ${isDark ? 'bg-dark-bg-primary' : 'bg-light-bg-primary'}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`
          max-w-md w-full p-8 rounded-2xl shadow-lg text-center border
          ${isDark ? 'bg-gradient-to-br from-gray-800 to-secondary-1000 border-dark-border' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-light-border'}
        `}
      >
        <div className="mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
        <h2 className={`text-2xl font-righteous tracking-wider mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
          Logging Out
        </h2>
        <p className={`${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          Please wait while we securely log you out...
        </p>
      </motion.div>
    </div>
  );
}

export default LogOut;
