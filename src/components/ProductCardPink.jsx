import { useEffect, useMemo, useState } from 'react';

const ATTR_ICONS = {
  leite_ou_derivados: '🥛',
  contem_ovos: '🥚',
  contem_carne: '🥩',
  contem_gluten: '🌾',
  contem_soja: '🫘',
  contem_amendoim: '🥜',
  contem_castanhas: '🌰',
  contem_peixe: '🐟',
  contem_crustaceos: '🦐',
  origem_animal: '🐾',
};

const ORIGIN_FLAGS = {
  Brasil: '🇧🇷',
  Italy: '🇮🇹',
  Itália: '🇮🇹',
  Colombia: '🇨🇴',
  Colômbia: '🇨🇴',
  // Adicione mais conforme necessário
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

function ValueBadge({ type, children }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border';
  const map = {
    free: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    contains: 'bg-red-50 text-red-600 border-red-100',
    traces: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  return <span className={`${base} ${map[type] || ''}`}>{children}</span>;
}

function AttributeRow({ icon, name, value, type }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm py-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="font-medium text-slate-700 truncate">{name}</span>
      </div>
      <ValueBadge type={type}>{value}</ValueBadge>
    </div>
  );
}

function Modal({ product, open, onClose }) {
  if (!open) return null;
  const { nome, imagem, marca, categoria, descricao, url, origem, ingredientes, descricao_ingredientes, alergicos, atributos } = product;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const unknown = useMemo(() => {
    const alergens = !!alergicos;
    const ingreds = !!(descricao_ingredientes || ingredientes);
    return !alergens && !ingreds;
  }, [alergicos, descricao_ingredientes, ingredientes]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity ${mounted ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden transform transition-all duration-200 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'} max-h-[90vh]`}
        role="dialog" aria-modal="true" aria-labelledby="product-title" onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition" aria-label="Fechar">✕</button>

        <div className="flex flex-col">
          {/* Content panel (left on desktop) */}
          <div className="p-6 overflow-y-auto max-h-[70vh] pr-2">
             <div className='flex flex-col md:flex-row'>
              <div>
                <h2 id="product-title" className="text-lg font-bold text-slate-900 leading-snug mb-1">{nome}</h2>
                <div className="flex items-center gap-2 mb-2">
                  {origem && origem.map((o, i) => (
                    <span key={i} title={o} className="text-2xl leading-none">{ORIGIN_FLAGS[o] || '🏳️'}</span>
                  ))}
                  {categoria && <span className="text-xs text-slate-500">{categoria}</span>}
                </div>
                {marca && <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">{marca}</div>}
                {descricao && <div className="mb-3 text-sm text-slate-700 whitespace-pre-line">{descricao}</div>}
                <div className="mb-4 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs text-slate-600">
                  <div className="font-medium text-slate-700">Ingredientes:</div>
                  <div>{(descricao_ingredientes || ingredientes || '').trim() ? (descricao_ingredientes || ingredientes) : 'Não informado'}</div>
                  <div className="font-medium text-slate-700 mt-1">Alérgicos:</div>
                  <div>{(alergicos || '').trim() ? alergicos : 'Não informado'}</div>
                </div>
              </div>
              <div>
                <img src={imagem} alt={nome} className="w-full min-w-[240px] h-48 md:h-60 object-contain rounded-xl shadow-sm" />
              </div>
            </div>

            <div>
              <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Atributos</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <AttributeRow icon={ATTR_ICONS.leite_ou_derivados} name="Contém leite" value={atributos.leite_ou_derivados ? 'Sim' : 'Não'} type={atributos.leite_ou_derivados ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.leite_ou_derivados} name="Pode conter leite" value={unknown || atributos.pode_conter_leite_ou_derivados ? 'Sim' : 'Não'} type={atributos.pode_conter_leite_ou_derivados ? 'traces' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_ovos} name="Contém ovos" value={atributos.contem_ovos ? 'Sim' : 'Não'} type={atributos.contem_ovos ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_ovos} name="Pode conter ovos" value={unknown ||atributos.pode_conter_ovos ? 'Sim' : 'Não'} type={atributos.pode_conter_ovos ? 'traces' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_carne} name="Contém carne" value={atributos.contem_carne ? 'Sim' : 'Não'} type={atributos.contem_carne ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_carne} name="Pode conter carne" value={unknown || atributos.pode_conter_carne ? 'Sim' : 'Não'} type={atributos.pode_conter_carne ? 'traces' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_gluten} name="Contém glúten" value={atributos.contem_gluten ? 'Sim' : 'Não'} type={atributos.contem_gluten ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_gluten} name="Pode conter glúten" value={unknown || atributos.pode_conter_gluten ? 'Sim' : 'Não'} type={atributos.pode_conter_gluten ? 'traces' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_soja} name="Contém soja" value={atributos.contem_soja ? 'Sim' : 'Não'} type={atributos.contem_soja ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_soja} name="Pode conter soja" value={unknown || atributos.pode_conter_soja ? 'Sim' : 'Não'} type={atributos.pode_conter_soja ? 'traces' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_amendoim} name="Contém amendoim" value={atributos.contem_amendoim ? 'Sim' : 'Não'} type={atributos.contem_amendoim ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_amendoim} name="Pode conter amendoim" value={unknown || atributos.pode_conter_amendoim ? 'Sim' : 'Não'} type={atributos.pode_conter_amendoim ? 'traces' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_castanhas} name="Contém castanhas" value={atributos.contem_castanhas ? 'Sim' : 'Não'} type={atributos.contem_castanhas ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_castanhas} name="Pode conter castanhas" value={unknown || atributos.pode_conter_castanhas ? 'Sim' : 'Não'} type={atributos.pode_conter_castanhas ? 'traces' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_peixe} name="Contém peixe" value={atributos.contem_peixe ? 'Sim' : 'Não'} type={atributos.contem_peixe ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_peixe} name="Pode conter peixe" value={unknown || atributos.pode_conter_peixe ? 'Sim' : 'Não'} type={atributos.pode_conter_peixe ? 'traces' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_crustaceos} name="Contém crustáceos" value={atributos.contem_crustaceos ? 'Sim' : 'Não'} type={atributos.contem_crustaceos ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.contem_crustaceos} name="Pode conter crustáceos" value={unknown || atributos.pode_conter_crustaceos ? 'Sim' : 'Não'} type={atributos.pode_conter_crustaceos ? 'traces' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.origem_animal} name="Origem animal" value={atributos.origem_animal ? 'Sim' : 'Não'} type={atributos.origem_animal ? 'contains' : 'free'} />
                <AttributeRow icon={ATTR_ICONS.origem_animal} name="Pode conter origem animal" value={unknown || atributos.pode_conter_origem_animal ? 'Sim' : 'Não'} type={atributos.pode_conter_origem_animal ? 'traces' : 'free'} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5 sticky bottom-0 pt-3 bg-white">
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
                <img src="https://www.santaluzia.com.br/favicon.ico" alt="Santa Luzia" className="w-5 h-5" />
                Ver no Santa Luzia
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { nome, imagem, marca, descricao, url, origem, atributos } = product;

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
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col no-underline text-inherit hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-0.5 transition-all duration-200 w-full text-left"
        style={{ cursor: 'pointer' }}
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
          <div className="flex items-center gap-2 mb-1">
            {origem && origem.map((o, i) => (
              <span key={i} title={o} className="text-xl">{ORIGIN_FLAGS[o] || '🏳️'}</span>
            ))}
            {marca && (
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest leading-none truncate">{marca}</span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mt-0.5">
            {nome}
          </h3>

          {/* Pills */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
            {/* Leite */}
            {leiteType === 'contains'
              ? <Pill type="contains" label={"Leite"} tooltip={leiteTooltip} />
              : (leiteTracosType === 'traces'
                  ? <Pill type="traces" label={"Leite"} tooltip={leiteTracosTooltip} />
                  : leiteType && <Pill type={leiteType} label={"Leite"} tooltip={leiteTooltip} />)}
            {/* Ovos */}
            {ovosType === 'contains'
              ? <Pill type="contains" label={"Ovos"} tooltip={ovosTooltip} />
              : (ovosTracosType === 'traces'
                  ? <Pill type="traces" label={"Ovos"} tooltip={ovosTracosTooltip} />
                  : ovosType && <Pill type={ovosType} label={"Ovos"} tooltip={ovosTooltip} />)}
            {/* Carne */}
            {carneType === 'contains'
              ? <Pill type="contains" label={"Carne"} tooltip={carneTooltip} />
              : (carneTracosType === 'traces'
                  ? <Pill type="traces" label={"Carne"} tooltip={carneTracosTooltip} />
                  : carneType && <Pill type={carneType} label={"Carne"} tooltip={carneTooltip} />)}
            {/* Glúten */}
            {glutenType === 'contains'
              ? <Pill type="contains" label={"Glúten"} tooltip={glutenTooltip} />
              : (glutenTracosType === 'traces'
                  ? <Pill type="traces" label={"Glúten"} tooltip={glutenTracosTooltip} />
                  : glutenType && <Pill type={glutenType} label={"Glúten"} tooltip={glutenTooltip} />)}
          </div>
        </div>
      </button>
      <Modal product={product} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
