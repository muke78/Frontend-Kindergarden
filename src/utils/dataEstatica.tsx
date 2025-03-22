import { v } from "../styles/variables";

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
];
