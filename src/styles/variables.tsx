import { BsFillMoonStarsFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { GrUserManager } from "react-icons/gr";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { IoMdHelp } from "react-icons/io";
import { IoMdCreate } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { MdFilterAltOff } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
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
import { RiArrowLeftSLine } from "react-icons/ri";
import { RiUserStarLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { SlOptions } from "react-icons/sl";
import { TbSunFilled } from "react-icons/tb";

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
  iconoFlechaAbajo: RiArrowDownSLine,
  iconoFlechaDerecha: RiArrowRightSLine,
  iconoFlechaIzquierda: RiArrowLeftSLine,
  iconoBasuraButton: FaTrashAlt,
  iconoEditarButton: FaEdit,
  iconoCrearButton: FaPlusCircle,
  iconoMasOpciones: SlOptions,
  iconoGoogle: FcGoogle,
  iconoPapas: RiUserStarLine,
  iconoLuna: BsFillMoonStarsFill,
  iconoSol: TbSunFilled,
  iconoCreadoRegistro: IoMdCreate,
  iconoActualizadoRegistro: FaClockRotateLeft,
  iconoBuscar: FaSearch,
  iconoAdvertencia: PiWarningCircleFill,
  iconoResetearFiltro: MdFilterAltOff,
};
