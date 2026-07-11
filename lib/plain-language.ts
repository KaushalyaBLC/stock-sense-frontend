/**
 * Plain-language helpers so analyst terms read clearly for general users.
 * Keep the underlying data (confidence %, sentiment) — just add a human label.
 */
import type { SignalKind } from "@/lib/dashboard-data";

/** Confidence % → everyday certainty phrase. */
export function confidenceLabel(conf: number): string {
  if (conf >= 75) return "Very sure";
  if (conf >= 60) return "Fairly sure";
  if (conf >= 45) return "Somewhat sure";
  return "Low certainty";
}

/** Signal direction → a plain, non-advice phrase. */
export function signalPhrase(sig: SignalKind): string {
  switch (sig) {
    case "strong-positive":
      return "Strong positive outlook";
    case "positive":
      return "Mild positive outlook";
    case "strong-negative":
      return "Strong negative outlook";
    case "negative":
      return "Mild negative outlook";
    default:
      return "Neutral — little expected impact";
  }
}

/** Risk level → plain wording. */
export function riskLabel(risk: string): string {
  switch (risk) {
    case "High":
      return "Higher risk";
    case "Medium":
      return "Moderate risk";
    default:
      return "Lower risk";
  }
}

/** One-line "what this means" for a company signal, in plain English. */
export function plainMeaning({
  company,
  sig,
  confidence,
}: {
  company: string;
  sig: SignalKind;
  confidence: number;
}): string {
  const dir = sig.includes("positive")
    ? "could move up"
    : sig.includes("negative")
      ? "could move down"
      : "may see little change";
  return `Our AI sees signs that ${company} ${dir} in the near term — and is ${confidenceLabel(
    confidence,
  ).toLowerCase()} (${confidence}%).`;
}
