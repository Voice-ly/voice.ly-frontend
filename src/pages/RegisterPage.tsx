import { Link, useNavigate } from "react-router";
import logo from "/logo.jpeg";
import { useState, useEffect } from "react";
import {
  register,
  //registerWithGoogle,
  //registerWithFacebook,
} from "../lib/UserService";
import type { UserSignupForm } from "../types/User";
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "../components/AuthButtons";
import { loginWithFacebook, loginWithGoogle } from "../lib/AuthService";

// Regex
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export default function RegisterPage() {
  // --- VALORES DEL FORMULARIO ---
  const [firstName, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [activeField, setActiveField] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  // --- CHECKS DE CONTRASEÑA ---
  const passwordChecks = {
    length: (pw: string) => pw.length >= 8,
    upper: (pw: string) => /[A-Z]/.test(pw),
    number: (pw: string) => /\d/.test(pw),
    special: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  };

  // --- CAMBIO DE INPUTS ---
  const handleInput = (name: string, value: string) => {
    setActiveField(name);

    if (
      (name === "firstName" || name === "lastName") &&
      value &&
      !nameRegex.test(value)
    ) {
      return; // Solo letras
    }

    if (name === "age" && !/^\d*$/.test(value)) {
      return; // Solo números
    }

    switch (name) {
      case "firstName":
        setName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "age":
        setAge(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmpassword":
        setConfirmPassword(value);
        break;
    }
  };

  // --- VALIDACIONES ---
  useEffect(() => {
    if (!activeField) return;

    let errorText = "";

    switch (activeField) {
      case "firstName":
        errorText =
          firstName.trim().length < 2 || !nameRegex.test(firstName)
            ? "Nombre inválido"
            : "";
        break;

      case "lastName":
        errorText =
          lastName.trim().length < 2 || !nameRegex.test(lastName)
            ? "Apellido inválido"
            : "";
        break;

      case "email":
        errorText = emailRegex.test(email) ? "" : "Correo inválido";
        break;

      case "password":
        const goodPassword =
          passwordChecks.length(password) &&
          passwordChecks.upper(password) &&
          passwordChecks.number(password) &&
          passwordChecks.special(password);

        errorText = goodPassword ? "" : "Contraseña no cumple requisitos";
        break;

      case "confirmpassword":
        errorText =
          confirmpassword === password ? "" : "Las contraseñas no coinciden";
        break;

      case "age":
        const numAge = Number(age);
        errorText = numAge >= 13 && numAge <= 120 ? "" : "Edad inválida";
        break;
    }

    const newErrors = { ...errors, [activeField]: errorText };
    setErrors(newErrors);

    // Form completo y sin errores
    const noErrors = Object.values(newErrors).every((e) => e === "");
    const allFilled = Boolean(
      firstName && lastName && email && password && confirmpassword && age
    );
    setIsValid(noErrors && allFilled);
  }, [firstName, lastName, email, password, confirmpassword, age, activeField]);

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

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
        const text = await res.text().catch(() => "");
        console.error("Registro falló:", res.status, text);
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      console.error("Error al registrar:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <img src={logo} alt="logo" className="w-[99px] h-[77px] mx-auto" />

        <h1 className="text-3xl text-center font-bold mt-2">Registrate</h1>
        <div className="flex gap-3 justify-center my-4">
          <GoogleLoginButton submit={() => loginWithGoogle(navigate)} />
          <FacebookLoginButton submit={() => loginWithFacebook(navigate)} />
        </div>

        {/* FIRST NAME */}
        <div className="flex flex-col w-full relative">
          <label className="text-[13px]">Nombres</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => handleInput("firstName", e.target.value)}
            title="Solo letras, mínimo 2 caracteres"
            className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
              errors.firstName ? "border-red-500" : "border-[#918EF4]"
            }`}
            placeholder="Ingresa tus nombres"
          />
          <p className="text-xs text-red-600">{errors.firstName}</p>
        </div>

        {/* LAST NAME */}
        <div className="flex flex-col w-full mt-4 relative">
          <label className="text-[13px]">Apellidos</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => handleInput("lastName", e.target.value)}
            title="mas de Solo letras"
            className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
              errors.lastName ? "border-red-500" : "border-[#918EF4]"
            }`}
            placeholder="Ingresa tus apellidos"
          />
          <p className="text-xs text-red-600">{errors.lastName}</p>
        </div>

        {/* AGE */}
        <div className="flex flex-col w-full mt-4 relative">
          <label className="text-[13px]">Edad</label>
          <input
            type="number"
            name="age"
            value={age}
            onChange={(e) => handleInput("age", e.target.value)}
            title="Ingresa una edad válida entre 13 y 120 años "
            className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
              errors.age ? "border-red-500" : "border-[#918EF4]"
            }`}
            placeholder="Ingresa tu edad"
          />
          <p className="text-xs text-red-600">{errors.age}</p>
        </div>

        {/* EMAIL */}
        <div className="flex flex-col w-full mt-4 relative">
          <label className="text-[13px]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleInput("email", e.target.value)}
            title="Debe ser un correo válido"
            className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
              errors.email ? "border-red-500" : "border-[#918EF4]"
            }`}
            placeholder="Ingresa tu correo ejem:correo@example.com"
          />
          <p className="text-xs text-red-600">{errors.email}</p>
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col w-full mt-4 relative">
          <label className="text-[13px]">Contraseña</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handleInput("password", e.target.value)}
            title="Contraseña no cumple los requisitos, debe contener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo"
            className={`text-[13px] py-2 border-b bg-transparent focus:outline-none pr-20 ${
              errors.password ? "border-red-500" : "border-[#918EF4]"
            }`}
            placeholder="Ingresa tu contraseña"
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-8 text-xs text-blue-600"
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>

          <p className="text-xs text-red-600">{errors.password}</p>

          {/* CHECKLIST */}
          <ul className="text-xs mt-2 space-y-1">
            <li
              className={
                passwordChecks.length(password)
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              • 8 caracteres
            </li>
            <li
              className={
                passwordChecks.upper(password)
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              • Una mayúscula
            </li>
            <li
              className={
                passwordChecks.number(password)
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              • Un número
            </li>
            <li
              className={
                passwordChecks.special(password)
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              • Un caracter especial
            </li>
          </ul>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="flex flex-col w-full mt-4 relative">
          <label className="text-[13px]">Confirmar contraseña</label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmpassword}
            onChange={(e) => handleInput("confirmpassword", e.target.value)}
            title="Debe coincidir con la contraseña"
            className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
              errors.confirmpassword ? "border-red-500" : "border-[#918EF4]"
            }`}
            placeholder="Repite tu contraseña"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-8 text-xs text-blue-600"
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>

          <p className="text-xs text-red-600">{errors.confirmpassword}</p>
        </div>
        {/* SUCCESS MODAL */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center border border-gray-200 pointer-events-auto">
              <h2 className="text-xl font-bold text-green-600">
                ¡Cuenta creada!
              </h2>
              <p className="mt-2 text-gray-700">
                Tu usuario ha sido registrado exitosamente.
              </p>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/login");
                }}
                className="mt-4 bg-[#7B76F1] text-white px-6 py-2 rounded-full hover:brightness-110 transition"
              >
                Ir al login
              </button>
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={!isValid}
            className={`bg-[#7B76F1] rounded-full text-white font-bold w-[153px] h-[56px]
              ${
                isValid ? "opacity-100" : "opacity-40 cursor-not-allowed"
              } cursor-pointer`}
          >
            Registrarme
          </button>
        </div>

        <p className="text-[13px] text-center mt-10 cursor-pointer">
          ¿Ya tienes una cuenta?
          <Link
            to="/login"
            className="text-[#1976D2] font-bold ml-1 inline-block"
          >
            ¡Inicia sesión ahora!
          </Link>
        </p>
      </form>
    </div>
  );
}
