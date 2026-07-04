import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { useNotifications } from "../../notifications/notifications.context.jsx";
import {login, register, logout} from "../services/auth.api"

export const useAuth = ()=>{
    const context = useContext(AuthContext)
    const { addNotification } = useNotifications()

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }

    const {user , setUser , loading , setLoading} = context

    const handleLogin  = async ({email , password}) =>{
        setLoading(true)
        try{
            const data = await login({email , password})
            setUser(data.user)
            addNotification({
                type: 'success',
                title: 'Welcome Back!',
                message: `Hi ${data.user.username}, you've logged in successfully`
            })
        } catch(err){
            addNotification({
                type: 'error',
                title: 'Login Failed',
                message: err.message || 'Invalid credentials'
            })
        } finally{
            setLoading(false)
        }   
    }

    const handleRegister = async ({username , email , password})=>{
        setLoading(true)
        try{
            const data = await register({username , email, password})
            setUser(data.user)
            addNotification({
                type: 'success',
                title: 'Account Created!',
                message: `Welcome ${username}! Check your email for verification`
            })
        } catch(err){
            addNotification({
                type: 'error',
                title: 'Registration Failed',
                message: err.message || 'Could not create account'
            })
        } finally{
            setLoading(false)
        }
    }

    const handleLogout = async ()=>{
        setLoading(true)
        try{
            await logout()
            setUser(null)
        } catch(err){
            console.log(err.message)
        } finally{
            setLoading(false)
        }
    }

   return {
    user,
    setUser,
    loading,
    setLoading,
    handleRegister,
    handleLogin,
    handleLogout
   }
}