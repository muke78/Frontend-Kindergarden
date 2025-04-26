export const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "activo":
      return <span className="badge badge-success w-full">{status}</span>;
    case "inactivo":
      return <span className="badge badge-neutral w-full">{status}</span>;
    case "suspended":
      return <span className="badge badge-error w-full">{status}</span>;
    default:
      return <span className="badge">{status}</span>;
  }
};
