"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" aria-label={site.name}>
          <Logo />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-text-secondary transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <a href="/login">Log in</a>
          </Button>
          <Button size="sm" className="hidden sm:inline-flex" asChild>
            <a href="/signup">{site.cta.primary}</a>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="grid size-9 place-items-center rounded-[6px] border border-border text-foreground md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-[18px]" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="px-4 pt-4">
                <Logo />
              </SheetTitle>
              <nav className="mt-4 flex flex-col px-2">
                {site.nav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a
                      href={item.href}
                      className="rounded-[6px] px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/login">Log in</a>
                </Button>
                <Button className="w-full" asChild>
                  <a href="/signup">{site.cta.primary}</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
