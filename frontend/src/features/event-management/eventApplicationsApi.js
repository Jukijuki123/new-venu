import api from "../../services/api";

// Ambil daftar lamaran untuk satu event (role: school)
export function getEventApplications(eventId) {
  return api.get(`/school/events/${eventId}/applications`).then((res) => res.data.data);
}

// Setujui lamaran → backend otomatis generate Booth
export function approveApplication(applicationId) {
  return api
    .patch(`/school/applications/${applicationId}/approve`)
    .then((res) => res.data.data);
}

// Tolak lamaran
export function rejectApplication(applicationId) {
  return api
    .patch(`/school/applications/${applicationId}/reject`)
    .then((res) => res.data.data);
}
