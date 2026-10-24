import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({ children, requiredRole }) => {
    const { loading, user } = useAuth()

     if(loading){
        return (<main><h1>Loading...</h1></main>)
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />
    }

    return children ? children : null
}

export default Protected