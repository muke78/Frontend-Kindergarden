import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./routes/AppRouter";

export const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};
