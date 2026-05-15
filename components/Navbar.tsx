import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-slate-600 hover:text-slate-900 transition font-medium text-sm ${
      pathname === href ? 'text-slate-900 font-semibold' : ''
    }`;

  return (
    <nav className="border-b border-white/20 sticky top-0 z-50 bg-white/80 backdrop-blur-lg bg-opacity-70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-3">
            <div className="text-3xl">🛒</div>

            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900">
                Changuito IA
              </span>

              <span className="text-xs text-slate-500 font-medium">
                Precios Inteligentes
              </span>
            </div>
          </div>

          <div className="hidden md:flex gap-12">
            <Link href="/" className={linkClass('/')}>
  Inicio
</Link>

            <Link href="/#features" className="text-slate-600 hover:text-slate-900 transition font-medium text-sm">
              Características
            </Link>

            <Link href="/#stores" className="text-slate-600 hover:text-slate-900 transition font-medium text-sm">
              Supermercados
            </Link>

            <Link href="/dashboard" className={linkClass('/dashboard')}>
              Analytics
            </Link>

            <Link href="/#stats" className="text-slate-600 hover:text-slate-900 transition font-medium text-sm">
              Impacto
            </Link>
          </div>

          <Link
            href="/#products-search"
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition duration-300 ease-out"
          >
            Comenzar
          </Link>

        </div>
      </div>
    </nav>
  );
}
