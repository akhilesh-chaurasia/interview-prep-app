 import { Toaster } from 'react-hot-toast';
import { RouterProvider } from "react-router"
import {router} from "./app.route.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interviews/interview.context.jsx"

function App() {

 return (
  <AuthProvider>
    <InterviewProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </InterviewProvider>
  </AuthProvider>
)
}

export default App
