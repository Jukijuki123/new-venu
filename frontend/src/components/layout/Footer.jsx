import {
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Beranda", to: "/" },
  { label: "Event", to: "/events" },
  { label: "UMKM", to: "/umkm" },
  { label: "AI Match", to: "/ai-match" },
  { label: "Sekolah", to: "/sekolah" },
];

const USER_LINKS = [
  { label: "Untuk UMKM", to: "/umkm" },
  { label: "Untuk Sekolah", to: "/sekolah" },
  { label: "Cara Kerja", to: "/#cara-kerja" },
  { label: "FAQ", to: "/faq" },
  { label: "Pusat Bantuan", to: "/bantuan" },
];

const SOCIALS = [
  { icon: FaGithub, href: "https://github.com" },
  { icon: FaTwitter, href: "https://twitter.com" },
  { icon: FaFacebookF, href: "https://facebook.com" },
];

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-white/70">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              <span className="text-accent">&rsaquo;</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-dark text-white mt-3">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-32 pt-14 md:grid-cols-4 md:px-8 md:pb-40">
        <div>
          <div className="flex items-center gap-1">
            <img src="/logo-venu.svg" alt="" className="w-8" />
            <p className="flex items-center text-2xl font-extrabold">
              <span className="text-accent">V</span>ENU
            </p>
          </div>

          <p className="mt-4 max-w-xs text-sm text-white/60">
            Venu adalah platform yang menghubungkan UMKM dan sekolah
            melalui event yang tepat, relevan, dan berdampak.
          </p>

          <span className="mt-5 block h-0.5 w-16 bg-accent"></span>

          <div className="mt-5 flex gap-3">
            {SOCIALS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Sosial media VENU"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-accent hover:text-navy"
                >
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
        </div>

        <FooterLinkGroup title="Navigasi" links={NAV_LINKS} />
        <FooterLinkGroup title="Untuk Pengguna" links={USER_LINKS} />

        <div>
          <h3 className="font-bold">Hubungi Kami</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
              Jl. Balai Pustaka Baru I
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-accent" />
              <a href="mailto:smkn26jkt@gmail.com" className="underline hover:text-accent">
                smkn26jkt@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-accent" />
              <a href="tel:+628216462626" className="underline hover:text-accent">
                +62 821 646 2626
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 shrink-0 text-accent" />
              Senin - Jumat
              <br />
              08.00 - 15.00 WIB
            </li>
          </ul>
        </div>
      </div>

      <svg
        aria-hidden="true"
        className="absolute bottom-8 left-0 h-24 w-full text-accent md:h-32"
        viewBox="0 0 1024 140"
        preserveAspectRatio="none"
      >
        <path
          d="M0 90 C 200 20, 400 20, 512 70 C 624 120, 824 120, 1024 40 L1024 140 L0 140 Z"
          fill="currentColor"
          opacity="0.5"
        ></path>
        <path
          d="M0 110 C 220 40, 420 40, 512 90 C 620 135, 820 135, 1024 60 L1024 140 L0 140 Z"
          fill="currentColor"
        ></path>
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-2 bg-accent px-4 py-3 text-xs font-medium text-navy md:flex-row md:justify-end md:gap-6 md:px-8">
        <a href="/privasi" className="hover:underline">
          Kebijakan Privasi
        </a>
        <a href="/syarat" className="hover:underline">
          Syarat &amp; Ketentuan
        </a>
        <a href="/cookie" className="hover:underline">
          Kebijakan Cookie
        </a>
      </div>
    </footer >
  );
}