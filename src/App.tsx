import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from "./pages/landing";
import Login from "./components/register/Login";
import Register from "./components/register/Register";
import { Navbar } from "./components/shared/Navbar";
import BlogPage from "./pages/blog/BlogPage";
import AboutPage from "./pages/about/AboutPage";
import PlanPage from "./pages/plan/PlanPage";

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-1  pt-16">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/blog' element={<BlogPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/plan' element={<PlanPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (

    <AppContent />

  );
}
