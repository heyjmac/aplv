const SectionTitle = ({ children }) => (
  <span className="block text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-2">
    {children}
  </span>
);

export default function Filters({ filters, companies, onChange, onClose }) {
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
    </div>
  );
}
