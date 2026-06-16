import { Link } from "react-router-dom";
import { customers } from "@/lib/routes";

export default function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="text-5xl font-bold text-slate-300">404</div>
      <p className="text-slate-600">We couldn&apos;t find what you were looking for.</p>
      <Link to={customers.dashboard} className="btn-primary mt-2">
        Back to dashboard
      </Link>
    </div>
  );
}
