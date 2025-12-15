import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/layout/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Marketplace from './pages/Marketplace';
import Chat from './pages/Chat';
import MapPage from './pages/Map';
import Projects from './pages/Projects';
import Stories from './pages/Stories';
import Culture from './pages/Culture';
import Resources from './pages/Resources';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import ShippingForm from './pages/ShippingForm'; // Added ShippingForm
import CulturalGames from './pages/CulturalGames';
import CulturalHotspots from './pages/CulturalHotspots';
import ChessGame from './pages/games/ChessGame';
import RubiksGame from './pages/games/RubiksGame';
import MokshaPatam from './pages/games/MokshaPatam';
import Pallanguzhi from './pages/games/Pallanguzhi';
import Ganjifa from './pages/games/Ganjifa';
import UnityCouncil from './pages/UnityCouncil';
import JnanaYatra from './pages/games/JnanaYatra';
import AaduPuli from './pages/games/AaduPuli';
import Chakravyuha from './pages/games/Chakravyuha';
import Metaverse from './pages/Metaverse';

import Cursor from './Components/ui/Cursor';
import SplashCursor from './Components/ui/SplashCursor';
import AIAssistant from './Components/features/AIAssistant';

import Footer from './Components/layout/Footer';
import ProtectedRoute from './Components/layout/ProtectedRoute';

function App() {
  return (
    <Router>
      <SplashCursor />
      <AIAssistant />
      <div className="min-h-screen bg-unity-dark text-white font-body selection:bg-unity-saffron selection:text-black flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/about" element={<About />} />
            <Route path="/council" element={<UnityCouncil />} />

            {/* Protected Routes */}
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/shipping/:orderId" element={<ProtectedRoute><ShippingForm /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute adminOnly><MapPage /></ProtectedRoute>} />
            <Route path="/stories" element={<ProtectedRoute><Stories /></ProtectedRoute>} />
            <Route path="/culture" element={<ProtectedRoute><Culture /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><CulturalGames /></ProtectedRoute>} />
            <Route path="/hotspots" element={<ProtectedRoute><CulturalHotspots /></ProtectedRoute>} />
            <Route path="/games/chess" element={<ProtectedRoute><ChessGame /></ProtectedRoute>} />
            <Route path="/games/rubiks" element={<ProtectedRoute><RubiksGame /></ProtectedRoute>} />
            <Route path="/games/moksha" element={<ProtectedRoute><MokshaPatam /></ProtectedRoute>} />
            <Route path="/games/pallanguzhi" element={<ProtectedRoute><Pallanguzhi /></ProtectedRoute>} />
            <Route path="/games/ganjifa" element={<ProtectedRoute><Ganjifa /></ProtectedRoute>} />
            <Route path="/games/quiz" element={<ProtectedRoute><JnanaYatra /></ProtectedRoute>} />
            <Route path="/games/aadupuli" element={<ProtectedRoute><AaduPuli /></ProtectedRoute>} />
            <Route path="/games/chakravyuha" element={<ProtectedRoute><Chakravyuha /></ProtectedRoute>} />

            {/* Metaverse - Public Route for now or Protected? Let's make it protected */}
            <Route path="/metaverse" element={<ProtectedRoute><Metaverse /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;