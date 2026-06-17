import { login, register, logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () =>{
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    async function handleRegistered({ username, email, password}){
        try {
            setLoading(true)
            const data = await register({ username, email, password})
            setUser(data.user)
        } catch (error) {
            setUser(null)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function handleLogin({ username, email, password}){
        try {
            setLoading(true)
            const data = await login({ username, email, password})
            setUser(data.user)
        } catch (error) {
            setUser(null)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function handleLogOut(){
        try {
            setLoading(true)
            await logout()
        } catch (error) {
            console.error("Logout failed on server", error)
        } finally {
            setUser(null)
            setLoading(false)
        }
    }

    return({
        user, loading, handleRegistered, handleLogin, handleLogOut
    })
}