import { signup } from "./actions";

export default function Register() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <section className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear cuenta
          </h1>
        </div>
        <form className="mt-8 space-y-6" action={signup}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre completo
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#7A7CFF] focus:border-[#7A7CFF] focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-700"
              >
                Ocupación
              </label>
              <input
                id="occupation"
                name="occupation"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#7A7CFF] focus:border-[#7A7CFF] focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de nacimiento
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#7A7CFF] focus:border-[#7A7CFF] focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#7A7CFF] focus:border-[#7A7CFF] focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#7A7CFF] focus:border-[#7A7CFF] focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#7A7CFF] focus:border-[#7A7CFF] focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7A7CFF] hover:bg-[#6A6CFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A7CFF]"
            >
              Registrarse
            </button>
          </div>
        </form>
        <div className="text-center">
          <a
            href="/login"
            className="font-medium text-[#7A7CFF] hover:text-[#6A6CFF]"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </a>
        </div>
      </section>
    </main>
  );
}
