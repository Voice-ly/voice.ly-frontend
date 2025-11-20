export interface UserSignupForm {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    confirmpassword: string;
}

export interface UserSigninForm {
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    password: string;
}
