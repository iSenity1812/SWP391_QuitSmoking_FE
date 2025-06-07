import { Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from "./pages/landing/components/LandingPage";
import { Navbar } from "./components/ui/Navbar";
import BlogPage from "./pages/Blog/BlogPage";
import AboutPage from "./pages/about/AboutPage";
import PlanPage from "./pages/Plan/PlanPage";
import LoginPage from './pages/auth/LoginPage';
import { AnimatePresence } from 'framer-motion';
import RegisterPage from './pages/auth/RegisterPage';

function shouldHideNavbar(pathname: string) {
  const hiddenPaths = [
    '/login',
    '/register',
    '/admin',
    '/reset-password',
    '/forgot-password',
  ];

  // Dùng startsWith để hỗ trợ cả các route như /admin/dashboard
  return hiddenPaths.some((prefix) => pathname.startsWith(prefix));
}

export default function App() {
  const location = useLocation();
  const shouldShowNavbar = !shouldHideNavbar(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/blog' element={<BlogPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/plan' element={<PlanPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}