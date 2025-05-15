import { Icon } from "@/components/ui/Icon";

export const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "activo":
      return (
        <span className="badge  w-full">
          <Icon name="iconoUsuarioActivo" className="text-success" /> {status}
        </span>
      );
    case "inactivo":
      return (
        <span className="badge w-full">
          <Icon name="iconoUsuarioInactivo" className="text-error" /> {status}
        </span>
      );
    case "suspended":
      return (
        <span className="badge w-full">
          {" "}
          <Icon name="iconoCerrar" className="text-warning" /> {status}
          {status}
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};
