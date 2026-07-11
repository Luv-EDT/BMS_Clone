import axiosInstance from "./axiosInstance"

export async function getAllShows() {
    const response = await axiosInstance.get("/shows/getAll")
    return response
}

export async function getUserShows() {
    const response = await axiosInstance.get("/shows/getUserShows")
    return response
}

export async function addShow(payload) {
    const response = await axiosInstance.post("/shows/add", payload)
    return response
}

export async function updateShow(id, payload) {
    const response = await axiosInstance.put(`/shows/update/${id}`, payload)
    return response
}

export async function deleteShow(id) {
    const response = await axiosInstance.delete(`/shows/delete/${id}`)
    return response
}