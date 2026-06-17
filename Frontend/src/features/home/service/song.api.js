import axios from "axios"


const api = axios.create({
    baseURL: "https://moodify-ai-backendv4.onrender.com",
    withCredentials: true
})

export async function getSong({ mood }){
    const response = await api.get("/api/songs?mood="+mood)
    return response.data
}
