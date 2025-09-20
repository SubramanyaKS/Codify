import React from 'react';
import { useTheme } from '../context/ThemeContext';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full max-w-[600px] mx-auto relative z-10">


      <input
        type="text"
        placeholder="Search for courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`
          w-full py-2.5 px-5 rounded-full text-base
          ${isDark
            ? 'bg-dark-bg-secondary text-dark-text-primary border border-dark-border'
            : 'bg-light-bg-secondary text-light-text-primary border border-light-border'}
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all
        `}
      />
    </div>
  );
};

export default SearchBar;
