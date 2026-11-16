import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(() =>
		typeof window === "undefined" ? false : window.matchMedia(query).matches,
	);

	useEffect(() => {
		const media = window.matchMedia(query);
		const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
		media.addEventListener("change", handler);
		setMatches(media.matches);
		return () => media.removeEventListener("change", handler);
	}, [query]);

	return matches;
};
