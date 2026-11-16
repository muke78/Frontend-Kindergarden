import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/common/ThemeProvider";
import { queryClient } from "@/lib/queryClient";
import { AppRouter } from "@/routes/AppRouter";

export const App = () => (
	<QueryClientProvider client={queryClient}>
		<ThemeProvider>
			<BrowserRouter>
				<AppRouter />
				<Toaster position="bottom-right" richColors closeButton theme="system" />
			</BrowserRouter>
		</ThemeProvider>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);
