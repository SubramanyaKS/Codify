import React from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import JavaScriptNotesSidebar from './components/JavaScriptNotesSideBar';
import JsHeroPage from './components/JsHeroPage';
import Loader from '../../../components/Loader';

// Lazy load the note components
const JsIntroduction = React.lazy(() => import('./JsTopics/JsIntroduction'));
const WhatAreVariables = React.lazy(() => import('./JsTopics/WhatAreVariables'));

const JavaScriptFundamentals = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      {/* Background grid and gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[size:30px_30px]">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-bg-primary/90 via-transparent to-dark-bg-primary/50"></div>
      </div>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <JavaScriptNotesSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <React.Suspense fallback={<Loader />}>
            <Routes>
              <Route index element={<JsHeroPage />} />
              <Route path="js-introduction" element={<JsIntroduction />} />
              <Route path="what-are-variables" element={<WhatAreVariables />} />
            </Routes>
          </React.Suspense>
        </main>
      </div>
    </div>
  );
};

export default JavaScriptFundamentals;
