import { useMemo } from 'react';

const SectionTitle = ({ children }) => (
  <span className="block text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-2">
    {children}
  </span>
);

export default function Filters({ filters, companies, categories, onChange, onReset, onClose, total, filtered }) {
  // Only show categories if provided (desktop sidebar)
  const showCategories = Array.isArray(categories) && categories.length > 0;
  const hasActive = filters.categoria || filters.empresa;

  return (
    <div className="p-4 flex flex-col">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-700 text-sm">
          Filtros
        </h2>
        {onReset && hasActive && (
            <button
              onClick={onReset}
              className="ml-2 text-xs font-medium text-indigo-500 hover:underline hover:text-indigo-700 bg-transparent border-0 p-0 cursor-pointer"
              style={{ boxShadow: 'none' }}
              type="button"
            >
              Limpar filtros
            </button>
          )}
      </div>
      {typeof total === 'number' && typeof filtered === 'number' && (
        <div className="text-xs text-slate-400">{filtered} de {total} produtos</div>
      )}
      {/* Marca */}
      <div className='mt-5'>
        <SectionTitle>Marca</SectionTitle>
        <div className="relative">
          <select
            className={`w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition appearance-none ${filters.empresa ? 'pr-8' : ''}`}
            value={filters.empresa}
            onChange={e => onChange('empresa', e.target.value)}
          >
            <option value="">Todas</option>
            {companies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400">
            {!filters.empresa && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
          {filters.empresa && (
            <button
              onClick={() => onChange('empresa', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center transition"
              title="Limpar filtro de marca"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      {/* Categories (desktop sidebar only) */}
      {showCategories && (
        <div className='mt-5'>
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
      
    </div>
  );
}
