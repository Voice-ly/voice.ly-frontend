export interface UserSignupForm {
    name: string;
    lastName: string;
    age: number;
    birthDate: string;
    email: string;
    password: string;
    confirmpassword: string;
}

export interface UserSigninForm {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    password: string;
}
