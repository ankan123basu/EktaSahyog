import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/layout/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';

// Lazy Loaded Pages & Games
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Chat = lazy(() => import('./pages/Chat'));
const MapPage = lazy(() => import('./pages/Map'));
const Projects = lazy(() => import('./pages/Projects'));
const Stories = lazy(() => import('./pages/Stories'));
const Culture = lazy(() => import('./pages/Culture'));
const Resources = lazy(() => import('./pages/Resources'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ShippingForm = lazy(() => import('./pages/ShippingForm'));
const CulturalGames = lazy(() => import('./pages/CulturalGames'));
const CulturalHotspots = lazy(() => import('./pages/CulturalHotspots'));
const UnityCouncil = lazy(() => import('./pages/UnityCouncil'));

// Lazy Loaded Mini-Games
const ChessGame = lazy(() => import('./pages/games/ChessGame'));
const RubiksGame = lazy(() => import('./pages/games/RubiksGame'));
const MokshaPatam = lazy(() => import('./pages/games/MokshaPatam'));
const Pallanguzhi = lazy(() => import('./pages/games/Pallanguzhi'));
const Ganjifa = lazy(() => import('./pages/games/Ganjifa'));
const JnanaYatra = lazy(() => import('./pages/games/JnanaYatra'));
const AaduPuli = lazy(() => import('./pages/games/AaduPuli'));
const Chakravyuha = lazy(() => import('./pages/games/Chakravyuha'));

// Heavy WebGL & WebRTC pages
const Metaverse = lazy(() => import('./pages/Metaverse'));
const DrishtiMilan = lazy(() => import('./pages/DrishtiMilan'));

import Cursor from './Components/ui/Cursor';
import SplashCursor from './Components/ui/SplashCursor';
import AIAssistant from './Components/features/AIAssistant';
import Footer from './Components/layout/Footer';
import ProtectedRoute from './Components/layout/ProtectedRoute';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unity-saffron"></div>
  </div>
);

function App() {
  return (
    <Router>
      <SplashCursor />
      <AIAssistant />
      <div className="min-h-screen bg-unity-dark text-white font-body selection:bg-unity-saffron selection:text-black flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Suspense fallback={<PageLoader />}>
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

              {/* Metaverse & Drishti-Milan */}
              <Route path="/metaverse" element={<ProtectedRoute><Metaverse /></ProtectedRoute>} />
              <Route path="/drishti-milan" element={<ProtectedRoute><DrishtiMilan /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;