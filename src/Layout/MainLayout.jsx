import NavBar from "../components/NavBar";

export default function MainLayout({ children }) {
  return (
    <main className="px-7 py-10">
      <NavBar />
      {children}
    </main>
  );
}
