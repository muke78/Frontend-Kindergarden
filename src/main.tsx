import { App } from "@/App";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "@styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "animate.css";

const queryClient = new QueryClient();
// const GOOGLE_ID_CLIENT = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
