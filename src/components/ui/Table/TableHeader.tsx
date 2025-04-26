export const TableHeader = () => {
  return (
    <thead>
      <tr className="text-left text-md">
        <th>
          <label
            id="checkAll"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              id="checkAll"
              type="checkbox"
              // checked={isChecked}
              // onChange={onCheckAll}
              className="checkbox checkbox-primary"
            />
            <span className="sr-only">Seleccionar todos</span>
            {/* Este span es invisible visualmente pero accesible para lectores de pantalla */}
          </label>
        </th>
        <th>Avatar</th>
        <th>Nombre de usuario</th>
        <th>Rol</th>
        <th>Último inicio</th>
        <th>Informacion</th>
        <th>Tipo</th>
        <th>Status</th>
        <th>Acciones</th>
      </tr>
    </thead>
  );
};
