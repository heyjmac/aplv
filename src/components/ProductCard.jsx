import { useEffect, useMemo, useState } from 'react';
import santaluzia from '../assets/santaluzia.png';

const getProxiedImage = (url) => {
  if (!url) return '';
  const newUrl = url.replace('vteximg.com.br', 'vtexassets.com').replace('vteximg.com', 'vtexassets.com');
  return `https://storetheme.vtexassets.com/unsafe/200x200/center/middle/${encodeURIComponent(newUrl)}`;
};

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
  'Alemanha': '🇩🇪',
  'Argentina': '🇦🇷',
  'Brasil': '🇧🇷',
  'Bélgica': '🇧🇪',
  'Canadá': '🇨🇦',
  'China': '🇨🇳',
  'Colômbia': '🇨🇴',
  'Cuba': '🇨🇺',
  'Dinamarca': '🇩🇰',
  'E. Árabes Unidos': '🇦🇪',
  'Escócia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Espanha': '🇪🇸',
  'Estados Unidos': '🇺🇸',
  'França': '🇫🇷',
  'Guatemala': '🇬🇹',
  'Holanda': '🇳🇱',
  'Importado': '🌐',
  'Indonésia': '🇮🇩',
  'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Israel': '🇮🇱',
  'Itália': '🇮🇹',
  'Japão': '🇯🇵',
  'Líbano': '🇱🇧',
  'Polônia': '🇵🇱',
  'Portugal': '🇵🇹',
  'Reino Unido': '🇬🇧',
  'República Tcheca': '🇨🇿',
  'Sri Lanka': '🇱🇰',
  'Suécia': '🇸🇪',
  'Suíça': '🇨🇭',
  'Tailândia': '🇹🇭',
  'Turquia': '🇹🇷',
  'Uruguai': '🇺🇾',
  'Áustria': '🇦🇹',
  'Índia': '🇮🇳',
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
    <div className="flex items-center justify-between gap-3 text-sm py-1">
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="font-medium text-slate-700 truncate">{name}</span>
      </div>
      <ValueBadge type={type}>{value}</ValueBadge>
    </div>
  );
}

