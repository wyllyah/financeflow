import { api } from "./api";

export async function getProfile() {
  const { data } = await api.get("/users/profile");
  return data.user;
}

export async function updateProfile(payload) {
  const { data } = await api.put("/users/profile", payload);
  return data.user;
}
