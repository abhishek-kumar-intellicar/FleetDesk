import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { APP_BADGE, APP_NAME, APP_TAGLINE } from "@/lib/branding";
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

const HOVER_LEAVE_DELAY_MS = 250;

function NavIcon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
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

  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [customersHovered, setCustomersHovered] = useState(false);
  const sidebarLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const customersLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const expanded = sidebarHovered;
  const showCustomerSubs = customersHovered;

  useEffect(() => {
    return () => {
      if (sidebarLeaveTimerRef.current) clearTimeout(sidebarLeaveTimerRef.current);
      if (customersLeaveTimerRef.current) clearTimeout(customersLeaveTimerRef.current);
    };
  }, []);

  const handleSidebarEnter = () => {
    if (sidebarLeaveTimerRef.current) {
      clearTimeout(sidebarLeaveTimerRef.current);
      sidebarLeaveTimerRef.current = null;
    }
    setSidebarHovered(true);
  };

  const handleSidebarLeave = () => {
    sidebarLeaveTimerRef.current = setTimeout(() => {
      setSidebarHovered(false);
      setCustomersHovered(false);
      sidebarLeaveTimerRef.current = null;
    }, HOVER_LEAVE_DELAY_MS);
  };

  const handleCustomersEnter = () => {
    if (customersLeaveTimerRef.current) {
      clearTimeout(customersLeaveTimerRef.current);
      customersLeaveTimerRef.current = null;
    }
    setCustomersHovered(true);
  };

  const handleCustomersLeave = () => {
    customersLeaveTimerRef.current = setTimeout(() => {
      setCustomersHovered(false);
      customersLeaveTimerRef.current = null;
    }, HOVER_LEAVE_DELAY_MS);
  };

  const navLinkClass = (active: boolean, collapsed: boolean) =>
    `flex items-center rounded-lg text-sm font-medium transition ${
      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
    } ${
      active
        ? "bg-brand-50 text-brand-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div
      className="relative h-full shrink-0 self-stretch"
      onMouseEnter={handleSidebarEnter}
      onMouseLeave={handleSidebarLeave}
    >
      <aside
        className={`flex h-full min-h-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ease-in-out ${
          expanded ? "w-60" : "w-14"
        }`}
      >
        <div
          className={`flex items-center py-4 ${expanded ? "gap-2 px-5" : "justify-center px-2"}`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            {APP_BADGE}
          </div>
          {expanded && (
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight text-slate-900">{APP_NAME}</div>
              <div className="text-[11px] leading-tight text-slate-500">{APP_TAGLINE}</div>
            </div>
          )}
        </div>

        <nav className={`flex-1 space-y-1 py-2 ${expanded ? "px-3" : "px-2"}`}>
          <div
            onMouseEnter={handleCustomersEnter}
            onMouseLeave={handleCustomersLeave}
          >
            <div
              title="Customers"
              className={`flex items-center rounded-lg text-sm font-semibold transition ${
                expanded ? "gap-3 px-3 py-2" : "justify-center p-2.5"
              } ${
                inCustomers
                  ? "text-brand-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <NavIcon d={CUSTOMERS_ICON} />
              {expanded && (
                <>
                  <span className="flex-1 text-left">Customers</span>
                  <Chevron open={showCustomerSubs} />
                </>
              )}
            </div>

            {showCustomerSubs && (
              <div
                className={`space-y-0.5 transition-all duration-200 ${
                  expanded ? "mt-1 pl-3" : "mt-1"
                }`}
              >
                {CUSTOMER_NAV.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      title={item.label}
                      className={navLinkClass(active, !expanded)}
                    >
                      <NavIcon d={item.icon} />
                      {expanded && item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className={`border-t border-slate-200 ${expanded ? "p-4" : "flex justify-center p-2"}`}>
          <div className={`flex items-center ${expanded ? "gap-3" : ""}`}>
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700"
              title={DUMMY_USER.name}
            >
              {initials(DUMMY_USER.name)}
            </div>
            {expanded && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-slate-800">{DUMMY_USER.name}</div>
                <div className="truncate text-[11px] text-slate-500">{DUMMY_USER.email}</div>
              </div>
            )}
            {expanded && (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
