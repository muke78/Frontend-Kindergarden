import { Link } from "react-router-dom";

// interface FormData {
//   email: string;
//   password: string;
// }

export const Login = () => {
  const onSubmit = async () => {
    console.log("Hola mundo");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center p-4 bg-base-200">
      <div className="card bg-secondary text-accent-content w-96 max-w-full shadow-lg">
        <div className="card bg-primary text-primary-content shadow-lg">
          <form onSubmit={onSubmit}>
            <div className="card-body p-9 text-center space-y-4">
              <img
                src="https://images.icon-icons.com/3564/PNG/512/children_toy_airplane_childrens_toys_icon_225323.png"
                alt="Logo"
                className="mx-auto w-16 h-16"
              />

              <h1 className="text-2xl font-semibold">Iniciar sesión en AKC</h1>
              <span className="text-sm text-secondary-content block">
                ¡Bienvenido de nuevo! Inicia sesión para continuar.
              </span>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="input input-bordered w-full text-black"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="input input-bordered w-full text-black"
                />
              </div>

              <button className="btn btn-secondary w-full">
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>

        <div className="flex justify-center items-center gap-1 p-3 text-sm">
          <span>No tienes cuenta?</span>
          <Link to="/register">
            <button className="btn btn-accent btn-sm">Registrate</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
