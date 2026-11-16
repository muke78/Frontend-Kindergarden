import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Loader2, MapPin, Navigation, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Address = { state: string; suburb: string; street: string };

type Props = {
	onSelect: (addr: Address) => void;
	defaultCenter?: [number, number];
};

type SearchResult = {
	lat: string;
	lon: string;
	display_name: string;
	address: Record<string, string>;
};

const DEFAULT_CENTER: [number, number] = [19.4326, -99.1332]; // CDMX

const ClickHandler = ({ onPlace }: { onPlace: (lat: number, lng: number) => void }) => {
	useMapEvents({ click: (e) => onPlace(e.latlng.lat, e.latlng.lng) });
	return null;
};

const FlyTo = ({ position }: { position: [number, number] | null }) => {
	const map = useMap();
	useEffect(() => {
		if (position) map.flyTo(position, 16);
	}, [position, map]);
	return null;
};

// Fuerza recálculo del tamaño del mapa cuando el diálogo termina de abrir
const ResizeFix = () => {
	const map = useMap();
	useEffect(() => {
		const t = setTimeout(() => map.invalidateSize(), 250);
		return () => clearTimeout(t);
	}, [map]);
	return null;
};

const parseNominatim = (address: Record<string, string>): Address => {
	const state = address.state ?? address.state_district ?? address.county ?? "";
	const suburb =
		address.suburb ??
		address.neighbourhood ??
		address.quarter ??
		address.village ??
		address.town ??
		address.city ??
		"";
	const road = address.road ?? address.pedestrian ?? address.footway ?? "";
	const number = address.house_number ?? "";
	const street = number ? `${road} ${number}`.trim() : road;
	return { state, suburb, street };
};

export const LocationPicker = ({ onSelect, defaultCenter }: Props) => {
	const [open, setOpen] = useState(false);
	const [pin, setPin] = useState<[number, number] | null>(null);
	const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
	const [status, setStatus] = useState<"idle" | "geocoding" | "searching" | "geo-error">("idle");
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const center = defaultCenter ?? DEFAULT_CENTER;

	const reset = () => {
		setPin(null);
		setFlyTo(null);
		setResults([]);
		setSearchQuery("");
		setStatus("idle");
	};

	const reverseGeocode = async (lat: number, lng: number) => {
		setStatus("geocoding");
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
				{ headers: { "Accept-Language": "es-MX,es" } },
			);
			const data = await res.json();
			onSelect(parseNominatim(data.address ?? {}));
		} catch {
			// silent — el usuario puede editar los campos manualmente
		} finally {
			setStatus("idle");
		}
	};

	const handleMapClick = (lat: number, lng: number) => {
		setPin([lat, lng]);
		setResults([]);
		reverseGeocode(lat, lng);
	};

	// Búsqueda con debounce → lista de resultados
	const runSearch = async (q: string) => {
		if (q.trim().length < 3) {
			setResults([]);
			return;
		}
		setStatus("searching");
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6&countrycodes=mx`,
				{ headers: { "Accept-Language": "es-MX,es" } },
			);
			setResults(await res.json());
		} catch {
			setResults([]);
		} finally {
			setStatus("idle");
		}
	};

	const onQueryChange = (v: string) => {
		setSearchQuery(v);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => runSearch(v), 450);
	};

	const pickResult = (r: SearchResult) => {
		const lat = parseFloat(r.lat);
		const lng = parseFloat(r.lon);
		setPin([lat, lng]);
		setFlyTo([lat, lng]);
		setResults([]);
		setSearchQuery(r.display_name.split(",").slice(0, 2).join(", "));
		onSelect(parseNominatim(r.address ?? {}));
	};

	const handleCurrentLocation = () => {
		if (!navigator.geolocation) {
			setStatus("geo-error");
			return;
		}
		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				const pos: [number, number] = [coords.latitude, coords.longitude];
				setPin(pos);
				setFlyTo(pos);
				reverseGeocode(coords.latitude, coords.longitude);
			},
			() => setStatus("geo-error"),
		);
	};

	return (
		<>
			<Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
				<MapPin className="mr-2 h-4 w-4" />
				Seleccionar en mapa
			</Button>

			<Dialog
				open={open}
				onOpenChange={(o) => {
					setOpen(o);
					if (!o) reset();
				}}
			>
				<DialogContent className="max-w-2xl gap-3">
					<DialogHeader>
						<DialogTitle>Ubicación</DialogTitle>
					</DialogHeader>

					<div className="relative">
						<div className="flex gap-2">
							<div className="relative flex-1">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Busca calle, colonia o ciudad..."
									className="pl-8"
									value={searchQuery}
									onChange={(e) => onQueryChange(e.target.value)}
									autoFocus
								/>
								{status === "searching" && (
									<Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
								)}
							</div>
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={handleCurrentLocation}
								title="Usar mi ubicación"
							>
								<Navigation className="h-4 w-4" />
							</Button>
						</div>

						{/* Dropdown de resultados */}
						{results.length > 0 && (
							<div className="absolute z-[1100] mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
								{results.map((r) => (
									<button
										key={`${r.lat}-${r.lon}`}
										type="button"
										onClick={() => pickResult(r)}
										className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-muted/60"
										title={r.display_name}
									>
										{r.display_name}
									</button>
								))}
							</div>
						)}
					</div>

					<p
						className={`text-xs ${status === "geo-error" ? "text-destructive" : "text-muted-foreground"}`}
					>
						{status === "geocoding"
							? "Obteniendo dirección..."
							: status === "geo-error"
								? "No se pudo obtener tu ubicación"
								: "Busca arriba o haz clic en el mapa para fijar el punto"}
					</p>

					<div className="h-[380px] w-full overflow-hidden rounded-md border">
						<MapContainer
							center={center}
							zoom={13}
							style={{ height: "100%", width: "100%" }}
							attributionControl={false}
						>
							<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
							<ClickHandler onPlace={handleMapClick} />
							<FlyTo position={flyTo} />
							<ResizeFix />
							{pin && <Marker position={pin} />}
						</MapContainer>
					</div>

					<div className="flex justify-end">
						<Button type="button" onClick={() => setOpen(false)}>
							Listo
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
