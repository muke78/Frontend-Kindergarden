import { FcGoogle } from "react-icons/fc";
import { FiEdit } from "react-icons/fi";
import { GrUserManager } from "react-icons/gr";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { HiChevronDoubleRight } from "react-icons/hi";
import { IoMdHelp } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowRightSLine } from "react-icons/ri";
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
import { RiEditLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import { RiUserStarLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { SlOptions } from "react-icons/sl";

import errorFetch from "@assets/errorFetching.svg";
import logo from "@assets/iconLogin.webp";

export const v = {
  iconoOjoCerrado: RiEyeCloseLine,
  iconoOjoAbierto: RiEyeLine,
  logoLogin: logo,
  iconoErrorFetch: errorFetch,
  iconoRegresar: RiArrowLeftLine,
  iconoCerrarSesion: LuLogOut,
  iconoMenu: RxHamburgerMenu,
  iconoCerrar: RiCloseLine,
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
  iconoDesplegarMenu: HiChevronDoubleRight,
  iconoFlechaAbajo: RiArrowDownSLine,
  iconoFlechaDerecha: RiArrowRightSLine,
  iconoFlechaIzquierda: RiArrowLeftSLine,
  iconoBasuraButton: LuTrash2,
  iconoEditarButton: FiEdit,
  iconoCrearButton: RiEditLine,
  iconoMasOpciones: SlOptions,
  iconoGoogle: FcGoogle,
  iconoPapas: RiUserStarLine,
};
