import { Paginacion } from "@/components/Paginacion";
import { useSidebar } from "@/hooks/Sidebar/useSidebar";

import { Icon } from "@components/ui/Icon";
import { TableHeader } from "@components/ui/Table/TableHeader";
import { TableRow } from "@components/ui/Table/TableRow";
import { ModalAgregarUsuario } from "@components/ui/Users/ModalAgregarUsuario";
import { ModalEditarUsuario } from "@components/ui/Users/ModalEditarUsuario";

interface User {
  message: string;
  ID: string;
  NameUser: string;
  Email: string;
  Password?: string;
  ProfilePicture: string;
  Role: string;
  AccountType: string;
  LastLogin: string;
  AccountStatus: string;
  Created: string;
  Updated: string;
}

interface UserData {
  id: string;
  nameUser: string;
  email: string;
  role: string;
  accountStatus: string;
  password?: string;
}

interface TablaUsuariosProps {
  dataToShow: User[];
  pagina: number;
  setPagina: React.Dispatch<React.SetStateAction<number>>;
  maximo: number;
  countData?: number;
  eliminar: (id: string) => void;

  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: UserData | undefined;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | undefined>>;
  handleOpenModal: (user: FormData) => void;

  isOpenModalAddUser: boolean;
  setIsOpenModalAddUser: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TablaUsuarios = (props: TablaUsuariosProps) => {
  const {
    dataToShow,
    pagina,
    setPagina,
    maximo,
    countData,
    eliminar,
    showPassword,
    setShowPassword,
    isModalOpen,
    setIsModalOpen,
    selectedUser,
    setSelectedUser,
    handleOpenModal,
    isOpenModalAddUser,
    setIsOpenModalAddUser,
  } = props;

  const { isMobile } = useSidebar();

  return (
    <>
      {dataToShow.length === 0 ? (
        <div className="alert alert-info my-4">
          <span className="text-xl">
            <Icon name="iconoAdvertencia" size="text-2xl" />
          </span>
          <span>No usuarios que mostrar</span>
        </div>
      ) : (
        <div className="hidden md:block overflow-x-auto rounded-md border-t-4 border-neutral/60 row-start-3 shadow-2xl">
          <table className="table table-zebra w-full animate__animated animate__fadeIn">
            <TableHeader />

            <TableRow
              dataToShow={dataToShow}
              eliminar={eliminar}
              handleOpenModal={handleOpenModal}
            />
          </table>
          <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
        </div>
      )}

      <ModalAgregarUsuario
        isOpenModalAddUser={isOpenModalAddUser}
        setIsOpenModalAddUser={setIsOpenModalAddUser}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <ModalEditarUsuario
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <div
        className={`flex justify-end p-5 w-full ${isMobile ? "hidden" : "block"}`}
      >
        <span className="badge badge-soft badge-secondary">
          Total de registros {countData}
        </span>
      </div>
    </>
  );
};
