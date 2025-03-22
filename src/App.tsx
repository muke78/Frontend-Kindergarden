import { AuthProvider } from "@context/AuthProvider";
import { AppRouter } from "@routes/AppRouter";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Sidebar } from "./components/Sidebar";

export const App = () => {
  return (
    <AuthProvider>
      <Sidebar />
      <AppRouter />
      <ReactQueryDevtools initialIsOpen={true} buttonPosition="top-right" />
    </AuthProvider>
  );
};
