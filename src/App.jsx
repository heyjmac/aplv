import { useState, useMemo, useEffect } from 'react';
// import produtos from './content/produtos.json'; // carregado dinamicamente abaixo
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import { useAdmin } from './hooks/useAdmin';

const ATTRIBUTE_CHIPS = [
  { key: 'sem_leite', label: 'Sem leite' },
  { key: 'sem_tracos_leite', label: 'Sem traços de leite' },
  { key: 'sem_ovos', label: 'Sem ovos' },
  { key: 'sem_tracos_ovos', label: 'Sem traços de ovos' },
  { key: 'sem_carne', label: 'Sem carne' },
  { key: 'sem_tracos_carne', label: 'Sem traços de carne' },
  { key: 'sem_gluten', label: 'Sem glúten' },
  { key: 'sem_tracos_gluten', label: 'Sem traços de glúten' },
  { key: 'sem_soja', label: 'Sem soja' },
  { key: 'sem_tracos_soja', label: 'Sem traços de soja' },
  { key: 'sem_amendoim', label: 'Sem amendoim' },
  { key: 'sem_tracos_amendoim', label: 'Sem traços de amendoim' },
  { key: 'sem_castanhas', label: 'Sem castanhas' },
  { key: 'sem_tracos_castanhas', label: 'Sem traços de castanhas' },
  { key: 'sem_peixe', label: 'Sem peixe' },
  { key: 'sem_tracos_peixe', label: 'Sem traços de peixe' },
  { key: 'sem_crustaceos', label: 'Sem crustáceos' },
  { key: 'sem_tracos_crustaceos', label: 'Sem traços de crustáceos' },
  { key: 'sem_origem_animal', label: 'Sem origem animal' },
  { key: 'sem_tracos_origem_animal', label: 'Sem traços de origem animal' },
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
  sem_soja: false,
  sem_amendoim: false,
  sem_castanhas: false,
  sem_peixe: false,
  sem_crustaceos: false,
  sem_tracos_leite: false,
  sem_tracos_ovos: false,
  sem_tracos_carne: false,
  sem_tracos_gluten: false,
  sem_tracos_soja: false,
  sem_tracos_amendoim: false,
  sem_tracos_castanhas: false,
  sem_tracos_peixe: false,
  sem_tracos_crustaceos: false,
  sem_tracos_origem_animal: false,
};

