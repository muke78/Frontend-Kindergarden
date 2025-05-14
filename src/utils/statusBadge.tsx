import { Icon } from "@/components/ui/Icon";

export const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "activo":
      return (
        <span className="badge badge-success w-full">
          <Icon name="iconoUsuarioActivo" /> {status}
        </span>
      );
    case "inactivo":
      return (
        <span className="badge badge-neutral w-full">
          <Icon name="iconoUsuarioInactivo" /> {status}
        </span>
      );
    case "suspended":
      return (
        <span className="badge badge-error w-full">
          {" "}
          <Icon name="iconoCerrar" /> {status}
          {status}
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};
