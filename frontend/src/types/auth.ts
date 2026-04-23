export interface UserBase {
  email: string;
  full_name?: string;
}

export interface UserCreate extends UserBase {
  password: string;
}

export interface UserResponse extends UserBase {
  id: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginForm extends UserBase {
  password: string;
}
