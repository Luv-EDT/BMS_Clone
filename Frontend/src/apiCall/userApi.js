
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";


export async function loginUser(payload) {
    try {
        const response = await axiosInstance.post(
            "/user/login",
            payload
        );

        return response;

    } catch (error) {
        return error.response;
    }
}



export async function getCurrentUser() {
    try {

        const response = await axiosInstance.get(
            "/user/getCurrentUser"
        );

        return response;

    } catch (error) {

        return error.response
    }
}


export async function getCurrentAdmin() {
    try {

        const response = await axiosInstance.get(
            "/user/getCurrentAdmin"
        );

        return response;

    } catch (error) {

        return error.response
    }
}




export async function registerUser(payload) {
    try {
        const response = await axiosInstance.post("/user/register", payload);
        return response;
    } catch (error) {
        return error.response;    
    }
}

