import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from "./components/ui/Navbar";
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
// import { PrivateRoute } from './pages/auth/PrivateRoute';
// import { PublicRoute } from './pages/auth/PublicRoute';
import { appRoutes, type AppRoute } from './routes/routes';

export default function App() {
  const location = useLocation();

  // Hàm này sẽ phức tạp hơn một chút để xử lý nested routes
  const renderRoutesRecursive = (routesConfig: AppRoute[]) => {
    return routesConfig.map((route) => {
      let element = route.element;

      if (route.layout) {
        const LayoutComponent = route.layout;
        element = <LayoutComponent>{element}</LayoutComponent>;
      }

      // Lưu ý: Với cách này, PrivateRoute/PublicRoute được dùng làm element của Route cha
      // và sẽ render Outlet, không render children trực tiếp.
      // Do đó, logic if (route.isPrivate) / if (route.isPublic) KHÔNG CẦN NỮA ở đây
      // Thay vào đó, bạn sẽ định nghĩa PrivateRoute/PublicRoute làm element cho Route cha trong appRoutes

      return (
        <Route
          key={route.path}
          path={route.path}
          element={element} // element ở đây là LandingPage, LoginPage, v.v.
        >
          {/* Render children routes */}
          {route.children && renderRoutesRecursive(route.children)}
        </Route>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <AuthProvider>
          {location.pathname !== '/' && <Navbar />}

          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              {renderRoutesRecursive(appRoutes)}
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </main>
    </div>
  );
}
