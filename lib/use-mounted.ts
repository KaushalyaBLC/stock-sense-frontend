"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns true only after client mount - without setState-in-effect.
 * Server + first client render return false; subsequent renders return true.
 */
const subscribe = () => () => {};
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client
    () => false, // server
  );
}
