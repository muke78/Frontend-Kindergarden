export const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "activo":
      return <span className="badge badge-success">{status}</span>;
    case "inactivo":
      return <span className="badge badge-neutral">{status}</span>;
    case "suspended":
      return <span className="badge badge-error">{status}</span>;
    default:
      return <span className="badge">{status}</span>;
  }
};
