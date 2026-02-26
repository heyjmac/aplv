const ATTR_ICONS = {
  leite_ou_derivados: '🥛',
  contem_ovos: '🥚',
  contem_carne: '🥩',
  contem_gluten: '🌾',
};

function Pill({ type, label }) {
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
    icon = '⚠️';
  }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 leading-none border ${colorClass}`}>
      {icon} {label}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { nome, imagem, marca, descricao, atributos, url } = product;

  // Chips para leite
  let leiteType = null;
  if (atributos.leite_ou_derivados === false) leiteType = 'free';
  else if (atributos.leite_ou_derivados === true) leiteType = 'contains';
  let leiteTracosType = null;
  if (atributos.pode_conter_leite_ou_derivados === true) leiteTracosType = 'traces';
  else if (atributos.pode_conter_leite_ou_derivados === false) leiteTracosType = 'free';

  // Chips para ovos
  let ovosType = null;
  if (atributos.contem_ovos === false) ovosType = 'free';
  else if (atributos.contem_ovos === true) ovosType = 'contains';
  let ovosTracosType = null;
  if (atributos.pode_conter_ovos === true) ovosTracosType = 'traces';
  else if (atributos.pode_conter_ovos === false) ovosTracosType = 'free';

  // Chips para carne
  let carneType = null;
  if (atributos.contem_carne === false) carneType = 'free';
  else if (atributos.contem_carne === true) carneType = 'contains';
  let carneTracosType = null;
  if (atributos.pode_conter_carne === true) carneTracosType = 'traces';
  else if (atributos.pode_conter_carne === false) carneTracosType = 'free';

  // Chips para glúten
  let glutenType = null;
  if (atributos.contem_gluten === false) glutenType = 'free';
  else if (atributos.contem_gluten === true) glutenType = 'contains';
  let glutenTracosType = null;
  if (atributos.pode_conter_gluten === true) glutenTracosType = 'traces';
  else if (atributos.pode_conter_gluten === false) glutenTracosType = 'free';

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
          {leiteType && <Pill type={leiteType} label={"Leite"} />}
          {leiteTracosType === 'traces' && <Pill type="traces" label="Traços de leite" />}
          {/* Ovos */}
          {ovosType && <Pill type={ovosType} label={"Ovos"} />}
          {ovosTracosType === 'traces' && <Pill type="traces" label="Traços de ovos" />}
          {/* Carne */}
          {carneType && <Pill type={carneType} label={"Carne"} />}
          {carneTracosType === 'traces' && <Pill type="traces" label="Traços de carne" />}
          {/* Glúten */}
          {glutenType && <Pill type={glutenType} label={"Glúten"} />}
          {glutenTracosType === 'traces' && <Pill type="traces" label="Traços de glúten" />}
        </div>
      </div>
    </a>
  );
}
