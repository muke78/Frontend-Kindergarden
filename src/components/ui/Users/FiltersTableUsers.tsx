import { Icon } from "@components/ui/Icon";

interface PropsFiltersTable {
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  searchText: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  activeFilter: string;
  handleStatusFilter: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  activateFilterCorreo: string;
  handleStatusFilterCorreo: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  activateFilterRol: string;
  handleStatusFilterRol: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleResetFiltersAll: () => void;
}

export const FiltersTableUsers = (props: PropsFiltersTable) => {
  const {
    activeFilter,
    handleStatusFilter,
    activateFilterCorreo,
    handleStatusFilterCorreo,
    activateFilterRol,
    handleStatusFilterRol,
    handleResetFiltersAll,
    onInputChange,
    onSearchSubmit,
    searchText,
  } = props;

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
      <form className="" onSubmit={onSearchSubmit}>
        <label className="input flex items-center rounded-lg p-1 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Busqueda por correo electronico"
            className="input text-base-content w-full sm:w-64"
            name="searchText"
            autoComplete="off"
            value={searchText}
            onChange={onInputChange}
          />
          <kbd className="kbd kbd-sm border border-none p-4">Enter</kbd>
        </label>
      </form>
      {/* Filtro para el estatus de los usuarios */}
      <label htmlFor="filterStatus" className="sr-only">
        Filtrar por status
      </label>
      <select
        id="filterStatus"
        className="select rounded-lg w-full sm:w-auto"
        value={activeFilter}
        onChange={handleStatusFilter}
      >
        <option value="" disabled>
          Filtrar por status
        </option>
        <option value="All">Todos los estatus</option>
        <option value="Activo">Activos</option>
        <option value="Inactivo">Inactivos</option>
      </select>
      {/* Filtro para el correo de los usuarios y el tipo de cuenta que tienen */}
      <label htmlFor="filterCorreo" className="sr-only">
        Filtrar por correo
      </label>
      <select
        id="filterCorreo"
        className="select rounded-lg w-full sm:w-auto"
        value={activateFilterCorreo}
        onChange={handleStatusFilterCorreo}
      >
        <option value="" disabled>
          Filtrar por correo
        </option>
        <option value="All">Todos los tipos</option>
        <option value="normal">Por aplicación</option>
        <option value="google">Google</option>
      </select>
      {/* Filtrar por tipo de rol del usuairo para saber si es un admin o user o mas roles que haya */}
      <label htmlFor="filterRol" className="sr-only">
        Filtrar por rol
      </label>
      <select
        id="filterRol"
        className="select rounded-lg w-full sm:w-auto"
        value={activateFilterRol}
        onChange={handleStatusFilterRol}
      >
        <option value="" disabled>
          Filtrar por rol
        </option>
        <option value="All">Todos los roles</option>
        <option value="admin">Administrador</option>
        <option value="user">Usuario</option>
      </select>

      <button
        className="btn btn-secondary join-item rounded-lg"
        disabled={
          activeFilter === "All" &&
          activateFilterCorreo === "All" &&
          activateFilterRol === "All"
        }
        onClick={handleResetFiltersAll}
        aria-label="Resetear filtros"
        title="Resetear filtros"
      >
        <Icon name="iconoResetearFiltro" size="text-lg" />
        <span>Borrar filtros</span>
      </button>
    </div>
  );
};
