// components/ui/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { path: "/", label: "Inicio" },
  { path: "/history", label: "Historial" },
  { path: "/metrics", label: "Métricas" },
  { path: "/flow", label: "Flujo" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-4 p-4 bg-gray-900 text-white">
      {routes.map(({ path, label }) => (
        <Link
          key={path}
          href={path}
          className={`hover:underline ${
            pathname === path ? "font-bold underline" : ""
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
