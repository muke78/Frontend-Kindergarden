import { useState } from "react";
import { type FieldError, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { v } from "../styles/variables";

interface FormData {
  email: string;
  password: string;
}
export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputErrorText = "Este campo es obligatorio";
  const invalidPatterEmail = "Formato de correo inválido";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log(data.email, data.password);
    reset();
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center p-4 bg-base-200">
      <div className="card bg-secondary text-accent-content w-96 max-w-full shadow-lg">
        <div className="card bg-primary text-primary-content shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} method="POST">
            <div className="card-body p-9 text-center space-y-4">
              <img
                src={v.logoLogin}
                alt="Logo de Login"
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
                  {...register("email", {
                    required: inputErrorText,
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: invalidPatterEmail,
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500">
                    {(errors.email as FieldError)?.message}
                  </p>
                )}
                <div className="join w-full">
                  <div className="w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      className="input input-bordered w-full text-black rounded-l-lg"
                      {...register("password", {
                        required: inputErrorText,
                      })}
                    />
                  </div>
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-neutral join-item"
                  >
                    {showPassword ? (
                      <v.iconoOjoCerrado />
                    ) : (
                      <v.iconoOjoAbierto />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 p-0">
                    {(errors.email as FieldError)?.message}
                  </p>
                )}
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
