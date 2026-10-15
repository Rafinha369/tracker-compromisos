import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ReviewPage from "./pages/ReviewPage";

function PrivateLayout({ children }) {
  return (
    <ProtectedRoute>
      <Navbar />
      {children}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateLayout><ReviewPage /></PrivateLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
