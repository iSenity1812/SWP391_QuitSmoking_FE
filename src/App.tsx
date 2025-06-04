import { Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from "./pages/landing";
import { Navbar } from "./components/shared/Navbar";
import BlogPage from "./pages/blog/BlogPage";
import AboutPage from "./pages/about/AboutPage";
import PlanPage from "./pages/plan/PlanPage";
import LoginPage from './pages/login';
import { AnimatePresence } from 'framer-motion';
import RegisterPage from './pages/register';

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