"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useLogoutMutation } from "@/lib/store/auth-api";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearUser } from "@/lib/store/auth-slice";

export function LogoutButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  async function onLogout() {
    try {
      await logout().unwrap();
    } catch {
      // even if the request fails, clear local state and leave
    }
    dispatch(clearUser());
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={isLoading}
      className="flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-60"
    >
      <LogOut className="size-4" />
      {isLoading ? "Signing out…" : "Sign out"}
    </button>
  );
}
