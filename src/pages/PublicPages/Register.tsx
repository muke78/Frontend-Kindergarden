import { useRegister } from "@/hooks/Register/useRegister";
import { registerUserSchema } from "@/schemas/Users/registerUserSchema";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Icon } from "@components/ui/Icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { v } from "@styles/variables";

interface FormData {
  nameUser: string;
  email: string;
  password: string;
}
export const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerUserSchema()),
  });
  const { mutate } = useRegister();

  const onSubmit = async (data: FormData) => {
    await mutate({
      nameUser: data.nameUser,
      email: data.email,
      password: data.password,
    });
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center p-4 bg-base-200 animate__animated animate__fadeIn">
      <div className="card bg-neutral text-primary-content w-96 max-w-full shadow-lg">
        <Link to={"/login"} className="pt-4 pl-4">
          <Icon
            name="iconoRegresar"
            size="text-5xl"
            className="btn btn-soft btn-accent btn-sm"
          />
        </Link>
        <form onSubmit={handleSubmit(onSubmit)} method="POST">
          <div className="card-body p-9 text-center space-y-4">
            <img
              src={v.logoLogin}
              alt="Logo de Login"
              className="mx-auto w-16 h-16"
            />
            <h1 className="text-2xl font-semibold dark:text-white">
              Regístrate en AKC
            </h1>
            <span className="text-md text-balance text-secondary block">
              Puedes crear una cuenta para poder ingresar a la plataforma y
              estar al día
            </span>

            <div className="grid grid-cols-1 grid-rows-2 gap-4">
              {/* Input para registrar tu nombre de usuario */}
              <div>
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  className={`input input-bordered w-full text-base-content rounded-l-lg ${errors.nameUser ? "input-error" : ""}`}
                  {...register("nameUser")}
                />
                {errors.nameUser && (
                  <span className="text-error text-sm">
                    {errors.nameUser.message?.toString()}
                  </span>
                )}
              </div>

              {/* Input para registrar un correo electronico */}
              <div>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className={`input input-bordered w-full text-base-content rounded-l-lg ${errors.email ? "input-error" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-error text-sm">
                    {errors.email.message?.toString()}
                  </span>
                )}
              </div>
              {/* Input para registrar una contraseña */}
              <div>
                <div className="join w-full">
                  <div className="w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      className={`input input-bordered w-full text-base-content rounded-l-lg ${errors.password ? "input-error" : ""}`}
                      {...register("password")}
                    />
                  </div>
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-secondary text-lg join-item"
                  >
                    {showPassword ? (
                      <Icon name="iconoOjoCerrado" size="text-lg" />
                    ) : (
                      <Icon name="iconoOjoAbierto" size="text-lg" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <span className="text-error text-sm">
                    {errors.password.message?.toString()}
                  </span>
                )}
              </div>

              <small className="text-balance text-white">
                *NOTA los usuarios registrados se crearan como Inactivos, un
                administrador verificara su ingreso a la plataforma
              </small>
            </div>

            <button className="btn btn-primary w-full">Registrarse</button>
          </div>
        </form>
      </div>
    </div>
  );
};
