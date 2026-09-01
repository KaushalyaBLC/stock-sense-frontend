"use client";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  useGetDigestStatusQuery,
  useSubscribeToDigestMutation,
  useUnsubscribeFromDigestMutation,
} from "@/lib/store/digest-api";
import { parseRtkError } from "@/lib/store/auth-api";

/** Email digest opt-in toggle. Reads initial state once on mount; subscribe/
 *  unsubscribe update local UI from the mutation's own response (no refetch). */
export function DigestToggle() {
  const { data, isLoading: statusLoading } = useGetDigestStatusQuery();
  const [subscribe, { isLoading: subscribing }] = useSubscribeToDigestMutation();
  const [unsubscribe, { isLoading: unsubscribing }] = useUnsubscribeFromDigestMutation();

  const subscribed = data?.subscribed ?? false;
  const busy = statusLoading || subscribing || unsubscribing;

  async function onToggle(next: boolean) {
    try {
      const res = next ? await subscribe().unwrap() : await unsubscribe().unwrap();
      toast.success(
        res.subscribed ? "You're subscribed to the email digest." : "Unsubscribed from the email digest.",
      );
    } catch (err) {
      const { message } = parseRtkError(err);
      toast.error(message);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[13.5px] font-medium">Email digest</div>
        <p className="mt-0.5 text-[12.5px] text-text-secondary">
          Get top signals and watchlist updates by email.
        </p>
      </div>
      <div className="flex items-center gap-2">
        {busy && <Loader2 className="size-3.5 animate-spin text-text-muted" />}
        <Switch
          checked={subscribed}
          disabled={busy}
          onCheckedChange={onToggle}
          aria-label="Toggle email digest subscription"
        />
      </div>
    </div>
  );
}
