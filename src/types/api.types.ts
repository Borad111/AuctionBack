// types/api.types.ts
export interface ApiResponse<T> {
  message: string;
  data: T;
}
