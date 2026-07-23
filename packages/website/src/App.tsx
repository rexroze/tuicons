import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Icons from "./pages/Icons";
import IconDetail from "./pages/IconDetail";

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-bg text-body font-sans">
        {/* ---- Shared header ---- */}
        <header className="border-b border-edge bg-bg/90 backdrop-blur-md sticky top-0 z-40">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
            <a href="/#/" className="flex shrink-0 items-center gap-2 select-none">
              <span className="font-mono text-lg font-bold tracking-tight text-accent">&gt;_</span>
              <span className="hidden font-sans text-sm font-semibold text-body sm:inline">TUIcons</span>
            </a>
            <nav className="hidden items-center gap-1 sm:flex">
              <a href="/#/" className="rounded-md px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-body">Home</a>
              <a href="/#/icons" className="rounded-md px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-body">Icons</a>
            </nav>
            <div className="flex-1" />
            <a href="https://github.com/rexroze/tuicons" target="_blank" rel="noopener noreferrer" className="hidden text-xs text-muted transition-colors hover:text-body sm:inline">GitHub</a>
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 font-mono text-[10px] font-medium text-accent">v0.1.0</span>
          </div>
        </header>

        {/* ---- Routes ---- */}
        <Routes>
          <Route index element={<Home />} />
          <Route path="icons" element={<Icons />} />
          <Route path="icons/:name" element={<IconDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* ---- Shared footer ---- */}
        <Footer />
      </div>
    </HashRouter>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <span className="font-mono text-6xl text-muted/40">404</span>
      <p className="mt-4 text-sm text-muted">Page not found.</p>
      <a href="/#/" className="mt-4 text-sm text-accent transition-colors hover:text-accent/80">Go home</a>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <p className="text-xs text-muted">TUIcons<span className="text-muted/40"> · </span>v0.1.0</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/rexroze/tuicons" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-body">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@tuicons/core" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-body">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.838h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" /></svg>
            npm
          </a>
        </div>
      </div>
    </footer>
  );
}
