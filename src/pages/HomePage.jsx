import MainLayout from "../Layout/MainLayout";
import Header from "../components/Header";
import { Button } from "@heroui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import CardActivityRecent from "../components/CardActivityRecent";

export default function HomePage() {
  return (
    <>
      <MainLayout>
        <Header className />
        <main className="flex flex-col gap-8">
          <section className="bg-background rounded-3xl mt-12">
            <div className="flex items-center justify-between bg-primary rounded-3xl py-6 px-7">
              <h6 className="regular-16">Saldo total</h6>
              <p className="bold-16">Marzo 29, 2025</p>
            </div>
            <div className="flex flex-col gap-2 px-7 pt-14 pb-7">
              <h6 className="regular-16 text-white">Total invertido</h6>
              <p className="font-bold text-[37px] text-white">$50.000,04</p>
            </div>
          </section>

          <div className="flex items-center justify-center gap-4">
            <Button
              className="bg-secondary rounded-full w-full py-7"
              startContent={
                <ArrowRightStartOnRectangleIcon className="w-6 h-6 text-primary" />
              }
            >
              <p className="regular-16 text-primary">Ver reporte</p>
            </Button>
            <Button
              className="bg-primary rounded-full w-full py-7"
              startContent={
                <ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-secondary" />
              }
            >
              <p className="regular-16 text-secondary">Ver reporte</p>
            </Button>
          </div>
          <div className="bg-background rounded-3xl flex flex-col gap-4 justify-center items-center w-full p-5">
            <p className="bold-16 text-white">¿En qué quieres invertir?</p>
            <Button
              className="bg-primary rounded-full w-full py-7"
              startContent={
                <ArrowTrendingUpIcon className="w-6 h-6 text-secondary" />
              }
            >
              <p className="regular-16 text-secondary">Acctiones</p>
            </Button>
          </div>
        </main>
      </MainLayout>
      <section className="bg-white rounded-tl-3xl rounded-tr-3xl border border-gray-200">
        <div className="flex flex-col gap-4 justify-between rounded-3xl py-6 px-7 shadow-sm">
          <h6 className="bold-16 mb-3">Actividad Reciente</h6>
          <div className="flex flex-col gap-4">
            <CardActivityRecent />
            <CardActivityRecent />
            <CardActivityRecent />
          </div>
        </div>
      </section>
    </>
  );
}

