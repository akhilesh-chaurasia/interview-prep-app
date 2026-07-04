import { createBrowserRouter, Outlet } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import VerifyEmail from "./features/auth/pages/VerifyEmail";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interviews/pages/Home";
import Interview from "./features/interviews/pages/Dashboard/InterviewDashboard";
import InterviewSession from './features/interviews/pages/Session/InterviewSession'
import MySessions from './features/interviews/pages/MySessions'
import Analytics from './features/interviews/pages/Analytics'
import { CollaborativeRoom } from './features/interviews/pages/CollaborativeRoom'
import { CollaborativeSession } from './features/interviews/pages/CollaborativeSession'
import AdminDashboard from './features/admin/pages/AdminDashboard'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/verify-email",
        element: <VerifyEmail />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Protected><Home /></Protected>
            },
            {
                path:"/interview/:interviewId",
                element: <Protected><Interview /></Protected>
            },
            {
                path: "/sessions",
                element: <Protected><MySessions /></Protected>
            },
            {
                path: "/analytics",
                element: <Protected><Analytics /></Protected>
            },
            {
                path: "/interview/session/:sessionId",
                element: <Protected><InterviewSession /></Protected>
            },
            {
                path: "/collaborative",
                element: <Protected><CollaborativeRoom /></Protected>
            },
            {
                path: "/collaborative/session",
                element: <Protected><CollaborativeSession /></Protected>
            },
            {
                path: "/admin",
                element: <Protected><AdminDashboard /></Protected>
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
])