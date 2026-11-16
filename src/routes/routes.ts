import type { LucideIcon } from "lucide-react";
import {
	BookOpen,
	BookOpenCheck,
	Building2,
	ClipboardList,
	GraduationCap,
	Home,
	LayoutGrid,
	Move,
	Package,
	Settings,
	ShieldCheck,
	Users as UsersIcon,
} from "lucide-react";

export type NavRoute = {
	path: string;
	label: string;
	icon: LucideIcon;
	module?: string;
};

export const navRoutes: NavRoute[] = [
	{ path: "/", label: "Inicio", icon: Home },
	{ path: "/users", label: "Usuarios", icon: UsersIcon, module: "users" },
	{ path: "/roles", label: "Roles y permisos", icon: ShieldCheck, module: "roles" },
	{ path: "/students", label: "Estudiantes", icon: GraduationCap, module: "students" },
	{ path: "/teachers", label: "Maestros", icon: BookOpen, module: "teachers" },
	{ path: "/parents", label: "Padres/Tutores", icon: UsersIcon, module: "parents" },
	{ path: "/classrooms", label: "Aulas", icon: Building2, module: "classrooms" },
	{ path: "/grade-groups", label: "Grados y grupos", icon: LayoutGrid, module: "grade_groups" },
	{ path: "/assignments", label: "Asignaciones", icon: Move, module: "students" },
	{
		path: "/pdas",
		label: "PDAs — Campos formativos",
		icon: BookOpenCheck,
		module: "pda_categories",
	},
	{ path: "/assets", label: "Activos", icon: Package, module: "assets" },
	{ path: "/inventory", label: "Inventario", icon: ClipboardList, module: "inventory" },
	{ path: "/audit-logs", label: "Auditoría", icon: Settings, module: "audit_logs" },
];