export default function App() {
  // Parse filters from URL
  function parseFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const parsed = { ...INITIAL_FILTERS };
    Object.keys(INITIAL_FILTERS).forEach(key => {
      if (typeof INITIAL_FILTERS[key] === 'boolean') {
        parsed[key] = params.get(key) === 'true';
      } else {
        const val = params.get(key);
        if (val !== null) parsed[key] = val;
      }
    });
    return parsed;
  }

  const { isAdmin, token, login, logout } = useAdmin();
  const [filters, setFilters] = useState(() => parseFiltersFromURL());
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Dynamic title based on filters
  useEffect(() => {
    // List of filter keys to check, in order
    const filterKeys = ATTRIBUTE_CHIPS.map(chip => chip.key);
    const active = filterKeys.filter(key => filters[key]);
    let title = 'APLV - Busca de produtos hipoalergênicos';
    if (active.length > 0) {
      // Find label for first active filter
      const firstLabel = ATTRIBUTE_CHIPS.find(chip => chip.key === active[0])?.label || '';
      if (active.length === 1) {
        title = `APLV - Produtos ${firstLabel.toLowerCase()}`;
      } else {
        title = `APLV - Produtos ${firstLabel.toLowerCase()} & outros`;
      }
    }
    document.title = title;
  }, [filters]);

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const loadProducts = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/products?limit=9999`).then(r => r.json()),
      fetch(`${API}/products/filters`).then(r => r.json()),
    ])
      .then(([productsRes, filtersRes]) => {
        setProdutos(productsRes.data || []);
        setCompanies(filtersRes.brands || []);
        setCategories(filtersRes.categories || []);
      })
      .catch(err => {
        console.error('Erro ao carregar produtos:', err);
        setError('Falha ao carregar produtos');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return produtos.filter(p => {
      // Determine if product information is unknown
      const isUnknown = !p.alergicos && !(p.ingredientes || p.descricao_ingredientes);
      
      // If any specific dietary filter is active, exclude unknown products
      const hasActiveDietaryFilter = 
        filters.sem_ovos || filters.sem_carne || filters.sem_gluten || filters.sem_leite ||
        filters.sem_origem_animal || filters.sem_soja || filters.sem_amendoim || filters.sem_castanhas ||
        filters.sem_peixe || filters.sem_crustaceos || 
        filters.sem_tracos_leite || filters.sem_tracos_ovos || filters.sem_tracos_carne || 
        filters.sem_tracos_gluten || filters.sem_tracos_soja || filters.sem_tracos_amendoim || 
        filters.sem_tracos_castanhas || filters.sem_tracos_peixe || filters.sem_tracos_crustaceos || 
        filters.sem_tracos_origem_animal;

      if (isUnknown && hasActiveDietaryFilter) return false;

      if (filters.search && !p?.nome.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.empresa && p.marca !== filters.empresa) return false;
      if (filters.categoria && p.categoria !== filters.categoria) return false;
      if (filters.sem_ovos && p.atributos.contem_ovos !== false) return false;
      if (filters.sem_carne && p.atributos.contem_carne !== false) return false;
      if (filters.sem_gluten && p.atributos.contem_gluten !== false) return false;
      if (filters.sem_leite && p.atributos.leite_ou_derivados !== false) return false;
      if (filters.sem_origem_animal && p.atributos.origem_animal !== false) return false;
      if (filters.sem_soja && p.atributos.contem_soja !== false) return false;
      if (filters.sem_amendoim && p.atributos.contem_amendoim !== false) return false;
      if (filters.sem_castanhas && p.atributos.contem_castanhas !== false) return false;
      if (filters.sem_peixe && p.atributos.contem_peixe !== false) return false;
      if (filters.sem_crustaceos && p.atributos.contem_crustaceos !== false) return false;
      if (filters.sem_tracos_leite && p.atributos.pode_conter_leite_ou_derivados !== false) return false;
      if (filters.sem_tracos_ovos && p.atributos.pode_conter_ovos !== false) return false;
      if (filters.sem_tracos_carne && p.atributos.pode_conter_carne !== false) return false;
      if (filters.sem_tracos_gluten && p.atributos.pode_conter_gluten !== false) return false;
      if (filters.sem_tracos_soja && p.atributos.pode_conter_soja !== false) return false;
      if (filters.sem_tracos_amendoim && p.atributos.pode_conter_amendoim !== false) return false;
      if (filters.sem_tracos_castanhas && p.atributos.pode_conter_castanhas !== false) return false;
      if (filters.sem_tracos_peixe && p.atributos.pode_conter_peixe !== false) return false;
      if (filters.sem_tracos_crustaceos && p.atributos.pode_conter_crustaceos !== false) return false;
      if (filters.sem_tracos_origem_animal && p.atributos.pode_conter_origem_animal !== false) return false;
      return true;
    });
  }, [filters, produtos]);

  function handleChange(key, value) {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      const traceToBase = {
        sem_tracos_leite: 'sem_leite',
        sem_tracos_ovos: 'sem_ovos',
        sem_tracos_carne: 'sem_carne',
        sem_tracos_gluten: 'sem_gluten',
        sem_tracos_soja: 'sem_soja',
        sem_tracos_amendoim: 'sem_amendoim',
        sem_tracos_castanhas: 'sem_castanhas',
        sem_tracos_peixe: 'sem_peixe',
        sem_tracos_crustaceos: 'sem_crustaceos',
        sem_tracos_origem_animal: 'sem_origem_animal',
      };
      const baseToTrace = Object.fromEntries(Object.entries(traceToBase).map(([t, b]) => [b, t]));

      // If enabling a 'traces' filter, force-enable its base filter
      if (traceToBase[key] && value) {
        next[traceToBase[key]] = true;
      }
      // If disabling a base filter, force-disable its 'traces' filter
      if (baseToTrace[key] && value === false) {
        next[baseToTrace[key]] = false;
      }

      // Update URL
      const params = new URLSearchParams();
      Object.keys(next).forEach(k => {
        if (typeof next[k] === 'boolean') {
          if (next[k]) params.set(k, 'true');
        } else if (next[k]) {
          params.set(k, next[k]);
        }
      });
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);

      return next;
    });
    // On mount, apply filters from URL if present
    useEffect(() => {
      setFilters(parseFiltersFromURL());
      // eslint-disable-next-line
    }, []);
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
            <p style={{fontFamily: "'Unbounded', sans-serif", background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}} className="text-xl font-black leading-none tracking-tight mr-2">APLV</p>
          </div>

          {/* Search + count */}
          <div className="flex items-center gap-2 flex-1 justify-end max-w-xs">
            {isAdmin && (
              <button
                onClick={() => setShowAddProduct(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shrink-0"
              >
                + Produto
              </button>
            )}
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
          </div>
        </div>


        {/* Chips row — desktop */}
        <div className="hidden md:flex items-center gap-3 px-4 pb-2">
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
                onClick={() => {
                  setFilters(INITIAL_FILTERS);
                  window.history.replaceState(null, '', window.location.pathname);
                }}
                className="px-3 py-1 text-xs font-medium rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Mobile category row */}
        <div className="md:hidden flex items-center gap-2 px-4 pb-2 border-t border-slate-100 pt-2">
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
          className="bg-white border-b border-slate-200 md:border-b-0 md:border-r md:sticky md:top-0 md:h-screen md:overflow-y-auto md:w-60 md:shrink-0 md:pb-[60px] hidden md:block"
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
        <main className="flex-1 p-5 pb-20 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <span className="inline-block w-6 h-6 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin mb-2"></span>
              <p className="text-xs">Carregando produtos…</p>
            </div>
          ) : error ? (
            <div className="text-center mt-20 text-red-400 select-none">
              <p className="text-sm">Falha ao carregar produtos. Tente novamente.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center mt-20 text-slate-400 select-none">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(p => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  categories={categories}
                  isAdmin={isAdmin}
                  token={token}
                  onFilterByBrand={(brand) => setFilters(prev => ({ ...prev, empresa: brand, categoria: '' }))}
                />
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
        <button
          onClick={isAdmin ? logout : login}
          className={`absolute bottom-3 right-3 text-[10px] transition select-none ${isAdmin ? "text-green-600 hover:text-green-800" : "text-slate-400 hover:text-slate-600"}`}
          title={isAdmin ? 'Sair' : 'Admin'}
        >{isAdmin ? '● admin' : 'admin'}</button>
      </footer>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModal
          open={showAddProduct}
          onClose={() => setShowAddProduct(false)}
          categories={categories}
          token={token}
          onProductAdded={loadProducts}
          API={API}
        />
      )}
    </div>
  );
}

function AddProductModal({ open, onClose, categories, token, onProductAdded, API }) {
  const [mounted, setMounted] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nome: '',
    marca: '',
    categoria: '',
    descricao: '',
    imagem: '',
    url: '',
    ingredientes: '',
    alergicos: '',
    atributos: {
      leite_ou_derivados: false,
      pode_conter_leite_ou_derivados: false,
      contem_ovos: false,
      pode_conter_ovos: false,
      contem_carne: false,
      pode_conter_carne: false,
      contem_gluten: false,
      pode_conter_gluten: false,
      contem_soja: false,
      pode_conter_soja: false,
      contem_amendoim: false,
      pode_conter_amendoim: false,
      contem_castanhas: false,
      pode_conter_castanhas: false,
      contem_peixe: false,
      pode_conter_peixe: false,
      contem_crustaceos: false,
      pode_conter_crustaceos: false,
      origem_animal: false,
      pode_conter_origem_animal: false,
    },
  });
  const [saving, setSaving] = useState(false);

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

  const setAttr = (key, val) => setNewProduct(d => ({ ...d, atributos: { ...d.atributos, [key]: val } }));

  const handleSave = async () => {
    if (!newProduct.nome.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${API}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        onProductAdded();
        onClose();
      } else {
        alert('Erro ao criar produto');
      }
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      alert('Erro ao criar produto');
    } finally {
      setSaving(false);
    }
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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity ${mounted ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden transform transition-all duration-200 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'} max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Adicionar Novo Produto</h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-3 mb-6">
            <div>
              <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nome *</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={newProduct.nome}
                onChange={e => setNewProduct(d => ({ ...d, nome: e.target.value }))}
                placeholder="Nome do produto"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Marca</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={newProduct.marca}
                  onChange={e => setNewProduct(d => ({ ...d, marca: e.target.value }))}
                  placeholder="Marca"
                />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Categoria</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  value={newProduct.categoria}
                  onChange={e => setNewProduct(d => ({ ...d, categoria: e.target.value }))}
                >
                  <option value="">—</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">URL do Produto</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={newProduct.url}
                onChange={e => setNewProduct(d => ({ ...d, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Imagem URL</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={newProduct.imagem}
                onChange={e => setNewProduct(d => ({ ...d, imagem: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Descrição</label>
              <textarea
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                value={newProduct.descricao}
                onChange={e => setNewProduct(d => ({ ...d, descricao: e.target.value }))}
                placeholder="Descrição do produto"
              />
            </div>
            <div>
              <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Ingredientes</label>
              <textarea
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                value={newProduct.ingredientes}
                onChange={e => setNewProduct(d => ({ ...d, ingredientes: e.target.value }))}
                placeholder="Lista de ingredientes"
              />
            </div>
            <div>
              <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Alérgicos</label>
              <textarea
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                value={newProduct.alergicos}
                onChange={e => setNewProduct(d => ({ ...d, alergicos: e.target.value }))}
                placeholder="Informações sobre alérgicos"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Atributos</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                const has = newProduct.atributos[hasKey];
                const may = newProduct.atributos[mayKey];
                let value = '';
                if (has === true) value = 'sim';
                else if (may === true) value = 'talvez';
                else value = 'não';
                const type = has === true ? 'contains' : may === true ? 'traces' : 'free';

                const cycle = () => {
                  if (has === true) { setAttr(hasKey, false); setAttr(mayKey, true); }        // sim → talvez
                  else if (may === true) { setAttr(hasKey, false); setAttr(mayKey, false); }  // talvez → não
                  else { setAttr(hasKey, true); setAttr(mayKey, false); }                     // não → sim
                };

                const colorClass = type === 'free' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : type === 'contains' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100';

                return (
                  <button
                    key={hasKey}
                    onClick={cycle}
                    className="flex items-center justify-between gap-3 text-sm py-2 px-3 w-full text-left hover:bg-slate-50 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0">{icon}</span>
                      <span className="font-medium text-slate-700 truncate text-xs">{label}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 z-10">
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              disabled={saving}
              className="text-sm px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Criar Produto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
