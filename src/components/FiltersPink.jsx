import { useMemo } from 'react';

const SectionTitle = ({ children }) => (
  <span className="block text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-2">
    {children}
  </span>
);

export default function Filters({ filters, companies, categories, onChange, onReset, onClose, total, filtered }) {
  // Only show categories if provided (desktop sidebar)
  const showCategories = Array.isArray(categories) && categories.length > 0;

  return (
    <div className="p-4 flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-700 text-sm">Filtros</h2>
        <button
          onClick={onClose}
          className="md:hidden text-slate-400 hover:text-slate-600 text-base leading-none transition"
          aria-label="Fechar filtros"
        >
          ✕
        </button>
      </div>

      {/* Categories (desktop sidebar only) */}
      {showCategories && (
        <div>
          <SectionTitle>Categoria</SectionTitle>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onChange('categoria', '')}
              className={`text-left px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                !filters.categoria
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-500'
              }`}
            >
              Todas
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => onChange('categoria', filters.categoria === cat ? '' : cat)}
                className={`text-left px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                  filters.categoria === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Company */}
      <div>
        <SectionTitle>Empresa</SectionTitle>
        <select
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
          value={filters.empresa}
          onChange={e => onChange('empresa', e.target.value)}
        >
          <option value="">Todas</option>
          {companies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Reset button (if any filter active) */}
      {onReset && (filters.categoria || filters.empresa) && (
        <button
          onClick={onReset}
          className="mt-2 px-3 py-1 text-xs font-medium rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition"
        >
          Limpar filtros
        </button>
      )}

      {/* Count (optional) */}
      {typeof total === 'number' && typeof filtered === 'number' && (
        <div className="text-xs text-slate-400 mt-2">{filtered} de {total} produtos</div>
      )}
    </div>
  );
}
