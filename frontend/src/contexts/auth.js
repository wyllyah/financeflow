import { createContext } from "react";

export const TOKEN_KEY = "@financeflow:token";
export const AuthContext = createContext(null);

export function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}
