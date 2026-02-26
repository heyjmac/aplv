const ATTR_ICONS = {
  leite_ou_derivados: '🥛',
  contem_ovos: '🥚',
  contem_carne: '🥩',
  contem_gluten: '🌾',
};

function Pill({ type, label, tooltip }) {
  // type: 'free' | 'contains' | 'traces'
  let colorClass = '';
  let icon = '';
  if (type === 'free') {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
    icon = '✗'; // invertido: verde com X
  } else if (type === 'contains') {
    colorClass = 'bg-red-50 text-red-500 border-red-100';
    icon = '✓'; // invertido: vermelho com V
  } else if (type === 'traces') {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-100';
    icon = '?';
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 leading-none border ${colorClass}`}
      title={tooltip}
      style={{ cursor: 'help' }}
    >
      {icon} {label}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { nome, imagem, marca, descricao, atributos, url } = product;

  // Chips para leite
  let leiteType = null, leiteTooltip = '';
  if (atributos.leite_ou_derivados === false) { leiteType = 'free'; leiteTooltip = 'Sem leite'; }
  else if (atributos.leite_ou_derivados === true) { leiteType = 'contains'; leiteTooltip = 'Contém leite'; }
  let leiteTracosType = null, leiteTracosTooltip = '';
  if (atributos.pode_conter_leite_ou_derivados === true) { leiteTracosType = 'traces'; leiteTracosTooltip = 'Pode conter leite'; }
  else if (atributos.pode_conter_leite_ou_derivados === false) { leiteTracosType = 'free'; leiteTracosTooltip = 'Sem traços de leite'; }

  // Chips para ovos
  let ovosType = null, ovosTooltip = '';
  if (atributos.contem_ovos === false) { ovosType = 'free'; ovosTooltip = 'Sem ovos'; }
  else if (atributos.contem_ovos === true) { ovosType = 'contains'; ovosTooltip = 'Contém ovos'; }
  let ovosTracosType = null, ovosTracosTooltip = '';
  if (atributos.pode_conter_ovos === true) { ovosTracosType = 'traces'; ovosTracosTooltip = 'Pode conter ovos'; }
  else if (atributos.pode_conter_ovos === false) { ovosTracosType = 'free'; ovosTracosTooltip = 'Sem traços de ovos'; }

  // Chips para carne
  let carneType = null, carneTooltip = '';
  if (atributos.contem_carne === false) { carneType = 'free'; carneTooltip = 'Sem carne'; }
  else if (atributos.contem_carne === true) { carneType = 'contains'; carneTooltip = 'Contém carne'; }
  let carneTracosType = null, carneTracosTooltip = '';
  if (atributos.pode_conter_carne === true) { carneTracosType = 'traces'; carneTracosTooltip = 'Pode conter carne'; }
  else if (atributos.pode_conter_carne === false) { carneTracosType = 'free'; carneTracosTooltip = 'Sem traços de carne'; }

  // Chips para glúten
  let glutenType = null, glutenTooltip = '';
  if (atributos.contem_gluten === false) { glutenType = 'free'; glutenTooltip = 'Sem glúten'; }
  else if (atributos.contem_gluten === true) { glutenType = 'contains'; glutenTooltip = 'Contém glúten'; }
  let glutenTracosType = null, glutenTracosTooltip = '';
  if (atributos.pode_conter_gluten === true) { glutenTracosType = 'traces'; glutenTracosTooltip = 'Pode conter glúten'; }
  else if (atributos.pode_conter_gluten === false) { glutenTracosType = 'free'; glutenTracosTooltip = 'Sem traços de glúten'; }

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
        {marca && (
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest leading-none truncate">
            {marca}
          </p>
        )}
        <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mt-0.5">
          {nome}
        </h3>

        {/* Pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
          {/* Leite */}
          {leiteTracosType === 'traces'
            ? <Pill type="traces" label={"Leite"} tooltip={leiteTracosTooltip} />
            : leiteType && <Pill type={leiteType} label={"Leite"} tooltip={leiteTooltip} />}
          {/* Ovos */}
          {ovosTracosType === 'traces'
            ? <Pill type="traces" label={"Ovos"} tooltip={ovosTracosTooltip} />
            : ovosType && <Pill type={ovosType} label={"Ovos"} tooltip={ovosTooltip} />}
          {/* Carne */}
          {carneTracosType === 'traces'
            ? <Pill type="traces" label={"Carne"} tooltip={carneTracosTooltip} />
            : carneType && <Pill type={carneType} label={"Carne"} tooltip={carneTooltip} />}
          {/* Glúten */}
          {glutenTracosType === 'traces'
            ? <Pill type="traces" label={"Glúten"} tooltip={glutenTracosTooltip} />
            : glutenType && <Pill type={glutenType} label={"Glúten"} tooltip={glutenTooltip} />}
        </div>
      </div>
    </a>
  );
}
