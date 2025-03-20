import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./routes/AppRouter";

export const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
      <ReactQueryDevtools initialIsOpen={true} buttonPosition="bottom-left" />
    </AuthProvider>
  );
};
