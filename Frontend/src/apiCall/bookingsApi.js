import axiosInstance from "./axiosInstance"



export async function getUserBookings() {
    const response = await axiosInstance.get("/bookings/getUserBookings")
    return response
}


export const createCheckoutSession = (data) => {
    return axiosInstance.post(
        "bookings/create-checkout-session",
        data
    );
};