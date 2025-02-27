import { Avatar } from "@heroui/react";

export default function Header() {
  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="regular-24">
          ¡Hola <span className="semibold-24">Juan Perez!</span>
        </h1>
        <h6 className="regular-14 text-textSecondary">¡Bienvenido de nuevo!</h6>
      </div>
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        isBordered
      />
    </header>
  );
}
