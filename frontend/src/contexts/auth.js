import { createContext } from "react";

export const TOKEN_KEY = "@financeflow:token";
export const AuthContext = createContext(null);
const NETWORK_ERROR_MESSAGE =
  "Não foi possível conectar ao servidor. Tente novamente em instantes.";

function getValidationMessage(errors) {
  if (!Array.isArray(errors) || errors.length === 0) {
    return "";
  }

  return errors
    .map((error) => error?.message)
    .find(Boolean);
}

export function getErrorMessage(error, fallback) {
  if (!error?.response) {
    return NETWORK_ERROR_MESSAGE;
  }

  const data = error.response.data;

  if (data?.errors) {
    return getValidationMessage(data.errors) || data.message || fallback;
  }

  return data?.message || fallback;
}
