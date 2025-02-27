import MainLayout from "../Layout/MainLayout";
import { Input, Button } from "@heroui/react";
import { NavLink } from "react-router";

export default function RegisterPage() {
  return (
    <MainLayout>
      <section className="flex flex-col gap-y-5 mb-10">
        <h1 className="regular-31 mb-4">Regístrate</h1>
        <div className="flex flex-col gap-y-5 mb-7">
        <Input
            variant="bordered"
            label="Nombres"
            labelPlacement="outside"
            placeholder="Ingresa tus nombres"
            type="text"
            isRequired
          />
        <Input
            variant="bordered"
            label="Apellidos"
            labelPlacement="outside"
            placeholder="Ingresa tus apellidos"
            type="text"
            isRequired
          />
          <Input
            variant="bordered"
            label="Correo electrónico"
            labelPlacement="outside"
            placeholder="Ingresa tu correo electrónico"
            type="email"
            isRequired
          />
          <Input
            variant="bordered"
            label="Contraseña"
            labelPlacement="outside"
            type="password"
            placeholder="Ingresa tu contraseña"
            isRequired
          />
        </div>
        <NavLink to="/home" className="w-full">
          <Button color="primary" radius="full" className="semibold-18 py-6 w-full">
            Registrarse
          </Button>
        </NavLink>
      </section>

      <div className="flex items-center gap-x-5 mb-6">
        <hr className="w-full border-textSecondary" />
        <p className="regular-16 text-textSecondary text-nowrap">
          O regístrate sesión con
        </p>
        <hr className="w-full border-textSecondary" />
      </div>

      <div className="grid place-items-center mb-16">
        <Button
          isIconOnly
          variant="bordered"
          color="textSecondary"
          radius="lg"
          className="semibold-18 py-6"
        >
          <GoogleSVG />
        </Button>
      </div>

      <div className="grid place-items-center">
        <p className="regular-16">
          ¿Ya tienes cuenta?{" "}
          <NavLink
            to="/login"
            className="semibold-16 underline text-primary"
          >
            Incia sesión
          </NavLink>
        </p>
      </div>
    </MainLayout>
  );
}

export const GoogleSVG = () => {
  return (
    <svg
      width="26"
      height="27"
      viewBox="0 0 26 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_54_56)">
        <path
          d="M25.6068 13.368C25.6068 12.2927 25.5196 11.5081 25.331 10.6944H13.0654V15.5475H20.265C20.1199 16.7536 19.3361 18.5699 17.5942 19.7904L17.5698 19.9528L21.4479 22.9603L21.7166 22.9871C24.1842 20.7058 25.6068 17.3493 25.6068 13.368"
          fill="#4285F4"
        />
        <path
          d="M13.065 26.1548C16.5922 26.1548 19.5533 24.9923 21.7162 22.9872L17.5938 19.7904C16.4906 20.5605 15.01 21.0981 13.065 21.0981C9.61032 21.0981 6.67823 18.8169 5.63301 15.6638L5.47981 15.6768L1.44727 18.8009L1.39453 18.9476C3.54279 23.2196 7.95549 26.1548 13.065 26.1548Z"
          fill="#34A853"
        />
        <path
          d="M5.6329 15.6638C5.35711 14.8501 5.19751 13.9782 5.19751 13.0774C5.19751 12.1764 5.35711 11.3047 5.61839 10.491L5.61109 10.3177L1.52801 7.14343L1.39442 7.20704C0.509022 8.97978 0.000976562 10.9705 0.000976562 13.0774C0.000976562 15.1843 0.509022 17.1749 1.39442 18.9476L5.6329 15.6638"
          fill="#FBBC05"
        />
        <path
          d="M13.065 5.05662C15.518 5.05662 17.1727 6.11733 18.1163 7.00375L21.8032 3.40018C19.5389 1.29327 16.5922 6.10352e-05 13.065 6.10352e-05C7.95549 6.10352e-05 3.54279 2.93518 1.39453 7.2071L5.6185 10.491C6.67822 7.33792 9.61031 5.05662 13.065 5.05662"
          fill="#EB4335"
        />
      </g>
      <defs>
        <clipPath id="clip0_54_56">
          <rect width="25.62" height="26.2449" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
