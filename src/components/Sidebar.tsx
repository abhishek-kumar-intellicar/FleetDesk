import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { APP_BADGE, APP_NAME, APP_TAGLINE } from "@/constants/branding";
import { customers } from "@/lib/routes";

const DUMMY_USER = {
  name: "Neeraj Account Manager",
  email: "manager@intellicar.in",
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const CUSTOMERS_ICON = "M17 20h5V4H2v16h5m10 0a5 5 0 00-10 0m10 0H7";

const CUSTOMER_NAV = [
  { href: customers.dashboard, label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: customers.clients, label: "Clients", icon: "M17 20h5V4H2v16h5m10 0a5 5 0 00-10 0m10 0H7" },
  { href: customers.pipeline, label: "Pipeline", icon: "M3 6h18M3 12h12M3 18h6" },
  { href: customers.devices, label: "Devices", icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM5 17H3V5h13v6m0 0h4l1 3v3h-2" },
];

const HOVER_LEAVE_DELAY_MS = 200;

function NavIcon({ d, className = "h-5 w-5 shrink-0" }: { d: string; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function isNavActive(pathname: string, href: string) {
  return href === customers.dashboard
    ? pathname === customers.dashboard
    : pathname.startsWith(href);
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const inCustomers =
    pathname === customers.dashboard || pathname.startsWith("/customers/");

  const [expanded, setExpanded] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const openSidebar = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setExpanded(true);
  };

  const closeSidebar = () => {
    leaveTimerRef.current = setTimeout(() => {
      setExpanded(false);
      setCustomersOpen(false);
      leaveTimerRef.current = null;
    }, HOVER_LEAVE_DELAY_MS);
  };

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
      active
        ? "bg-brand-50 text-brand-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const customersHeaderClass = inCustomers
    ? "text-brand-700"
    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900";

  const labelClass = (visible: boolean) =>
    `overflow-hidden whitespace-nowrap ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`;

  return (
    <div className="relative h-full w-14 shrink-0">
      <div
        className={`absolute left-0 top-0 z-30 flex h-full flex-col overflow-hidden border-r border-slate-200 bg-white ${
          expanded ? "w-60 shadow-lg" : "w-14"
        }`}
        onMouseEnter={openSidebar}
        onMouseLeave={closeSidebar}
      >
        <div className="flex h-full w-60 flex-col">
          <div className="flex items-center gap-2 px-3 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            {APP_BADGE}
          </div>
          <div className={`min-w-0 ${labelClass(expanded)}`}>
            <div className="text-sm font-semibold leading-tight text-slate-900">{APP_NAME}</div>
            <div className="text-[11px] leading-tight text-slate-500">{APP_TAGLINE}</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          <div
            onMouseEnter={() => setCustomersOpen(true)}
            onMouseLeave={() => setCustomersOpen(false)}
          >
            <div
              title="Customers"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${customersHeaderClass}`}
            >
              <NavIcon d={CUSTOMERS_ICON} />
              <span className={`flex-1 text-left ${labelClass(expanded)}`}>Customers</span>
              <span className={labelClass(expanded)}>
                <Chevron open={customersOpen && expanded} />
              </span>
            </div>

            {customersOpen && expanded && (
              <div className="mt-1 space-y-0.5 pl-3">
                {CUSTOMER_NAV.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      title={item.label}
                      className={navLinkClass(active)}
                    >
                      <NavIcon d={item.icon} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700"
              title={DUMMY_USER.name}
            >
              {initials(DUMMY_USER.name)}
            </div>
            <div className={`min-w-0 flex-1 ${labelClass(expanded)}`}>
              <div className="truncate text-sm font-medium text-slate-800">{DUMMY_USER.name}</div>
              <div className="truncate text-[11px] text-slate-500">{DUMMY_USER.email}</div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 ${labelClass(expanded)}`}
            >
              Sign out
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
