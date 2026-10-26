import api from "../../services/api";

// UMKM profile
export function getUmkmProfile() {
  return api.get("/umkm/profile").then((res) => res.data.data);
}

export function updateUmkmProfile(payload) {
  return api.put("/umkm/profile", payload).then((res) => res.data.data);
}
