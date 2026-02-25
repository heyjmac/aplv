const ATTRIBUTE_FILTERS = [
  { key: 'sem_ovos', label: 'Sem ovos' },
  { key: 'sem_carne', label: 'Sem carne' },
  { key: 'sem_gluten', label: 'Sem glúten' },
  { key: 'sem_leite', label: 'Sem leite/derivados' },
  { key: 'sem_origem_animal', label: 'Sem origem animal' },
];

export default function Filters({ filters, companies, onChange, onReset, total, filtered }) {
  const hasActiveFilters =
    filters.search ||
    filters.empresa ||
    ATTRIBUTE_FILTERS.some(({ key }) => filters[key]);

  return (
    <aside className="filters">
      <div className="filters-header">
        <h2>Filtros</h2>
        {hasActiveFilters && (
          <button className="btn-reset" onClick={onReset}>
            Limpar
          </button>
        )}
      </div>

      <p className="filters-count">
        {filtered} de {total} produtos
      </p>

      <section className="filter-section">
        <label className="filter-label" htmlFor="search">Busca</label>
        <input
          id="search"
          type="text"
          className="filter-input"
          placeholder="Nome do produto..."
          value={filters.search}
          onChange={e => onChange('search', e.target.value)}
        />
      </section>

      <section className="filter-section">
        <label className="filter-label" htmlFor="empresa">Empresa</label>
        <select
          id="empresa"
          className="filter-select"
          value={filters.empresa}
          onChange={e => onChange('empresa', e.target.value)}
        >
          <option value="">Todas</option>
          {companies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </section>

      <section className="filter-section">
        <span className="filter-label">Atributos</span>
        <div className="filter-checks">
          {ATTRIBUTE_FILTERS.map(({ key, label }) => (
            <label key={key} className="check-label">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={e => onChange(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}
