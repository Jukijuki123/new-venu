import api from "../../services/api";

// GET /v1/umkm/applications
export function getUmkmApplications() {
  return api.get("/umkm/applications").then((res) => res.data.data);
}
export function getUmkmApplication(id) {
  return api.get(`/umkm/applications/${id}`).then((res) => res.data.data);
}
