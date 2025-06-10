import { Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from "./pages/landing/LandingPage";
import { Navbar } from "./components/ui/Navbar";
import BlogPage from "./pages/blog/BlogPage";
import AboutPage from "./pages/about/AboutPage";
import PlanPage from "./pages/plan/PlanPage";
import LoginPage from './pages/auth/LoginPage';
import { AnimatePresence } from 'framer-motion';
import RegisterPage from './pages/auth/RegisterPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './pages/auth/PrivateRoute';
import { PublicRoute } from './pages/auth/PublicRoute';


export default function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <ToastContainer
          position="top-right" // Vị trí hiển thị toast
          autoClose={3000}    // Tự động đóng sau 3 giây
          hideProgressBar={false} // Hiển thị thanh tiến trình đóng
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // Hoặc "light", "dark", "colored"
        />
        <AuthProvider>
          <Navbar />
          <AnimatePresence mode="wait" initial={false}>

            <Routes location={location} key={location.pathname}>
              <Route path='/' element={<LandingPage />} />
              <Route element={<PublicRoute />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
              </Route>
              <Route path='/blog' element={<BlogPage />} />
              <Route path='/about' element={<AboutPage />} />
              {/* <Route path='/plan' element={} /> */}

              <Route element={<PrivateRoute />}>
                <Route path='/plan' element={<PlanPage />} />
                {/* <Route path='/profile' element={<PrrofilePage />} /> */}
              </Route>

              {/* route chỉ dành cho admin */}
              <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'CONTENT_ADMIN']} />}>
                <Route path='/admin/*' element={<div>Admin Dashboard</div>} />

              </Route>
            </Routes>

          </AnimatePresence>
        </AuthProvider>
      </main>
    </div>
  );
}