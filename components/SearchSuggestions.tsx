'use client';

import { ArrowRight, Clock3 } from 'lucide-react';
import { SuggestionSection } from '@/types/search';

interface SearchSuggestionsProps {
  query: string;
  recent: string[];
  popular: string[];
  sections: SuggestionSection[];
  onSelect: (value: string) => void;
  onClearHistory: () => void;
}

export default function SearchSuggestions({
  query,
  recent,
  popular,
  sections,
  onSelect,
  onClearHistory,
}: SearchSuggestionsProps) {
  const hasQuery = query.trim().length > 0;

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-900/5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Búsqueda Inteligente</p>
          <h3 className="text-lg font-semibold text-slate-900">Sugerencias y resultados rápidos</h3>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs uppercase font-semibold text-slate-500 hover:text-slate-700 transition"
        >
          Limpiar historial
        </button>
      </div>

      {hasQuery ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{section.title}</p>
              <div className="grid gap-2">
                {section.items.length > 0 ? (
                  section.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSelect(item)}
                      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition"
                    >
                      <span>{item}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No se encontraron sugerencias.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Búsquedas populares</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popular.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-semibold text-slate-900">Historial reciente</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {recent.length > 0 ? (
                recent.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onSelect(item)}
                    className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p className="text-sm text-slate-500">Aún no hay búsquedas recientes.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
