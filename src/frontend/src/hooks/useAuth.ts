import { useAppStore } from "@/store/useAppStore";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect } from "react";

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();
  const { setAuthenticated, reset } = useAppStore();

  const isAuthenticated = loginStatus === "success" && identity != null;
  const principal = identity?.getPrincipal();

  useEffect(() => {
    setAuthenticated(isAuthenticated, principal?.toText());
  }, [isAuthenticated, principal, setAuthenticated]);

  const logout = useCallback(async () => {
    await clear();
    reset();
  }, [clear, reset]);

  return {
    isAuthenticated,
    isLoading: loginStatus === "logging-in" || loginStatus === "initializing",
    loginStatus,
    principal,
    login,
    logout,
    identity,
  };
}
