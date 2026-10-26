import api from "../../services/api";


export function getUmkms(params = {}) {
    return api.get("/umkms", { params }).then((res) => res.data);
}