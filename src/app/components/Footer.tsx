import { Link } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-black/80 backdrop-blur-md text-gray-300 mt-20 py-10 px-8 md:px-20 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo and description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <h2 className="text-2xl font-extrabold text-orange-400 tracking-wide">
            🎬 Storage App
          </h2>
          <p className="max-w-xs text-sm text-gray-400">
            Securely store and access your videos, audios, images, and documents anytime, anywhere.
          </p>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-8">
          <FooterLink href="/videos" label="Videos" />
          <FooterLink href="/audios" label="Audios" />
          <FooterLink href="/pictures" label="Pictures" />
          <FooterLink href="/documents" label="Documents" />
          <FooterLink href="/others" label="Others" />
        </nav>
      </div>

      {/* Bottom copyright */}
      <div className="max-w-6xl mx-auto mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Storage App. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-gray-400 hover:text-orange-400 transition font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
    >
      {label}
    </Link>
  );
}

export default Footer;