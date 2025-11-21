import { Link } from "react-router";

export default function ProfilePage() {
    return (
        <main className="flex justify-center p-4 flex-col mx-auto w-1/2">
            <Link to={"/dashboard"} className="text-[#0B5CFF] underline">
                Atras
            </Link>
            <h1 className="text-3xl font-bold">Perfil de Usuario</h1>
            <form className="flex flex-col mt-6">
                <div className="flex flex-row gap-5 my-2">
                    <div className="flex flex-col w-full">
                        <label htmlFor="name" className="text-2xl font-bold">
                            Nombres
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="border h-10"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="lastName"
                            className="text-2xl font-bold"
                        >
                            Apellidos
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            className="border h-10"
                        />
                    </div>
                </div>

                <div className="flex flex-col my-2">
                    <label htmlFor="email" className="text-2xl font-bold">
                        Email
                    </label>
                    <input type="email" name="email" className="border h-10" />
                </div>
                <div className="flex flex-col my-2">
                    <label htmlFor="age" className="text-2xl font-bold">
                        Edad
                    </label>
                    <input type="text" name="age" className="border h-10" />
                </div>
                <div className="flex flex-col my-2">
                    <label htmlFor="password" className="text-2xl font-bold">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="border h-10"
                    />
                </div>
                <div className="my-4">
                    <label className="text-2xl font-bold">Creado desde: </label>
                    <label className="text-xl"> 01/01/2001</label>
                </div>
                <div className="flex justify-center flex-row gap-4">
                    <button className="bg-red-400 text-white font-bold p-2 text-2xl rounded-sm w-30 cursor-pointer">
                        Cancelar
                    </button>
                    <button className="bg-yellow-400 p-2 text-2xl rounded-sm text-white font-bold w-30 cursor-pointer ">
                        Editar
                    </button>
                </div>
                <div>
                    <button className="bg-red-600 text-white font-bold p-2 text-xl rounded-md cursor-pointer">
                        Eliminar Cuenta
                    </button>
                </div>
            </form>
        </main>
    );
}
