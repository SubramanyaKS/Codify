import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const JS_FUNDAMENTALS = require("../../../assets/json/JSNotes.json");


const JavaScriptFundamentals = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className={`relative min-h-screen py-12 px-4 z-10 ${isDark ? 'bg-dark-bg-primary text-dark-text-primary' : 'bg-light-bg-primary text-light-text-primary'}`}>
      {/* Background grid and gradient overlay */}
      <div className={`absolute top-0 left-0 w-full h-full -z-10 bg-[size:30px_30px] ${isDark ? 'bg-grid-pattern-dark' : 'bg-grid-pattern-light'}`}>
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-dark-bg-primary/90 via-transparent to-dark-bg-primary/50' : 'bg-gradient-to-br from-light-bg-primary/90 via-transparent to-light-bg-primary/50'}`}></div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-righteous tracking-wider mb-4 transition-colors duration-300 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
            JavaScript Fundamentals
          </h1>
          <div className={`h-1 w-32 mx-auto rounded-full bg-gradient-to-r ${isDark ? 'from-primary via-primary-dark to-primary' : 'from-primary via-primary-dark to-primary'} mb-4`}></div>
          <p className={`mt-2 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            A comprehensive guide to JavaScript concepts and syntax
          </p>
        </div>
        <div className="jsfund-vertical-stack">
          {JS_FUNDAMENTALS.length === 0 ? (
            <div style={{ color: '#ff6b6b', textAlign: 'center', fontSize: '1.2rem', marginTop: '40px' }}>No notes available.</div>
          ) : (
            JS_FUNDAMENTALS.map(note => (
              <div key={note.id} className={`jsfund-card group relative p-6 rounded-2xl shadow-lg flex flex-col justify-between w-full max-w-2xl mx-auto mb-8 hover:border-b-2 hover:border-r-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl ${isDark ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl' : 'bg-light-bg-secondary border border-light-border hover:border-primary/50'} transition-all duration-300 overflow-hidden`}>
                <h2 className="text-xl font-semibold mb-4 text-primary">{note.title}</h2>
                {note.content && Array.isArray(note.content) ? (
                  <ul className="list-disc pl-5 mb-2">
                    {note.content.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : note.content ? (
                  <p className="mb-2">{note.content}</p>
                ) : null}
                {note.code && (
                  <pre className="bg-gray-950 text-blue-200 text-sm rounded-lg p-4 mt-2 overflow-x-auto border border-blue-800 font-mono">
                    <code>{note.code}</code>
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        .font-righteous {
          font-family: 'Righteous', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .jsfund-vertical-stack {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .jsfund-card {
          width: 100%;
          margin-bottom: 2rem;
        }
        @media (max-width: 600px) {
          .jsfund-card {
            min-width: 95vw;
            max-width: 99vw;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default JavaScriptFundamentals;
