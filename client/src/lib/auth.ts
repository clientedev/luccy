import { apiRequest } from "@/lib/queryClient";

export interface AuthResponse {
  isAdmin: boolean;
  success?: boolean;
  message?: string;
}

export const authService = {
  async login(password: string): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/admin/login", { password });
    return response.json();
  },

  async logout(): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/admin/logout");
    return response.json();
  },

  async checkStatus(): Promise<AuthResponse> {
    const response = await apiRequest("GET", "/api/admin/status");
    return response.json();
  }
};
