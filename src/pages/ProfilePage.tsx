import { Link, useNavigate } from "react-router";
import { deleteUser, updateProfile } from "../lib/UserService";
import { useEffect, useState } from "react";
import { showToast } from "../utils/toast";
import { useUserStore } from "../stores/useUserStore";

/**
 * ProfilePage Component
 * ----------------------
 * This component displays and manages the user's profile information.
 * Users can update their personal data (name, last name, email, age, password)
 * and permanently delete their account after confirming their password.
 *
 * Features:
 * - Fetch user profile data on mount.
 * - Update user profile through a form.
 * - Delete account with password confirmation.
 * - UI modal for account deletion confirmation.
 *
 * @component
 */

export default function ProfilePage() {
    const navigate = useNavigate();
    const { profile, setProfile } = useUserStore();
    const [fullName, setFullName] = useState<string>("");
    /** User profile state */
    const [user, setUser] = useState<any>(null);
    /** Controls visibility of the delete confirmation modal */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    /** Password input used to confirm account deletion */
    const [deletePassword, setDeletePassword] = useState("");
    /** Loading state for delete action */
    const [loadingDelete, setLoadingDelete] = useState(false);
    /** Password vibility toggle**/ 
    const [showPassword, setShowPassword] = useState (false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    /**
     * Opens the account deletion modal.
     * @returns {void}
     */
    const openDeleteModal = () => setShowDeleteModal(true);
    /**
     * Closes the account deletion modal and resets its form.
     * @returns {void}
     */
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletePassword("");
    };

    /**
     * Handles account deletion after password confirmation.
     *
     * @param {React.FormEvent} e - Form submit event.
     * @returns {Promise<void>}
     */
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
                showToast(
                    "Error al eliminar el usuario. Verifica tu contraseña.",
                    "error"
                );
            }
        } finally {
            setLoadingDelete(false);
            closeDeleteModal();
        }
    };
    /**
     * Fetches the user profile when the page loads.
     *
     * @returns {Promise<void>}
     */
    useEffect(() => {
        setUser(profile);
        if (profile.lastName) {
            setFullName(`${profile.firstName} ${profile.lastName}`);
            return;
        }
        setFullName(profile.firstName);
    }, []);
    
    const formatFullName = (value: string) => {
    // elimina espacios dobles y ajusta el nombre
    return value
        .replace(/\s+/g, " ")     // convierte dobles espacios → 1 espacio
        .trimStart();             // evita espacio al inicio
        };

    /**
     * Handles updating the user profile.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - Form submit event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!fullName || !user.email || !user.age) {
            showToast(
                "Por favor, completa todos los campos antes de guardar.",
                "error"
            );

            return;
        }

        const res = await updateProfile(user);

        if (!res.ok) {
            showToast("Error al actualizar el perfil.", "error");
            return;
        }
        showToast("Perfil actualizado correctamente.", "success");
        setProfile(user);
    };

    return (
        <section className="flex justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10">

                {/* Volver */}
                <Link
                    to="/dashboard"
                    className="text-blue-600 underline text-sm mb-6 inline-block"
                >
                    ← Volver al Dashboard
                </Link>

                {/* Título */}
                <h1 className="text-4xl font-bold mb-8 text-gray-800">
                    Perfil de Usuario
                </h1>

                {/* FORMULARIO */}
                <form className="space-y-7" onSubmit={handleSubmit}>
                    
                    {/* Nombres + Apellidos */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">
                            Nombres y Apellidos
                        </label>
                        <input
                        type="text"
                        value={fullName}
                        className="border tracking-wide rounded-xl h-12 px-4 bg-gray-50"
                        onChange={(e) => {
                            const formatted = formatFullName(e.target.value);
                            setFullName(formatted);

                            setUser((prev: any) => ({
                                ...prev,
                                firstName: formatted,
                            }));
                        }}
                    />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            defaultValue={user?.email}
                            className="border rounded-xl h-12 px-4 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            onChange={(e) =>
                                setUser((prev: any) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Edad */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Edad</label>
                        <input
                            type="number"
                            defaultValue={user?.age}
                            className="border rounded-xl h-12 px-4 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            onChange={(e) =>
                                setUser((prev: any) => ({
                                    ...prev,
                                    age: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="flex flex-col relative">
                        <label className="text-lg font-semibold mb-1">
                            Contraseña
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa una nueva contraseña"
                            className="border rounded-xl h-12 px-4 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            onChange={(e) =>
                                setUser((prev: any) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-2 top-12 text-xs text-blue-800"
                        >
                            {showPassword ? "Ocultar" : "Ver"}
                        </button>
                    </div>
                        

                    {/* Fecha de creación */}
                    <div className="pt-2">
                        <span className="text-lg font-semibold">Creado desde:</span>
                        <span className="text-md text-gray-700 ml-2">
                            {user
                                ? new Date(
                                    user.createdAt._seconds * 1000
                                ).toLocaleDateString()
                                : ""}
                        </span>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-center gap-6 pt-6">
                        <button
                            type="button"
                            onClick={openDeleteModal}
                            className="bg-blue-600 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-2xl text-lg shadow transition"
                        >
                            Eliminar cuenta
                        </button>

                        <button
                            className="bg-blue-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-2xl text-lg shadow transition"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>

            {/* MODAL DE ELIMINAR */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-lg relative">

                        <img
                            src="/warning.png"
                            alt="warning"
                            className="w-20 mx-auto mb-4"
                        />

                        <h2 className="text-2xl font-bold text-center mb-3">
                            Eliminar cuenta
                        </h2>

                        <p className="text-center text-gray-600 mb-5 text-sm">
                            Para confirmar, ingresa tu contraseña.
                        </p>

                        <form onSubmit={handleDelete} className="space-y-5">
                            
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="border rounded-xl h-12 px-4 w-full bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                placeholder="Ingresa tu contraseña"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-4 text-xs text-blue-800"
                            >
                                {showPassword ? "Ocultar" : "Ver"}
                            </button>
                        </div>
                            

                            {/* Botones del modal */}
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    className="bg-blue-600 hover:bg-blue-900 text-white px-6 py-2 rounded-xl font-semibold"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={loadingDelete}
                                    className="bg-blue-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold"
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
