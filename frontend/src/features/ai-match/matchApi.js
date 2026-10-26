import api from "../../services/api";

export function getUmkmMatches(params = {}) {
  return api.get("/umkm/matches", { params }).then((res) => res.data.data);
}

export function getSchoolEvents() {
  return api.get("/school/events").then((res) => res.data.data);
}

export function getSchoolMatches(eventId, params = {}) {
  return api.get(`/school/events/${eventId}/matches`, { params }).then((res) => res.data.data);
}

export function applyToEvent(eventId, payload = {}) {
  return api.post(`/events/${eventId}/applications`, payload).then((res) => res.data);
}

// Collaboration — School invites UMKM
export function schoolInviteUmkm({ event_id, umkm_id, message, proposed_price }) {
  return api
    .post("/school/collaborations", { event_id, umkm_id, message, proposed_price })
    .then((res) => res.data);
}

export function getCollaborations() {
  return api.get("/collaborations").then((res) => res.data.data);
}

export function acceptCollaboration(id) {
  return api.post(`/collaborations/${id}/accept`).then((res) => res.data);
}
export function rejectCollaboration(id) {
  return api.post(`/collaborations/${id}/reject`).then((res) => res.data);
}
export function negotiateCollaboration(id, payload = {}) {
  return api.post(`/collaborations/${id}/negotiate`, payload).then((res) => res.data);
}
