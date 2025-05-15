import { useState } from "react";
import { Avatar, Accordion, AccordionItem } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="regular-24">
            ¡Hola <span className="semibold-24">Juan Perez!</span>
          </h1>
          <h6 className="regular-14 text-textSecondary">
            ¡Bienvenido de nuevo!
          </h6>
        </div>
        <div className="z-10">
          <Avatar
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            isBordered
            className="cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg z-30"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex flex-col gap-4">
                <div className="flex justify-end">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <nav className="flex flex-col gap-3">
                  <NavLink
                    to="/glosario"
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Glosario
                  </NavLink>

                  <Accordion>
                    <AccordionItem key="1" title="Quienes Somos">
                      <div className="p-2">
                        <p>
                          Somos una empresa dedicada a brindar soluciones
                          financieras innovadoras para ayudar a nuestros
                          usuarios a alcanzar sus metas económicas.
                        </p>
                      </div>
                    </AccordionItem>
                  </Accordion>
                  <a className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    Configuración
                  </a>
                  <a
                    href="/logout"
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors text-red-500"
                  >
                    Cerrar Sesión
                  </a>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
