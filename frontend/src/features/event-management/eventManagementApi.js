import api from "../../services/api";

export function getMyEvents() {
  return api.get("/school/events").then((res) => res.data.data);
}

export function createEvent(payload) {
  return api.post("/school/events", payload).then((res) => res.data.data);
}

export function updateEvent(eventId, payload) {
  return api.put(`/school/events/${eventId}`, payload).then((res) => res.data.data);
}

export function deleteEvent(eventId) {
  return api.delete(`/school/events/${eventId}`).then((res) => res.data);
}

export function publishEvent(eventId) {
  return api.post(`/school/events/${eventId}/publish`).then((res) => res.data.data);
}