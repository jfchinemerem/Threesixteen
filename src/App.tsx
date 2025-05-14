import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/home";
import React from "react";
import routes from "tempo-routes";
import Profile from "./pages/Profile";
import Wishlists from "./pages/Wishlists";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Settings from "./pages/Settings";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>} className="w-[400] h-[400]">
      <>
        {/* For the tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/wishlists" element={<Wishlists />} />
          <Route path="/wishlists/:wishlistId" element={<Wishlists />} />
          <Route path="/settings" element={<Settings />} />

          {/* Add this before the catchall route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={null} />
          )}

          {/* Catch all other routes and redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
