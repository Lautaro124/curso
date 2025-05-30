"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "./actions";
import InputGroup from "@/components/InputGroup";
import Input from "@/components/Input";

export default function Login() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (formData: FormData) => {
    try {
      await login(formData);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <section className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h1>
        </div>
        <form className="mt-8 space-y-6" action={handleLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <InputGroup>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              variant="top"
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              variant="bottom"
              required
            />
          </InputGroup>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7A7CFF] hover:bg-[#6A6CFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A7CFF]"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link
            href="/register"
            className="font-medium text-[#7A7CFF] hover:text-[#6A6CFF]"
          >
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </section>
    </main>
  );
}
