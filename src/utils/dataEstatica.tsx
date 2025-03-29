import { v } from "@styles/variables";

export const controlOptionsuserArray = [
  {
    label: "Configuración",
    icon: <v.iconoConfiguracion />,
    to: "/config",
  },
  {
    label: "Ayuda",
    icon: <v.iconoAyuda />,
    to: "/help",
  },
  {
    label: "Cerrar sesion",
    icon: <v.iconoCerrarSesion />,
    to: "",
  },
];

export const LinksArray = [
  {
    label: "Inicio",
    icon: <v.iconoInicio />,
    to: "/home",
    active: true,
  },
  {
    label: "Usuarios",
    icon: <v.iconoUsuarios />,
    to: "/users",
  },
  {
    label: "Maestros",
    icon: <v.iconoMaestros />,
    to: "/teachers",
  },
  {
    label: "Padres",
    icon: <v.iconoPapas />,
    to: "/parents",
  },
  {
    label: "Alumnos",
    icon: <v.iconoAlumnos />,
    to: "/students",
  },
  {
    label: "Reportes",
    icon: <v.iconoReportes />,
    to: "/reports",
  },
  {
    label: "Evaluaciones",
    icon: <v.iconoEvaluaciones />,
    to: "/evaluations",
  },
  {
    label: "Catalogos",
    icon: <v.iconoCatalogos />,
    to: "/catalogs",
  },
];
