'use client';

import { Search } from 'lucide-react';

interface EmptyStateProps {
  query: string;
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600 shadow-sm">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-700">
        <Search className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-semibold text-slate-900">No hay resultados</h3>
      <p className="mt-3 max-w-xl mx-auto text-sm leading-7 text-slate-500">
        No encontramos coincidencias para <span className="font-semibold text-slate-800">{query}</span>. Intenta otra búsqueda, ajusta filtros o revisa tus términos.
      </p>
    </div>
  );
}
