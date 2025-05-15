import { AppRouter } from "@routes/AppRouter";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Sidebar } from "./components/Sidebar";
import { Toast } from "./components/Toast";

export const App = () => {
  return (
    <>
      <Sidebar />
      <AppRouter />
      <Toast />
      <ReactQueryDevtools initialIsOpen={true} buttonPosition="bottom-left" />
    </>
  );
};
