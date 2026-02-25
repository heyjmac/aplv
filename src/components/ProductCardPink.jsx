const ATTR_ICONS = {
  contem_ovos: '🥚',
  contem_carne: '🥩',
  contem_gluten: '🌾',
  leite_ou_derivados: '🥛',
  origem_animal: '🐾',
};

function Pill({ ok, label }) {
  if (ok === null) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 leading-none border ${
      ok
        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
        : 'bg-red-50 text-red-500 border-red-100'
    }`}>
      {ok ? '✓' : '✗'} {label}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { nome, imagem, empresa, descricao, atributos, url } = product;

  // Only surface the attributes relevant to the user (sem = good, com = warning)
  const pills = [
    { key: 'leite_ou_derivados', label: 'leite', ok: atributos.leite_ou_derivados === false ? true : atributos.leite_ou_derivados === true ? false : null },
    { key: 'contem_ovos',        label: 'ovos',  ok: atributos.contem_ovos === false ? true : atributos.contem_ovos === true ? false : null },
    { key: 'contem_carne',       label: 'carne', ok: atributos.contem_carne === false ? true : atributos.contem_carne === true ? false : null },
    { key: 'contem_gluten',      label: 'glúten', ok: atributos.contem_gluten === false ? true : atributos.contem_gluten === true ? false : null },
  ];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col no-underline text-inherit hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative bg-slate-50 flex items-center justify-center p-4" style={{height: '200px'}}>
        <img
          src={imagem}
          alt={nome}
          loading="lazy"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-1.5 flex-1 border-t border-slate-100">
        {empresa?.nome && (
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest leading-none truncate">
            {empresa.nome}
          </p>
        )}
        <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mt-0.5">
          {nome}
        </h3>

        {/* Pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
          {pills.filter(p => p.ok !== null).map(p => (
            <Pill key={p.key} ok={p.ok} label={p.label} />
          ))}
        </div>
      </div>
    </a>
  );
}
