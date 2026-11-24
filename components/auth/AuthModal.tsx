"use client";

import React, { useState } from "react";
import { useFlips } from "@/components/providers/FlipsContext";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { Button } from "@/components/ui/Button";
import { loginUser, registerUser } from "@/lib/api";

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, setSession } = useFlips();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await loginUser(email, password);
        setSession(res.user, res.token, res.user.activeSubscription || null);
      } else {
        const res = await registerUser(name, email, password);
        setSession(res.user, res.token, null);
      }
      setAuthModalOpen(false);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach Flipss API. Make sure flips_api is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalDialog
      open={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      titleId="auth-modal-title"
      maxWidthClass="max-w-md"
    >
      <div className="p-7 sm:p-9 space-y-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-[#E50914] font-black text-white text-sm">
              F
            </span>
            <span className="text-lg font-black text-white">
              FLIPSS<span className="text-[#E50914]">.ID</span>
            </span>
          </div>
          <h1 id="auth-modal-title" className="text-2xl font-black text-white">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-xs text-neutral-400">
            {mode === "login"
              ? "Welcome back. Stream unlimited cinema in 4K HDR."
              : "Join Flipss.id and pick your streaming package."}
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/15 border border-red-500/40 px-3.5 py-2.5 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <label htmlFor="auth-name" className="text-xs font-medium text-neutral-300">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Budi Santoso"
                className="w-full rounded-lg bg-[#1e1e1e] border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#E50914] outline-none"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-xs font-medium text-neutral-300">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@flipss.id"
              className="w-full rounded-lg bg-[#1e1e1e] border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#E50914] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="text-xs font-medium text-neutral-300">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-[#1e1e1e] border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#E50914] outline-none"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Start Streaming"}
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-400">
          {mode === "login" ? (
            <>
              New to Flipss.id?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="text-white font-semibold hover:text-[#E50914] cursor-pointer"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="text-white font-semibold hover:text-[#E50914] cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}
