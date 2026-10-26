import { Bell, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const NAV_ITEMS = [
  { label: "Beranda", target: "beranda" },
  { label: "Tentang", target: "tentang" },
  { label: "Fitur", target: "fitur" },
  { label: "Cara Kerja", target: "cara-kerja" },
  { label: "Testimoni", target: "testimoni" },
];

export default function Navbar({ user: userProp }) {
  const { user: userCtx, loading } = useAuth();
  const user = userCtx || userProp;
  const isLoggedIn = Boolean(user) && !loading;
  const [activeSection, setActiveSection] = useState("beranda");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentSection = "beranda";

      for (const item of NAV_ITEMS) {
        const section = document.getElementById(item.target);

        if (!section) continue;

        const sectionTop =
          section.getBoundingClientRect().top + window.scrollY;

        if (scrollPosition >= sectionTop) {
          currentSection = item.target;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToSection = (target) => {
    const section = document.getElementById(target);

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActiveSection(target);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm md:relative">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <button
          type="button"
          onClick={() => scrollToSection("beranda")}
          className="flex items-center gap-1 text-xl font-extrabold text-navy"
        >
          <img
            src="/logo-venu.svg"
            alt="Logo Venu"
            className="w-8"
          />
          <span className="ml-1">VENU</span>
        </button>

        <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.target;

            return (
              <li key={item.target}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.target)}
                  className={[
                    "border-b-2 pb-1 transition-all duration-200",
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-navy/70 hover:text-navy",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                aria-label="Notifikasi"
                className="text-navy/70 transition-colors hover:text-navy"
              >
                <Bell size={20} />
              </button>

              <div className="flex items-center gap-2">
                <img
                  src={
                    user.avatarUrl ||
                    "/default-avatar.png"
                  }
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />

                <div className="text-left text-sm leading-tight">
                  <p className="font-semibold text-navy">
                    {user.name}
                  </p>
                  <p className="text-xs text-navy/50">
                    {user.roleLabel}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-navy transition-colors hover:text-accent"
              >
                Masuk
              </Link>

              <Link
                to="/register"
                className="btn-accent px-5 py-2 text-sm"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label={
            isMenuOpen
              ? "Tutup menu navigasi"
              : "Buka menu navigasi"
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-navy transition-colors hover:bg-navy/5 md:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-40 border-t border-navy/10 bg-white px-4 pb-5 pt-3 shadow-lg md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const isActive =
                activeSection === item.target;

              return (
                <li key={item.target}>
                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection(item.target)
                    }
                    className={[
                      "w-full rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-navy/70 hover:bg-navy/5 hover:text-navy",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 border-t border-navy/10 pt-4">
            {isLoggedIn ? (
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.avatarUrl ||
                      "/default-avatar.png"
                    }
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />

                  <div className="text-sm leading-tight">
                    <p className="font-semibold text-navy">
                      {user.name}
                    </p>
                    <p className="text-xs text-navy/50">
                      {user.roleLabel}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Notifikasi"
                  className="text-navy/70 transition-colors hover:text-navy"
                >
                  <Bell size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 rounded-full border border-navy px-4 py-2 text-center text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-accent flex-1 px-4 py-2 text-center text-sm"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}