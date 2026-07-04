 import { Toaster } from 'react-hot-toast';
import { RouterProvider } from "react-router"
import {router} from "./app.route.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interviews/interview.context.jsx"
import { ThemeProvider } from "./features/theme/theme.context.jsx"
import { NotificationsProvider } from "./features/notifications/notifications.context.jsx"
import ErrorBoundary from "./components/ErrorBoundary.jsx"

function App() {

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationsProvider>
          <AuthProvider>
            <InterviewProvider>
              <RouterProvider router={router} />
              <Toaster position="top-right" reverseOrder={false} />
            </InterviewProvider>
          </AuthProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
