import api from "../../services/api";

// School profile
export function getSchoolProfile() {
  return api.get("/school/profile").then((res) => res.data.data);
}

export function updateSchoolProfile(payload) {
  return api.put("/school/profile", payload).then((res) => res.data.data);
}
