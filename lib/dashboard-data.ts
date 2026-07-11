/**
 * Mock dashboard data ported from the StockSense Claude Design (StockSense.dc.html).
 * Illustrative sample data only — not real prices, signals, or recommendations.
 * Replace with live `core` API data later.
 */

export type SignalKind =
  | "positive"
  | "strong-positive"
  | "negative"
  | "strong-negative"
  | "neutral";
export type Risk = "Low" | "Medium" | "High";

export type Company = {
  sym: string;
  name: string;
  sector: string;
  price: number;
  chg: number;
  sig: SignalKind;
  conf: number;
  risk: Risk;
  reason: string;
};

export const COMPANIES: Company[] = [
  { sym: "JKH", name: "John Keells Holdings PLC", sector: "Diversified Holdings", price: 184.5, chg: 1.2, sig: "positive", conf: 82, risk: "Medium", reason: "Tourism-related news may support leisure sector revenue." },
  { sym: "COMB", name: "Commercial Bank of Ceylon PLC", sector: "Banking", price: 102.75, chg: -0.8, sig: "negative", conf: 71, risk: "Medium", reason: "Banking sector faces margin pressure in current rate environment." },
  { sym: "HNB", name: "Hatton National Bank PLC", sector: "Banking", price: 188.0, chg: 0.3, sig: "neutral", conf: 60, risk: "Medium", reason: "Mixed credit growth signals, limited near-term catalyst." },
  { sym: "LOLC", name: "LOLC Holdings PLC", sector: "Diversified Holdings", price: 412.25, chg: -1.9, sig: "strong-negative", conf: 79, risk: "High", reason: "Interest rate concerns may pressure financing margins." },
  { sym: "SPEN", name: "Aitken Spence PLC", sector: "Tourism", price: 96.4, chg: 2.1, sig: "strong-positive", conf: 84, risk: "Medium", reason: "Rising tourist arrivals support hotels and travel segments." },
  { sym: "DIAL", name: "Dialog Axiata PLC", sector: "Telecommunication", price: 11.8, chg: 0.4, sig: "positive", conf: 68, risk: "Low", reason: "Steady subscriber growth and data demand underpin revenue." },
  { sym: "SAMP", name: "Sampath Bank PLC", sector: "Banking", price: 76.5, chg: 0.6, sig: "positive", conf: 67, risk: "Medium", reason: "Improving credit growth is a mild positive for lenders." },
  { sym: "DIST", name: "Distilleries Co. of Sri Lanka PLC", sector: "Food & Beverage", price: 23.9, chg: -0.5, sig: "negative", conf: 61, risk: "Medium", reason: "New import policy could raise input costs for consumer goods." },
  { sym: "HAYL", name: "Hayleys PLC", sector: "Diversified Holdings", price: 92.1, chg: -0.6, sig: "negative", conf: 64, risk: "Medium", reason: "Export demand softness may weigh on segment revenue." },
  { sym: "CTC", name: "Ceylon Tobacco Co. PLC", sector: "Manufacturing", price: 1180.0, chg: 0.1, sig: "neutral", conf: 58, risk: "Low", reason: "Stable demand, limited near-term news catalyst." },
];

export type NewsItem = {
  id: number;
  title: string;
  source: string;
  time: string;
  sector: string;
  sig: SignalKind;
  mag: "High" | "Medium" | "Low";
  conf: number;
  summary: string;
};

export const NEWS: NewsItem[] = [
  { id: 1, title: "Tourism arrivals increase in May", source: "Daily FT", time: "2 hours ago", sector: "Tourism", sig: "positive", mag: "High", conf: 82, summary: "Higher monthly arrivals may positively affect tourism and hotel-related companies." },
  { id: 2, title: "Central Bank keeps policy rates unchanged", source: "EconomyNext", time: "4 hours ago", sector: "Banking", sig: "neutral", mag: "Medium", conf: 60, summary: "Stable rates offer a neutral-to-mixed backdrop for the banking sector." },
  { id: 3, title: "Fuel price adjustment announced", source: "Daily Mirror", time: "6 hours ago", sector: "Energy", sig: "negative", mag: "Medium", conf: 66, summary: "Higher fuel costs may pressure transport and logistics-exposed sectors." },
  { id: 4, title: "Banking sector credit growth improves", source: "Daily FT", time: "8 hours ago", sector: "Banking", sig: "positive", mag: "Medium", conf: 70, summary: "Improving credit growth is a mild positive for lenders." },
  { id: 5, title: "New import policy affects consumer goods sector", source: "EconomyNext", time: "11 hours ago", sector: "Food & Beverage", sig: "negative", mag: "Medium", conf: 61, summary: "Policy change could raise input costs for import-reliant goods." },
];

export const WATCH_ALERTS = [
  { sym: "JKH", title: "JKH has a positive signal from tourism news", sig: "positive" as SignalKind, time: "2h ago" },
  { sym: "COMB", title: "COMB has a medium negative signal from banking news", sig: "negative" as SignalKind, time: "4h ago" },
];

export const BRIEF_BADGES = [
  "Mixed market mood",
  "8 news analyzed",
  "5 companies affected",
  "2 watchlist alerts",
];

// ── signal / risk presentation helpers (ported from the design) ───────────────

export function signalMeta(s: SignalKind) {
  const map: Record<SignalKind, { label: string; arrow: string; tone: "up" | "down" | "neutral" }> = {
    positive: { label: "Positive", arrow: "▲", tone: "up" },
    "strong-positive": { label: "Strong Positive", arrow: "▲▲", tone: "up" },
    negative: { label: "Negative", arrow: "▼", tone: "down" },
    "strong-negative": { label: "Strong Negative", arrow: "▼▼", tone: "down" },
    neutral: { label: "Neutral", arrow: "■", tone: "neutral" },
  };
  return map[s] ?? map.neutral;
}

export const symbolFull = (sym: string) => `${sym}.N0000`;
export const priceText = (p: number) => `Rs. ${p.toFixed(2)}`;
export const changeText = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

export const topPositive = () =>
  COMPANIES.filter((c) => c.sig.includes("positive")).sort((a, b) => b.conf - a.conf).slice(0, 3);
export const topNegative = () =>
  COMPANIES.filter((c) => c.sig.includes("negative")).sort((a, b) => b.conf - a.conf).slice(0, 2);
