import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export const NotFoundPage = () => (
	<div className="min-h-screen grid place-items-center text-center">
		<div className="space-y-3">
			<h1 className="text-5xl font-bold">404</h1>
			<p className="text-muted-foreground">Ruta no encontrada</p>
			<Button asChild>
				<Link to="/">Volver al inicio</Link>
			</Button>
		</div>
	</div>
);
