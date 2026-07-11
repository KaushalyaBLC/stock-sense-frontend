/**
 * Centralized landing-page copy & config. Edit content here, not in components.
 * Rule: always "CSE", never spell out the exchange name. No accuracy numbers.
 */

export const site = {
  name: "StockSense",
  nav: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: { primary: "Get started", secondary: "See how it works" },
  hero: {
    eyebrow: "CSE · AI SIGNALS",
    title: "Understand what every CSE headline means for your stocks.",
    subtitle:
      "StockSense reads the market's news as it breaks and turns it into clear, explained direction signals for CSE stocks.",
  },
  how: [
    {
      step: "01",
      title: "We watch the news",
      body: "Every CSE story is captured the moment it breaks - no manual tracking, no missed announcements.",
    },
    {
      step: "02",
      title: "AI reads the impact",
      body: "A chain of specialist models works out which listed companies a story affects, the sentiment, and the risk.",
    },
    {
      step: "03",
      title: "You get a clear signal",
      body: "A direction call with a confidence level - and the full reasoning behind it, never a black box.",
    },
  ],
  features: [
    {
      title: "News-driven signals",
      body: "Signals triggered by real events as they happen, not lagging chart patterns.",
      icon: "newspaper",
    },
    {
      title: "Company impact analysis",
      body: "See exactly which CSE companies a story moves, and the mechanism behind it.",
      icon: "target",
    },
    {
      title: "Direction + confidence",
      body: "A clear up or down call, paired with how confident the model is.",
      icon: "compass",
    },
    {
      title: "Macro context",
      body: "Every signal is weighed against the broader market regime and mood.",
      icon: "globe",
    },
    {
      title: "Live CSE prices",
      body: "Daily prices for the companies we track, kept current through market hours.",
      icon: "activity",
    },
    {
      title: "Transparent reasoning",
      body: "A step-by-step decision trail for every signal - see why, not just what.",
      icon: "route",
    },
  ],
  why: [
    {
      title: "Built for the CSE",
      body: "Focused on the local market, not a global tool retrofitted to Sri Lanka.",
    },
    {
      title: "Plain language",
      body: "Sophisticated analysis, explained simply - no jargon required.",
    },
    {
      title: "Saves you hours",
      body: "We surface what matters so you don't read every announcement yourself.",
    },
    {
      title: "Honest by design",
      body: "Direction and confidence - never fake price targets or guarantees.",
    },
  ],
  faq: [
    {
      q: "Is StockSense financial advice?",
      a: "No. StockSense is a decision-support tool that surfaces and explains news-driven signals. It is for informational purposes only - always do your own research before investing.",
    },
    {
      q: "Which stocks does it cover?",
      a: "We focus on major CSE-listed companies, with a knowledge base spanning the most actively traded names across key sectors. Coverage expands over time.",
    },
    {
      q: "How often is it updated?",
      a: "News is monitored continuously and refreshed hourly, with prices kept current through CSE market hours - so signals reflect the latest events.",
    },
    {
      q: "What does a signal actually tell me?",
      a: "Each signal gives a direction (up or down) for the affected company, a confidence level, and a transparent decision trail explaining the sentiment, magnitude, risk, and macro context behind it.",
    },
    {
      q: "Is my account secure?",
      a: "Accounts use industry-standard authentication, and your data is handled over encrypted connections. You stay in control of your account at all times.",
    },
  ],
  footer: {
    disclaimer:
      "StockSense is not financial advice. All signals and analysis are for informational purposes only.",
  },
} as const;
