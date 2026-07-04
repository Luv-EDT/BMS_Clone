import axiosInstance from "./axiosInstance"

export async function getAllMovies() {
    const response = await axiosInstance.get("/movies/getAll")
    return response
}

export async function addMovie(payload) {
    const response = await axiosInstance.post("/movies/add", payload)
    return response
}

export async function updateMovie(id, payload) {
    const response = await axiosInstance.put(`/movies/update/${id}`, payload)
    return response
}

export async function deleteMovie(id) {
    const response = await axiosInstance.delete(`/movies/delete/${id}`)
    return response
}
    