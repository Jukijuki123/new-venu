import api from "../../services/api";

export function getEvents(params = {}) {
  return api
    .get("/events", { params })
    .then((res) => res.data);
}

export function getEventBySlug(slug) {
  return api
    .get(`/events/${slug}`)
    .then((res) => res.data);
}