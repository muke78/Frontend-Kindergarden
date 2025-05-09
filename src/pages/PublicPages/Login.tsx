import { Icon } from "@/components/ui/Icon";
import { useLogin } from "@/hooks/Auth/useAuth";
import { useAuthGoogleLogin } from "@/hooks/Auth/useAuthGoogle";
import { loginUserSchema } from "@/schemas/Login/loginUserSchema";

import { useState } from "react";
import { type FieldError, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CredentialResponse,
  GoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { v } from "@styles/variables";

interface FormData {
  email: string;
  password: string;
}

export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { mutate } = useLogin();
  const { createUserGoogle } = useAuthGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginUserSchema()),
  });

  const onSubmit = async (data: FormData) => {
    await mutate({
      email: data.email,
      password: data.password,
    });
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (credentialResponse.credential) {
      try {
        // Llamamos a la mutación de Google Login
        await createUserGoogle(credentialResponse.credential); // Le pasamos el token de Google
      } catch (error) {
        console.error(
          "Error al autenticar con Google (mutación fallida):",
          error,
        );
      }
    } else {
      console.error("Credential is undefined in the success response.");
    }
  };

  // Manejador Común para Errores de Google Login (para One Tap y Botón)
  const handleGoogleLoginError = () => {
    console.log("Google Login Failed");
  };

  useGoogleOneTapLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    auto_select: true,
  });

  return (
    <div className="h-screen flex flex-col justify-center items-center p-4 bg-base-200 animate__animated animate__fadeIn">
      <div className="card bg-primary-content text-accent-content w-96 max-w-full shadow-lg">
        <div className="card bg-neutral text-primary-content shadow-lg">
          <div className="card-body p-9 text-center space-y-4">
            <img
              src={v.logoLogin}
              alt="Logo de Login"
              className="mx-auto w-16 h-16"
            />
            <h1 className="text-2xl font-semibold text-white">
              Iniciar sesión en AKT
            </h1>
            <span className="text-md text-balance text-white block">
              ¡Bienvenido de nuevo! Inicia sesión para continuar.
            </span>
            {/* Google Login Button */}

            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              theme="filled_black"
              size="large"
              shape="pill"
            />

            <div className="divider divider-secondary text-white m-0">O</div>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
              method="POST"
            >
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="input input-bordered w-full text-base-content"
                  {...register("email", {})}
                />
                {errors.email && (
                  <p className="text-red-500 p-0">
                    {(errors.email as FieldError)?.message}
                  </p>
                )}
                <div className="join w-full">
                  <div className="w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      className="input w-full text-base-content rounded-l-lg"
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
                  <p className="text-red-500 p-0">
                    {(errors.password as FieldError)?.message}
                  </p>
                )}
              </div>

              <button className="btn btn-primary w-full">Iniciar sesión</button>
            </form>
          </div>
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
