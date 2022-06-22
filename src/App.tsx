import React from 'react'
import { Search } from './components/Search';
import { UserProfile } from './components/UserProfile';
import { Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <div className="app">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<div>404: Not found!</div>} />
        </Routes>
    </div>
  );
};