function Modal({ product, open, onClose, onFilterByBrand, categories = [], isAdmin = false, token = null }) {
  const { nome, imagem, marca, categoria, descricao, url, origem, ingredientes, descricao_ingredientes, alergicos, atributos } = product;
  const [mounted, setMounted] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome, marca, categoria, descricao, imagem,
    ingredientes: ingredientes || descricao_ingredientes || '',
    alergicos: alergicos || '',
    atributos: { ...atributos },
  });

  const setAttr = (key, val) => setEditData(d => ({ ...d, atributos: { ...d.atributos, [key]: val } }));

  const handleSave = async () => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      await fetch(`${API}/products/${product.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nome: editData.nome,
          marca: editData.marca,
          categoria: editData.categoria,
          descricao: editData.descricao,
          imagem: editData.imagem,
          ingredientes: editData.ingredientes,
          alergicos: editData.alergicos,
          atributos: editData.atributos,
        }),
      });
    } catch { /* silently ignore network errors */ }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      nome, marca, categoria, descricao, imagem,
      ingredientes: ingredientes || descricao_ingredientes || '',
      alergicos: alergicos || '',
      atributos: { ...atributos },
    });
    setIsEditing(false);
  };

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
    const ingreds = !!(ingredientes || descricao_ingredientes);
    const unknown = !alergens && !ingreds;
    console.log('Unknown check:', { alergicos, ingredientes, descricao_ingredientes, alergens, ingreds, unknown });
    return unknown;
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
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {isAdmin && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition text-sm" aria-label="Editar">✏️</button>
          )}
          <button onClick={onClose} className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition" aria-label="Fechar">✕</button>
        </div>



        <div className="flex flex-col">
          {/* Content panel */}
          <div className="overflow-y-auto max-h-[70vh] pr-2">
            <div className='p-6 pb-0 flex flex-col-reverse md:flex-row gap-y-6 md:gap-x-6'>
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex flex-col gap-3 mb-4">
                    <div>
                      <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nome</label>
                      <input
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={editData.nome}
                        onChange={e => setEditData(d => ({ ...d, nome: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Marca</label>
                        <input
                          className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          value={editData.marca || ''}
                          onChange={e => setEditData(d => ({ ...d, marca: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Categoria</label>
                        <select
                          className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                          value={editData.categoria || ''}
                          onChange={e => setEditData(d => ({ ...d, categoria: e.target.value }))}
                        >
                          <option value="">—</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Descrição</label>
                      <textarea
                        rows={3}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        value={editData.descricao || ''}
                        onChange={e => setEditData(d => ({ ...d, descricao: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Ingredientes</label>
                      <textarea
                        rows={2}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        value={editData.ingredientes}
                        onChange={e => setEditData(d => ({ ...d, ingredientes: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Alérgicos</label>
                      <textarea
                        rows={2}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        value={editData.alergicos}
                        onChange={e => setEditData(d => ({ ...d, alergicos: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 id="product-title" className="text-lg font-bold text-slate-900 leading-snug mb-1">{nome}</h2>
                    <div className="flex items-center gap-2 mb-2">
                      {origem && origem.filter(o => o !== 'Importado').map((o, i) => (
                        <span key={i} title={o} className="text-2xl leading-none">{ORIGIN_FLAGS[o] || '🏳️'}</span>
                      ))}
                      {categoria && <span className="text-xs text-slate-500">{categoria}</span>}
                    </div>
                    {marca && (
                      <div
                        className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 cursor-pointer hover:underline"
                        onClick={() => {
                          if (onFilterByBrand) onFilterByBrand(marca);
                          onClose();
                        }}
                      >
                        {marca}
                      </div>
                    )}
                    {descricao && (
                      <div className="mb-3 text-sm text-slate-700 whitespace-pre-line">
                        {(() => {
                          const idxIng = descricao.indexOf('Ingredientes:');
                          const idxAler = descricao.indexOf('Alérgicos:');
                          let endIdx = -1;
                          if (idxIng !== -1 && idxAler !== -1) endIdx = Math.min(idxIng, idxAler);
                          else if (idxIng !== -1) endIdx = idxIng;
                          else if (idxAler !== -1) endIdx = idxAler;
                          const cleanDesc = endIdx !== -1 ? descricao.slice(0, endIdx).trim() : descricao;
                          const limit = 190;
                          const isLong = cleanDesc.length > limit;
                          if (!isLong || showFullDesc) {
                            return (
                              <>
                                {cleanDesc}
                                {isLong && (
                                  <button onClick={() => setShowFullDesc(false)} className="text-indigo-600 font-semibold hover:underline ml-1 text-xs whitespace-nowrap">Ver menos</button>
                                )}
                              </>
                            );
                          }
                          return (
                            <>
                              {cleanDesc.slice(0, limit)}...
                              <button onClick={() => setShowFullDesc(true)} className="text-indigo-600 font-semibold hover:underline ml-1 text-xs whitespace-nowrap">Ver mais</button>
                            </>
                          );
                        })()}
                      </div>
                    )}
                    <div className="mb-4 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs text-slate-600">
                      <div className="font-medium text-slate-700">Ingredientes:</div>
                      <div>{(ingredientes || descricao_ingredientes || '').trim() ? (ingredientes || descricao_ingredientes) : 'Não informado'}</div>
                      <div className="font-medium text-slate-700 mt-1">Alérgicos:</div>
                      <div>{(alergicos || '').trim() ? alergicos : 'Não informado'}</div>
                    </div>
                  </>
                )}
              </div>
              <div>
                <img src={getProxiedImage(isEditing ? editData.imagem : imagem)} alt={nome} className="w-full min-w-[240px] h-48 md:h-60 object-contain rounded-xl shadow-sm" />
                {isEditing && (
                  <div className="mt-3">
                    <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Imagem URL</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      value={editData.imagem || ''}
                      onChange={e => setEditData(d => ({ ...d, imagem: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className='p-6 pt-0'>
              <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Atributos</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16">
                {[
                  { hasKey: 'leite_ou_derivados', mayKey: 'pode_conter_leite_ou_derivados', label: 'Contém leite', icon: ATTR_ICONS.leite_ou_derivados },
                  { hasKey: 'contem_ovos', mayKey: 'pode_conter_ovos', label: 'Contém ovos', icon: ATTR_ICONS.contem_ovos },
                  { hasKey: 'contem_carne', mayKey: 'pode_conter_carne', label: 'Contém carne', icon: ATTR_ICONS.contem_carne },
                  { hasKey: 'contem_gluten', mayKey: 'pode_conter_gluten', label: 'Contém glúten', icon: ATTR_ICONS.contem_gluten },
                  { hasKey: 'contem_soja', mayKey: 'pode_conter_soja', label: 'Contém soja', icon: ATTR_ICONS.contem_soja },
                  { hasKey: 'contem_amendoim', mayKey: 'pode_conter_amendoim', label: 'Contém amendoim', icon: ATTR_ICONS.contem_amendoim },
                  { hasKey: 'contem_castanhas', mayKey: 'pode_conter_castanhas', label: 'Contém castanhas', icon: ATTR_ICONS.contem_castanhas },
                  { hasKey: 'contem_peixe', mayKey: 'pode_conter_peixe', label: 'Contém peixe', icon: ATTR_ICONS.contem_peixe },
                  { hasKey: 'contem_crustaceos', mayKey: 'pode_conter_crustaceos', label: 'Contém crustáceos', icon: ATTR_ICONS.contem_crustaceos },
                  { hasKey: 'origem_animal', mayKey: 'pode_conter_origem_animal', label: 'Origem animal', icon: ATTR_ICONS.origem_animal },
                ].map(({ hasKey, mayKey, label, icon }) => {
                  const src = isEditing ? editData.atributos : atributos;
                  const has = src[hasKey];
                  const may = src[mayKey];
                  let value = '';
                  if (unknown && !isEditing) value = '?';
                  else if (has === true) value = 'sim';
                  else if (may === true) value = 'talvez';
                  else value = 'não';
                  const type = (unknown && !isEditing) ? 'traces' : has === true ? 'contains' : may === true ? 'traces' : 'free';

                  if (isEditing) {
                    const cycle = () => {
                      if (has === true) { setAttr(hasKey, false); setAttr(mayKey, true); }        // sim → talvez
                      else if (may === true) { setAttr(hasKey, false); setAttr(mayKey, false); }  // talvez → não
                      else { setAttr(hasKey, true); setAttr(mayKey, false); }                     // não → sim
                    };
                    return (
                      <button key={hasKey} onClick={cycle} className="flex items-center justify-between gap-3 text-sm py-1 w-full text-left hover:bg-slate-50 rounded-lg px-1 transition cursor-pointer">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shrink-0">{icon}</span>
                          <span className="font-medium text-slate-700 truncate">{label}</span>
                        </div>
                        <ValueBadge type={type}>{value}</ValueBadge>
                      </button>
                    );
                  }
                  return <AttributeRow key={hasKey} icon={icon} name={label} value={value} type={type} />;
                })}
              </div>
            </div>

            <div className="pb-2 flex flex-col items-end pr-4 gap-2 sticky bottom-0 pt-3 bg-white z-10 border-t border-slate-200">
              {isEditing ? (
                <div className="flex items-center gap-2 w-full justify-end">
                  <button onClick={handleCancel} className="text-sm px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancelar</button>
                  <button onClick={handleSave} className="text-sm px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">Salvar</button>
                </div>
              ) : (
                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-700 hover:underline text-sm font-medium">
                  Ver no <img src={santaluzia} alt="Santa Luzia" className="h-10" />
                </a>
              )}
              <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1 text-center font-normal opacity-80 w-full">
                Sempre confira o rótulo do produto antes de consumir — as informações podem estar desatualizadas e formulações mudam sem aviso.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product, categories, isAdmin, token, onFilterByBrand }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { nome, imagem, marca, descricao, url, origem, atributos, alergicos, ingredientes, descricao_ingredientes } = product;

  const unknown = !alergicos && !(ingredientes || descricao_ingredientes);

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

  // Chips para soja
  let sojaType = null, sojaTooltip = '';
  if (atributos.contem_soja === false) { sojaType = 'free'; sojaTooltip = 'Sem soja'; }
  else if (atributos.contem_soja === true) { sojaType = 'contains'; sojaTooltip = 'Contém soja'; }
  let sojaTracosType = null, sojaTracosTooltip = '';
  if (atributos.pode_conter_soja === true) { sojaTracosType = 'traces'; sojaTracosTooltip = 'Pode conter soja'; }
  else if (atributos.pode_conter_soja === false) { sojaTracosType = 'free'; sojaTracosTooltip = 'Sem traços de soja'; }

  // Chips para amendoim
  let amendoimType = null, amendoimTooltip = '';
  if (atributos.contem_amendoim === false) { amendoimType = 'free'; amendoimTooltip = 'Sem amendoim'; }
  else if (atributos.contem_amendoim === true) { amendoimType = 'contains'; amendoimTooltip = 'Contém amendoim'; }
  let amendoimTracosType = null, amendoimTracosTooltip = '';
  if (atributos.pode_conter_amendoim === true) { amendoimTracosType = 'traces'; amendoimTracosTooltip = 'Pode conter amendoim'; }
  else if (atributos.pode_conter_amendoim === false) { amendoimTracosType = 'free'; amendoimTracosTooltip = 'Sem traços de amendoim'; }

  // Chips para castanhas
  let castanhasType = null, castanhasTooltip = '';
  if (atributos.contem_castanhas === false) { castanhasType = 'free'; castanhasTooltip = 'Sem castanhas'; }
  else if (atributos.contem_castanhas === true) { castanhasType = 'contains'; castanhasTooltip = 'Contém castanhas'; }
  let castanhasTracosType = null, castanhasTracosTooltip = '';
  if (atributos.pode_conter_castanhas === true) { castanhasTracosType = 'traces'; castanhasTracosTooltip = 'Pode conter castanhas'; }
  else if (atributos.pode_conter_castanhas === false) { castanhasTracosType = 'free'; castanhasTracosTooltip = 'Sem traços de castanhas'; }

  // Chips para peixe
  let peixeType = null, peixeTooltip = '';
  if (atributos.contem_peixe === false) { peixeType = 'free'; peixeTooltip = 'Sem peixe'; }
  else if (atributos.contem_peixe === true) { peixeType = 'contains'; peixeTooltip = 'Contém peixe'; }
  let peixeTracosType = null, peixeTracosTooltip = '';
  if (atributos.pode_conter_peixe === true) { peixeTracosType = 'traces'; peixeTracosTooltip = 'Pode conter peixe'; }
  else if (atributos.pode_conter_peixe === false) { peixeTracosType = 'free'; peixeTracosTooltip = 'Sem traços de peixe'; }

  // Chips para crustáceos
  let crustaceosType = null, crustaceosTooltip = '';
  if (atributos.contem_crustaceos === false) { crustaceosType = 'free'; crustaceosTooltip = 'Sem crustáceos'; }
  else if (atributos.contem_crustaceos === true) { crustaceosType = 'contains'; crustaceosTooltip = 'Contém crustáceos'; }
  let crustaceosTracosType = null, crustaceosTracosTooltip = '';
  if (atributos.pode_conter_crustaceos === true) { crustaceosTracosType = 'traces'; crustaceosTracosTooltip = 'Pode conter crustáceos'; }
  else if (atributos.pode_conter_crustaceos === false) { crustaceosTracosType = 'free'; crustaceosTracosTooltip = 'Sem traços de crustáceos'; }

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
            src={getProxiedImage(imagem)}
            alt={nome}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-1.5 flex-1 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            {origem && origem.filter(o => o !== 'Importado').map((o, i) => (
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
            {unknown ? (
              ['Leite', 'Ovos', 'Carne', 'Glúten', 'Soja', 'Amendoim', 'Castanhas', 'Peixe', 'Crustáceos'].map(label => (
                <Pill key={label} type="traces" label={label} tooltip="Informação indisponível" />
              ))
            ) : (
              <>
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

            {/* Soja */}
            {sojaType === 'contains'
              ? <Pill type="contains" label={"Soja"} tooltip={sojaTooltip} />
              : (sojaTracosType === 'traces'
                  ? <Pill type="traces" label={"Soja"} tooltip={sojaTracosTooltip} />
                  : sojaType && <Pill type={sojaType} label={"Soja"} tooltip={sojaTooltip} />)}
            {/* Amendoim */}
            {amendoimType === 'contains'
              ? <Pill type="contains" label={"Amendoim"} tooltip={amendoimTooltip} />
              : (amendoimTracosType === 'traces'
                  ? <Pill type="traces" label={"Amendoim"} tooltip={amendoimTracosTooltip} />
                  : amendoimType && <Pill type={amendoimType} label={"Amendoim"} tooltip={amendoimTooltip} />)}
            {/* Castanhas */}
            {castanhasType === 'contains'
              ? <Pill type="contains" label={"Castanhas"} tooltip={castanhasTooltip} />
              : (castanhasTracosType === 'traces'
                  ? <Pill type="traces" label={"Castanhas"} tooltip={castanhasTracosTooltip} />
                  : castanhasType && <Pill type={castanhasType} label={"Castanhas"} tooltip={castanhasTooltip} />)}
            {/* Peixe */}
            {peixeType === 'contains'
              ? <Pill type="contains" label={"Peixe"} tooltip={peixeTooltip} />
              : (peixeTracosType === 'traces'
                  ? <Pill type="traces" label={"Peixe"} tooltip={peixeTracosTooltip} />
                  : peixeType && <Pill type={peixeType} label={"Peixe"} tooltip={peixeTooltip} />)}
            {/* Crustáceos */}
            {crustaceosType === 'contains'
              ? <Pill type="contains" label={"Crustáceos"} tooltip={crustaceosTooltip} />
              : (crustaceosTracosType === 'traces'
                  ? <Pill type="traces" label={"Crustáceos"} tooltip={crustaceosTracosTooltip} />
                  : crustaceosType && <Pill type={crustaceosType} label={"Crustáceos"} tooltip={crustaceosTooltip} />)}
              </>
            )}
          </div>
        </div>
      </button>
      {modalOpen && <Modal product={product} open={modalOpen} onClose={() => setModalOpen(false)} onFilterByBrand={onFilterByBrand} categories={categories} isAdmin={isAdmin} token={token} />}
    </>
  );
}
