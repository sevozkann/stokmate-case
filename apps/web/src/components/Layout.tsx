import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[252px_1fr]">
      <aside className="flex bg-navy px-5 py-4 text-slate-100 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:flex-col lg:px-[18px] lg:py-7">
        <div className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-xs tracking-normal text-white">
            SM
          </span>
          <div>
            StokMate
            <span className="block text-[10px] font-medium uppercase tracking-[.08em] text-navy-muted">
              Yönetim Paneli
            </span>
          </div>
        </div>
        <nav className="ml-6 lg:ml-0 lg:mt-12">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2.5 text-sm transition ${isActive ? "bg-navy-surface text-white" : "text-slate-300 hover:bg-navy-surface hover:text-white"}`
            }
          >
            Ürün kataloğu
          </NavLink>
        </nav>
        <div className="ml-auto hidden border-t border-slate-700 px-2 pt-5 text-[13px] lg:ml-0 lg:mt-auto lg:grid lg:gap-1">
          <strong>{user?.fullName}</strong>
          <small className="text-navy-muted">{user?.email}</small>
          <button
            className="mt-2 w-fit text-left text-slate-300 transition hover:text-white"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            Çıkış yap
          </button>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
