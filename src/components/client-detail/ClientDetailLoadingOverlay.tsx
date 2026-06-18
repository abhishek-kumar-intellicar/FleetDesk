import { Loader } from "@/components/ui";

type ClientDetailLoadingOverlayProps = {
  visible: boolean;
  updatingStatus: boolean;
};

export function ClientDetailLoadingOverlay({
  visible,
  updatingStatus,
}: ClientDetailLoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-20 flex min-h-[50vh] items-center justify-center bg-white/80"
      aria-busy="true"
    >
      <Loader
        label={updatingStatus ? "Updating status…" : "Loading client…"}
      />
    </div>
  );
}
