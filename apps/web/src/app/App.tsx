import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../providers/AuthProvider";
import { LoginPage } from "../pages/Login";
import { ProductDetailPage } from "../pages/ProductDetail";
import { ProductListPage } from "../pages/ProductList";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();

  const location = useLocation();

  if (!isReady) return null;

  return user ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}
