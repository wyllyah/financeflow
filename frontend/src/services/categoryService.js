import { api } from "./api";

export async function listCategories(params = {}) {
  const { data } = await api.get("/categories", { params });
  return data.categories || [];
}

export async function createCategory(payload) {
  const { data } = await api.post("/categories", payload);
  return data.category;
}

export async function updateCategory(id, payload) {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data.category;
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`);
}
