import { ThemeProvider } from "./context/ThemeContext";
import { LandingPage } from "./pages/landing";
import { BrowserRouter } from "react-router-dom";
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    </ThemeProvider>
  );
}
