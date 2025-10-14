import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/context/theme/ThemeContext.tsx"
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "@/context/auth/UserContext.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
            <UserProvider>
              <App />
            </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  // </StrictMode>,
);