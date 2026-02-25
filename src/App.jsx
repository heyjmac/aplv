import { useState, useMemo } from 'react';
import produtos from './content/produtos.json';
import Filters from './components/FiltersPink';
import ProductCard from './components/ProductCardPink';

const ATTRIBUTE_CHIPS = [
  { key: 'sem_leite', label: 'Sem leite' },
  { key: 'sem_ovos', label: 'Sem ovos' },
  { key: 'sem_carne', label: 'Sem carne' },
  { key: 'sem_gluten', label: 'Sem glúten' },
  { key: 'sem_origem_animal', label: 'Sem origem animal' },
];

const INITIAL_FILTERS = {
  search: '',
  empresa: '',
  categoria: '',
  sem_ovos: false,
  sem_carne: false,
  sem_gluten: false,
  sem_leite: true,
  sem_origem_animal: false,
};

export default function App() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const companies = useMemo(() => {
    const set = new Set(produtos.map(p => p.empresa?.nome).filter(Boolean));
    return [...set].sort();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(produtos.map(p => p.categoria).filter(Boolean));
    return [...set].sort();
  }, []);

  const filtered = useMemo(() => {
    return produtos.filter(p => {
      if (filters.search && !p?.nome.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.empresa && p.empresa?.nome !== filters.empresa) return false;
      if (filters.categoria && p.categoria !== filters.categoria) return false;
      if (filters.sem_ovos && p.atributos.contem_ovos !== false) return false;
      if (filters.sem_carne && p.atributos.contem_carne !== false) return false;
      if (filters.sem_gluten && p.atributos.contem_gluten !== false) return false;
      if (filters.sem_leite && p.atributos.leite_ou_derivados !== false) return false;
      if (filters.sem_origem_animal && p.atributos.origem_animal !== false) return false;
      return true;
    });
  }, [filters]);

  function handleChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  const hasActiveFilters =
    filters.search ||
    filters.empresa ||
    filters.categoria ||
    ATTRIBUTE_CHIPS.some(({ key }) => filters[key]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Brand */}
          <div className="leading-none shrink-0">
            <p style={{fontFamily: "'Unbounded', sans-serif", background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}} className="text-xl font-black leading-none tracking-tight">APLV</p>
          </div>

          {/* Search + count */}
          <div className="flex items-center gap-2 flex-1 justify-end max-w-xs">
            <div className="relative flex-1">
              <input
                type="text"
                value={filters.search}
                onChange={e => handleChange('search', e.target.value)}
                placeholder="Buscar produto…"
                className="w-full pl-3 pr-7 py-1.5 text-sm rounded-lg border border-slate-200 bg-slate-50 placeholder-slate-300 text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
              />
              {filters.search && (
                <button
                  onClick={() => handleChange('search', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs transition"
                >
                  ✕
                </button>
              )}
            </div>
            <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">{filtered.length}/{produtos.length}</span>
          </div>
        </div>

        {/* Category row — desktop */}
        <div className="hidden md:flex items-center gap-3 px-4 pb-2 border-t border-slate-100">
          <span className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-wider shrink-0">Categoria</span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleChange('categoria', '')}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
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
                onClick={() => handleChange('categoria', filters.categoria === cat ? '' : cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
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

        {/* Chips row — desktop */}
        <div className="hidden md:flex items-center gap-3 px-4 pb-2 border-t border-slate-100">
          <span className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-wider shrink-0">Atributos</span>
          <div className="flex items-center gap-2 flex-wrap">
            {ATTRIBUTE_CHIPS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleChange(key, !filters[key])}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                  filters[key]
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-500'
                }`}
              >
                {label}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="px-3 py-1 text-xs font-medium rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Mobile category row */}
        <div className="md:hidden flex items-center gap-2 px-4 pb-2 border-t border-slate-100 pt-2">
          <span className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-wider shrink-0">Cat.</span>
          <select
            value={filters.categoria}
            onChange={e => handleChange('categoria', e.target.value)}
            className="flex-1 px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none focus:border-indigo-400 transition"
          >
            <option value="">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Mobile chips row */}
        <div className="md:hidden flex items-center gap-2 px-4 pb-2 overflow-x-auto">
          {ATTRIBUTE_CHIPS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleChange(key, !filters[key])}
              className={`whitespace-nowrap px-3 py-1 text-xs font-medium rounded-full border transition-all shrink-0 ${
                filters[key]
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="md:flex md:items-start">
        {/* ── Sidebar ── */}
        <aside
          className="bg-white border-b border-slate-200 md:border-b-0 md:border-r md:sticky md:top-[11.5rem] md:h-[calc(100vh-11.5rem)] md:overflow-y-auto md:w-60 md:shrink-0 hidden md:block"
        >
          <Filters
            filters={filters}
            companies={companies}
            categories={categories}
            onChange={handleChange}
            onReset={() => setFilters(INITIAL_FILTERS)}
            total={produtos.length}
            filtered={filtered.length}
            onClose={() => {}}
          />
        </aside>

        {/* ── Product grid ── */}
        <main className="flex-1 p-5 pb-20">
          {filtered.length === 0 ? (
            <div className="text-center mt-20 text-slate-400 select-none">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(p => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-amber-200 shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
        <div className="px-5 py-2.5 flex items-center justify-center gap-2">
          <span className="text-amber-500 text-sm">⚠️</span>
          <p className="text-xs text-slate-500 leading-snug">
            <strong className="text-slate-700">Sempre confira o rótulo do produto</strong> antes de consumir — as informações podem estar desatualizadas e formulações mudam sem aviso.
          </p>
        </div>
      </footer>
    </div>
  );
}
