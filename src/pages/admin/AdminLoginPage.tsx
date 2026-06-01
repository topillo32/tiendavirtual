export function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-sm">
      <h1 className="mb-4 text-2xl font-semibold">Ingreso administrador</h1>
      <p className="mb-6 text-slate-600">
        Aquí irá el formulario de inicio de sesión con Supabase Auth.
      </p>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input className="w-full rounded-md border border-slate-200 px-4 py-2" type="email" disabled />
        <label className="block text-sm font-medium text-slate-700">Contraseña</label>
        <input className="w-full rounded-md border border-slate-200 px-4 py-2" type="password" disabled />
        <button className="w-full rounded-md bg-slate-900 px-4 py-2 text-white" disabled>
          Iniciar sesión
        </button>
      </div>
    </div>
  )
}
