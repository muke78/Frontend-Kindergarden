import { GrUserManager } from "react-icons/gr";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { HiChevronDoubleRight } from "react-icons/hi";
import { IoMdHelp } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { RiArrowLeftLine } from "react-icons/ri";
import { RiCloseLine } from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";
import { RiEyeCloseLine } from "react-icons/ri";
import { RiFileChartLine } from "react-icons/ri";
import { RiHome5Line } from "react-icons/ri";
import { RiGroupLine } from "react-icons/ri";
import { RiUser3Line } from "react-icons/ri";
import { RiFileList3Line } from "react-icons/ri";
import { RiBookReadLine } from "react-icons/ri";
import { RiSettings5Line } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";

import logo from "@assets/iconLogin.webp";

export const v = {
  iconoOjoCerrado: RiEyeCloseLine,
  iconoOjoAbierto: RiEyeLine,
  logoLogin: logo,
  iconoRegresar: RiArrowLeftLine,
  iconoCerrarSesion: LuLogOut,
  iconoMenu: RxHamburgerMenu,
  iconCerrar: RiCloseLine,
  iconoInicio: RiHome5Line,
  iconoUsuarios: RiGroupLine,
  iconoMaestros: GrUserManager,
  iconoAlumnos: RiUser3Line,
  iconoReportes: RiFileList3Line,
  iconoEvaluaciones: RiFileChartLine,
  iconoCatalogos: RiBookReadLine,
  iconoConfiguracion: RiSettings5Line,
  iconoAyuda: IoMdHelp,
  iconoContraerMenu: HiChevronDoubleLeft,
  iconDesplegarMenu: HiChevronDoubleRight,
};
