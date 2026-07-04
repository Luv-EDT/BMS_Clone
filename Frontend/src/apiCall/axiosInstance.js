// // create a axios instance here, with default method post and a bearer token fetching from localStorage.get("token")import axios from "axios";
// import axios from "axios"

// const axiosInstance = axios.create({
//     baseURL: "http://localhost:8080",
//     method: "post",
//        headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "application/json",
//     },

// });
// export default axiosInstance

import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosInstance