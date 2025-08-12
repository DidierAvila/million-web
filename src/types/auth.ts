export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}

export interface AuthError {
  message: string;
  field?: string;
}
