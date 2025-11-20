import { Link, useNavigate } from "react-router";
import logo from "/logo.jpeg";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { register } from "../lib/UserService";
import type { UserSignupForm } from "../types/User";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export default function RegisterPage() {
  const [firstName, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<string>(""); // keep as string for easier input handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const navigate = useNavigate();

  // Validate live
  useEffect(() => {
    const match = password === confirmpassword && password.length >= 8;
    setPasswordsMatch(match);

    const ageNum = Number(age);
    const basicChecks =
      firstName.trim().length >= 2 &&
      lastName.trim().length >= 2 &&
      !Number.isNaN(ageNum) &&
      ageNum >= 10 &&
      ageNum <= 120 &&
      emailRegex.test(email) &&
      passwordRegex.test(password) &&
      match;

    setIsValid(basicChecks);
  }, [firstName, lastName, age, email, password, confirmpassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) return; // safety

    const payload: UserSignupForm = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: Number(age),
      email: email.trim(),
      password,
      confirmpassword,
    };

    try {
      const res = await register(payload);
      if (!res.ok) {
        // lee mensaje de error si tu API lo devuelve en JSON
        const text = await res.text().catch(() => "");
        console.error("Registro falló:", res.status, text);
        return;
      }
      Swal.fire({
        title: "¡Cuenta creada!",
        text: "Tu usuario ha sido registrado exitosamente.",
        icon: "success",
        confirmButtonText: "Ir al login",
        confirmButtonColor: "#7B76F1",
      }).then(() => {
        navigate("/login");
      });
      // opcional: redirigir al login o limpiar formulario
    } catch (err) {
      console.error("Error al registrar:", err);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10">
      <img src={logo} alt="logo" className="w-[99px] h-[77px] mx-auto" />

      <h1 className="text-3xl text-center font-bold mt-2">Registrate</h1>
      <h1 className="text-center mt-3">(Botones Proveedores)</h1>

      <form className="w-full mt-6" onSubmit={handleSubmit}>

        {/* NAME */}
        <div className="flex flex-col w-full">
          <label className="text-[13px]">Nombres</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
            placeholder="Juan"
          />
        </div>

        {/* LAST NAME */}
        <div className="flex flex-col w-full mt-4">
          <label className="text-[13px]">Apellidos</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            minLength={2}
            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
            placeholder="Guzman"
          />
        </div>

        {/* AGE */}
        <div className="flex flex-col w-full mt-4">
          <label className="text-[13px]">Edad</label>
          <input
            type="number"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min={10}
            max={120}
            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
            placeholder="30"
          />
        </div>

        {/* EMAIL */}
        <div className="flex flex-col w-full mt-4">
          <label className="text-[13px]">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
            placeholder="correo@example.com"
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col w-full mt-4">
          <label className="text-[13px]">Contraseña</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$"
            title="Debe contener: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"
            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
            placeholder="Tu contraseña"
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="flex flex-col w-full mt-4">
          <label className="text-[13px]">Confirmar Contraseña</label>
          <input
            type="password"
            name="confirmpassword"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className={`text-[13px] py-2 border-b bg-transparent focus:outline-none
              ${passwordsMatch ? "border-[#918EF4]" : "border-red-500"}`}
            placeholder="Repite tu contraseña"
          />
        </div>

        {/* SUBMIT */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={!isValid}
            className={`bg-[#7B76F1] rounded-full text-white font-bold w-[153px] h-[56px]
              ${isValid ? "opacity-100" : "opacity-40 cursor-not-allowed"}`}
          >
            REGISTRARME
          </button>
        </div>

        <p className="tex-[#424242] text-[13px] text-center mt-10">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-[#1976D2] font-bold">INICIA SESIÓN AHORA!</Link>
        </p>
      </form>
    </div>
  );
}