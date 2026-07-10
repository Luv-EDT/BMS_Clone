import axiosInstance from "./axiosInstance"

export async function getAllTheatres() {
    const response = await axiosInstance.get("/theatres/getAll")
    return response
}

export async function getAllTheatresForAdmin() {
    const response = await axiosInstance.get("/theatres/getAllForAdmin")
    return response
}

export async function addTheatre(payload) {
    const response = await axiosInstance.post("/theatres/add", payload)
    return response
}

export async function updateTheatre(id, payload) {
    const response = await axiosInstance.put(`/theatres/update/${id}`, payload)
    return response
}
export async function updateTheatreForAdmin(id, payload) {
    const response = await axiosInstance.put(`/theatres/updateForAdmin/${id}`, payload)
    return response
}

export async function deleteTheatre(id) {
    const response = await axiosInstance.delete(`/theatres/delete/${id}`)
    return response
}