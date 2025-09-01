export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}


export interface LoginRequest{
  token: string;
}
