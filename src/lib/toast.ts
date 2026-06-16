import toast from "react-hot-toast";

const defaultOptions = {
  duration: 4000,
  style: {
    fontSize: "14px",
    borderRadius: "10px",
    padding: "12px 16px",
  },
} as const;

export function successToast(message: string) {
  toast.success(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#ecfdf5",
      color: "#065f46",
      border: "1px solid #a7f3d0",
    },
  });
}

export function errorToast(message: string) {
  toast.error(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#fff1f2",
      color: "#9f1239",
      border: "1px solid #fecdd3",
    },
  });
}
