import { Link } from "react-router";

export const NotFound = () => {
  return (
    <>
      <main className="grid min-h-screen place-items-center bg-base-100 px-6 py-24 sm:py-32 lg:px-8 animate__animated animate__fadeIn">
        <div className="text-center">
          <p className=" font-semibold text-secondary text-5xl">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text sm:text-7xl">
            Arenero no encontrado
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Este patio de juegos no ha sido constuido 🛝
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to={"/home"}
              className="btn btn-soft btn-secondary font-semibold shadow-xs "
            >
              Regresar al patio de juegos
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};
