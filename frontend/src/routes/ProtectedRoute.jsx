import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ allowedRole }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-surface">
                <p className="text-sm text-navy/50">Memuat...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        if (user.role === "school") {
            return <Navigate to="/school" replace />;
        }

        if (user.role === "umkm") {
            return <Navigate to="/umkm" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}