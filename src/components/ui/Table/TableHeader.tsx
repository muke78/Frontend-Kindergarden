interface TableHeaderProps {
  isChecked: boolean;
  onCheckAll: (checked: boolean) => void;
  usersColumns: { key: string; label: string }[];
}

export const TableHeader = ({
  isChecked,
  onCheckAll,
  usersColumns,
}: TableHeaderProps) => {
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
              checked={isChecked}
              onChange={(event) => onCheckAll(event.target.checked)}
              className="checkbox checkbox-error"
            />
            <span className="sr-only">Seleccionar todos</span>
            {/* Este span es invisible visualmente pero accesible para lectores de pantalla */}
          </label>
        </th>
        {usersColumns.map((col) => (
          <th key={col.key}>{col.label}</th>
        ))}
      </tr>
    </thead>
  );
};
