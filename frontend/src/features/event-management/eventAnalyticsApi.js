import api from "../../services/api";

export function getEventAnalytics(eventId) {
  return api
    .get(`/school/events/${eventId}/analytics`)
    .then((res) => res.data.data);
}