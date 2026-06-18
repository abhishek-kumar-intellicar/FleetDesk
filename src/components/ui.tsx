import { cloneElement, isValidElement } from "react";
import { STAGE_LABELS } from "@/constants/deals";
import { DEVICE_LABELS } from "@/constants/devices";

export function FormField({
  label,
  name,
  error,
  touched,
  className,
  children,
}: {
  label: React.ReactNode;
  name: string;
  error?: string;
  touched?: boolean;
  className?: string;
  children: React.ReactElement<{
    id?: string;
    name?: string;
    className?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }>;
}) {
  const hasError = Boolean(error && touched);

  return (
    <div className={className}>
      <label htmlFor={name} className={hasError ? "label label-error" : "label"}>
        {label}
      </label>
      {isValidElement(children)
        ? cloneElement(children, {
            id: name,
            name,
            className: hasError ? "input input-error" : "input",
            "aria-invalid": hasError,
            "aria-describedby": hasError ? `${name}-error` : undefined,
          })
        : children}
      {hasError && (
        <p id={`${name}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  lead: "bg-amber-50 text-amber-700 ring-amber-600/20",
  churned: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700 ring-slate-600/20";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${style}`}>
      {status}
    </span>
  );
}

const TIER_STYLES: Record<string, string> = {
  enterprise: "bg-brand-50 text-brand-700 ring-brand-600/20",
  premium: "bg-violet-50 text-violet-700 ring-violet-600/20",
  standard: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export function TierBadge({ tier }: { tier: string }) {
  const style = TIER_STYLES[tier] ?? TIER_STYLES.standard;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${style}`}>
      {tier}
    </span>
  );
}

const STAGE_STYLES: Record<string, string> = {
  prospect: "bg-slate-100 text-slate-600",
  qualified: "bg-sky-100 text-sky-700",
  proposal: "bg-indigo-100 text-indigo-700",
  negotiation: "bg-amber-100 text-amber-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-rose-100 text-rose-700",
};

export function StageBadge({ stage }: { stage: string }) {
  const style = STAGE_STYLES[stage] ?? STAGE_STYLES.prospect;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {STAGE_LABELS[stage] ?? stage}
    </span>
  );
}

const DEVICE_STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500",
  inactive: "bg-slate-400",
  faulty: "bg-rose-500",
};

export function DeviceStatusDot({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs capitalize text-slate-600">
      <span className={`h-2 w-2 rounded-full ${DEVICE_STATUS_STYLES[status] ?? "bg-slate-400"}`} />
      {status}
    </span>
  );
}

export function DeviceTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
      {DEVICE_LABELS[type] ?? type}
    </span>
  );
}

export function Loader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600"
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );
}
