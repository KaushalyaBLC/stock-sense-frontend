"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import { setUser } from "@/lib/store/auth-slice";
import type { PublicUser } from "@/lib/api";

/**
 * App-wide Redux provider. The store is created once via a lazy useState
 * initializer. An optional `initialUser` (read server-side from the session
 * cookie) seeds the auth slice so the UI knows who's logged in on first paint.
 */
export function Providers({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: PublicUser | null;
}) {
  const [store] = useState(() => {
    const s = makeStore();
    if (initialUser) s.dispatch(setUser(initialUser));
    return s;
  });

  return <Provider store={store}>{children}</Provider>;
}
