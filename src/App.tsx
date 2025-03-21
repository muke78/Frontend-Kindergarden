import { AuthProvider } from "@context/AuthProvider";
import { AppRouter } from "@routes/AppRouter";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
      <ReactQueryDevtools initialIsOpen={true} buttonPosition="top-right" />
    </AuthProvider>
  );
};
