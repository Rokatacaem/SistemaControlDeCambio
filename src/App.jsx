import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ChangeDashboard from './views/ChangeDashboard';
import ChangeDetail from './views/ChangeDetail';

// Mock Authentication Wrapper - In real app use MsalProvider
function RequireAuth({ children }) {
  // Check auth logic here
  const isAuthenticated = true;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<RequireAuth><ChangeDashboard /></RequireAuth>} />
          <Route path="changes/:id" element={<RequireAuth><ChangeDetail /></RequireAuth>} />
          <Route path="changes/new" element={<RequireAuth><ChangeDetail /></RequireAuth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
