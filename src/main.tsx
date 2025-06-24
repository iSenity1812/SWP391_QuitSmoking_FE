import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import ClientLayout from "./layouts/ClientLayout.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ClientLayout>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClientLayout>
    </ThemeProvider>

  </StrictMode>
);
