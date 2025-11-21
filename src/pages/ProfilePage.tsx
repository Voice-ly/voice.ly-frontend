import { Link, useNavigate } from "react-router";
import { deleteUser, getUsers, updateProfile } from "../lib/UserService";
import { useEffect, useState } from "react";
import { showToast } from "../utils/toast";

export default function ProfilePage() {
    const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword("");
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault(); // evita submit automático

    if (!deletePassword.trim()) {
        showToast("Debes ingresar tu contraseña.", "error");
      return;
    }

    try {
      setLoadingDelete(true);

        const res = await deleteUser({ password: deletePassword });
      if (res.ok) {
        showToast("Usuario eliminado correctamente", "success");
        navigate("/login");
      } else {
        showToast("Error al eliminar el usuario. Verifica tu contraseña.", "error");
      }
    } finally {
      setLoadingDelete(false);
      closeDeleteModal();
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUsers();
      setUser(data);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user.firstName || !user.lastName || !user.email || !user.age) {
      showToast("Por favor, completa todos los campos antes de guardar.", "error");

      return;
    }

    const res = await updateProfile(user);

    if (!res.ok) {
        showToast("Error al actualizar el perfil.", "error");
      return;
    }
    showToast("Perfil actualizado correctamente.", "success");
  };

  return (
    <section className="flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <Link
          to={"/dashboard"}
          className="text-blue-600 underline text-sm mb-4 inline-block"
        >
          ← Volver al Dashboard
        </Link>

        <h1 className="text-4xl font-bold mb-6">Perfil de Usuario</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="firstName" className="text-lg font-semibold mb-1">
                Nombres
              </label>
              <input
                type="text"
                name="firstName"
                defaultValue={user?.firstName || ""}
                className="border rounded-lg h-11 px-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="lastName" className="text-lg font-semibold mb-1">
                Apellidos
              </label>
              <input
                type="text"
                name="lastName"
                defaultValue={user?.lastName || ""}
                className="border rounded-lg h-11 px-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={user?.email || ""}
              className="border rounded-lg h-11 px-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) =>
                setUser((prev: any) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          {/* Edad */}
          <div className="flex flex-col">
            <label htmlFor="age" className="text-lg font-semibold mb-1">
              Edad
            </label>
            <input
              type="number"
              name="age"
              defaultValue={user?.age || ""}
              className="border rounded-lg h-11 px-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) =>
                setUser((prev: any) => ({ ...prev, age: e.target.value }))
              }
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-semibold mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder="Ingresa una nueva contraseña"
              className="border rounded-lg h-11 px-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) =>
                setUser((prev: any) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>

          {/* Creado desde */}
          <div className="pt-2">
            <span className="text-lg font-semibold">Creado desde: </span>
            <span className="text-md text-gray-700">
              {user
                ? new Date(user.createdAt._seconds * 1000).toLocaleDateString()
                : ""}
            </span>
          </div>

          {/* Eliminar Cuenta */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={openDeleteModal}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-lg text-lg transition-all"
            >
              Eliminar Cuenta
            </button>

            <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg text-lg transition-all">
              Guardar cambios
            </button>
          </div>

          {/* Eliminar Cuenta */}
        </form>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-md w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Confirmar eliminación
            </h2>
            <p className="text-sm mb-4">
              Para eliminar tu cuenta, ingresa tu contraseña:
            </p>

            <form onSubmit={handleDelete}>
              <input
                type="password"
                className="border px-3 py-2 w-full rounded mb-4"
                placeholder="Contraseña"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={loadingDelete}
                  className="px-3 py-2 bg-gray-300 rounded"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loadingDelete}
                  className="px-3 py-2 bg-red-600 text-white rounded"
                >
                  {loadingDelete ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
