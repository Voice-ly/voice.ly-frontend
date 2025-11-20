const production: boolean = import.meta.env.VITE_PRODUCTION === "true";

const baseUrl: string = production
    ? import.meta.env.VITE_PRODUCTION_URL
    : import.meta.env.VITE_DEVELOPMENT_URL;

const environments = {
    baseUrl,

    users: {
        profile: "/users/profile",   // GET (obtener perfil)
        updateProfile: "/users/profile", // PUT
        deleteProfile: "/users/profile", // DELETE
        createUser: "/users",            // POST (registro)
    },

    auth: {
        login: "/auth/login",
        logout: "/auth/logout",
        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password",
    },
};

export default environments;
