import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              AI-driven, explained signals for CSE stocks.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-10 gap-y-3">
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Product
              </span>
              {site.nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="text-sm text-text-secondary transition-colors hover:text-foreground"
                >
                  {n.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Company
              </span>
              <a href="#" className="text-sm text-text-secondary transition-colors hover:text-foreground">
                About
              </a>
              <a href="#" className="text-sm text-text-secondary transition-colors hover:text-foreground">
                Contact
              </a>
              <a href="#" className="text-sm text-text-secondary transition-colors hover:text-foreground">
                Privacy
              </a>
            </div>
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-text-muted">
            {site.footer.disclaimer}
          </p>
          <p className="mt-2 text-xs text-text-muted">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
