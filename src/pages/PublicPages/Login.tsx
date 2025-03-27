import { useState } from "react";
import { type FieldError, useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

import { useLogin } from "@hooks/useAuth";
import { v } from "@styles/variables";

interface FormData {
  email: string;
  password: string;
}

export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { mutate } = useLogin();

  const inputErrorText = "Este campo es obligatorio";
  const invalidPatterEmail = "Formato de correo inválido";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center p-4 bg-base-200 animate__animated animate__fadeIn">
      <div className="card bg-primary-content text-accent-content w-96 max-w-full shadow-lg">
        <div className="card bg-neutral text-primary-content shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} method="POST">
            <div className="card-body p-9 text-center space-y-4">
              <img
                src={v.logoLogin}
                alt="Logo de Login"
                className="mx-auto w-16 h-16"
              />
              <h1 className="text-2xl font-semibold dark:text-white">
                Iniciar sesión en AKT
              </h1>
              <span className="text-md text-balance text-secondary block">
                ¡Bienvenido de nuevo! Inicia sesión para continuar.
              </span>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="input input-bordered w-full text-base-content"
                  {...register("email", {
                    required: inputErrorText,
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: invalidPatterEmail,
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-primary p-0">
                    {(errors.email as FieldError)?.message}
                  </p>
                )}
                <div className="join w-full">
                  <div className="w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      className="input input-bordered w-full text-base-content rounded-l-lg"
                      {...register("password", {
                        required: inputErrorText,
                      })}
                    />
                    {errors.password && (
                      <p className="text-primary p-0">
                        {(errors.password as FieldError)?.message}
                      </p>
                    )}
                  </div>
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-secondary text-lg join-item"
                  >
                    {showPassword ? (
                      <v.iconoOjoCerrado />
                    ) : (
                      <v.iconoOjoAbierto />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-primary p-0">
                    {(errors.email as FieldError)?.message}
                  </p>
                )}
              </div>

              <button className="btn btn-primary w-full">Iniciar sesión</button>
              <Toaster position="bottom-right" reverseOrder={false} />
            </div>
          </form>
        </div>

        <div className="flex justify-center items-center gap-3 p-3 text-sm">
          <span className="text-secondary">No tienes cuenta?</span>
          <Link to="/register">
            <button className="btn btn-soft btn-accent btn-sm">
              Registrate
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
