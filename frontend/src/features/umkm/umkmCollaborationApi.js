import api from "../../services/api";

// GET /v1/collaborations
export function getCollaborations() {
  return api.get("/collaborations").then((res) => res.data.data);
}

// POST /v1/collaborations/{id}/accept
export function acceptCollaboration(id) {
  return api.post(`/collaborations/${id}/accept`).then((res) => res.data);
}

// POST /v1/collaborations/{id}/reject
export function rejectCollaboration(id) {
  return api.post(`/collaborations/${id}/reject`).then((res) => res.data);
}

// POST /v1/collaborations/{id}/negotiate
export function negotiateCollaboration(id, payload = {}) {
  return api.post(`/collaborations/${id}/negotiate`, payload).then((res) => res.data);
}

// POST /v1/collaborations/{id}/cancel
export function cancelCollaboration(id) {
  return api.post(`/collaborations/${id}/cancel`).then((res) => res.data);
}