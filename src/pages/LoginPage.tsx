import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { APP_NAME, APP_TAGLINE } from "@/constants/branding";
import { Loader } from "@/components/ui";
import { usePostApi } from "@/hooks/usePostApi";
import type { AppDispatch } from "@/store";
import { setUser, type SigninResponse } from "@/store/userSlice";

const generateCodeVerifier = (length = 128) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const values = crypto.getRandomValues(new Uint8Array(length));
  values.forEach((v) => (result += charset[v % charset.length]));
  return result;
};

const base64UrlEncode = (buffer: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
};

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      localStorage.setItem("code_verifier", codeVerifier);
      const authUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
          client_id: CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          response_type: "code",
          scope: "openid email profile",
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
          access_type: "offline",
          prompt: "consent",
        });

      window.location.href = authUrl;
    } catch (err) {
      console.error("Google login init failed:", err);
      setLoading(false);
    }
  };

  const { action, loading: loginLoading } = usePostApi<
    { code: string; codeVerifier: string },
    SigninResponse
  >({
    path: "/login/gsso/signin",
    onSuccess: (data) => {
      if (data?.data?.userprofile) {
        dispatch(setUser(data.data.userprofile));
        navigate("/", { replace: true });
        setLoading(false);
      } else {
        navigate("/login", { replace: true });
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google login error:", err);
      setLoading(false);
      navigate("/login", { replace: true });
    },
  });

  useLayoutEffect(() => {
    if (localStorage.getItem("code_verifier")) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        console.error("Google OAuth Error:", error);
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      const codeVerifier = localStorage.getItem("code_verifier");

      if (!code || !codeVerifier) {
        console.error("Missing code or code_verifier");
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }
      setLoading(true);
      action({ code, codeVerifier });
      localStorage.removeItem("code_verifier");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = loading || loginLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            FD
          </div>
          <h1 className="text-xl font-semibold text-slate-900">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-slate-500">{APP_TAGLINE}</p>
        </div>

        {isLoading ? (
          <Loader label="Signing in…" />
        ) : (
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        )}
      </div>
    </div>
  );
}
