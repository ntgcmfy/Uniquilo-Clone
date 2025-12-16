export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginResult {
  success: boolean;
  session?: any;
  user?: any;
  error?: any;
}
