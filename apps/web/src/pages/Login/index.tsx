import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { Button, Input, PasswordInput } from "../../components/ui";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("test@ornek.com"),
    [password, setPassword] = useState("Test1234!"),
    [error, setError] = useState(""),
    [isSubmitting, setIsSubmitting] = useState(false);

  if (user) return <Navigate to="/products" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname ?? "/products", {
        replace: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş yapılamadı.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <section className="flex min-h-[340px] flex-col justify-between bg-navy px-8 py-10 text-white sm:px-14 lg:px-[clamp(35px,8vw,130px)]">
        <div className="flex items-center gap-2.5 text-lg font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-xs">
            SM
          </span>
          <div>
            StokMate
            <span className="block text-[10px] font-medium uppercase tracking-[.08em] text-navy-muted">
              Yönetim Paneli
            </span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.12em] text-blue-300">
            Merkez ofis için
          </p>
          <h1 className="max-w-lg text-4xl font-extrabold leading-none tracking-tight sm:text-6xl">
            Stoğunuzun nabzını tutun.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300">
            Ürün kataloğunu, fiyatları ve mağaza stoklarını tek noktadan
            yönetin.
          </p>
        </div>

        <div className="hidden gap-12 sm:flex">
          <div className="grid gap-1">
            <strong className="text-2xl">80</strong>
            <span className="text-xs text-navy-muted">örnek ürün</span>
          </div>
          <div className="grid gap-1">
            <strong className="text-2xl">8</strong>
            <span className="text-xs text-navy-muted">kategori</span>
          </div>
        </div>
      </section>

      <section className="grid place-items-center bg-white p-6">
        <form className="w-full max-w-sm" onSubmit={submit}>
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.12em] text-slate-500">
            Hoş geldiniz
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">
            Hesabınıza giriş yapın
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Devam etmek için kurumsal hesabınızı kullanın.
          </p>

          {error && (
            <div className="mt-5 rounded-control border border-red-200 bg-danger-soft px-3 py-2.5 text-sm text-danger">
              {error}
            </div>
          )}

          <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-600">
            E-posta
            <Input
              className="py-3"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-600">
            Şifre
          <PasswordInput
            className="py-3"
            value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <Button className="mt-6 w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? "Giriş yapılıyor…" : "Giriş yap"}
          </Button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Demo hesabı bilgileri otomatik dolduruldu.
          </p>
        </form>
      </section>
    </div>
  );
}
