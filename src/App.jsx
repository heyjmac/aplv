import { useState, useMemo } from 'react';
import produtos from './content/produtos.json';
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import './App.css';

const INITIAL_FILTERS = {
  search: '',
  empresa: '',
  sem_ovos: false,
  sem_carne: false,
  sem_gluten: false,
  sem_leite: false,
  sem_origem_animal: false,
};

export default function App() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const companies = useMemo(() => {
    const set = new Set(produtos.map(p => p.empresa?.nome));
    return [...set].sort();
  }, []);

  const filtered = useMemo(() => {
    return produtos.filter(p => {
      if (filters.search && !p?.nome.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.empresa && p.empresa?.nome !== filters.empresa) return false;
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

  return (
    <div className="layout">
      <Filters
        filters={filters}
        companies={companies}
        onChange={handleChange}
        onReset={() => setFilters(INITIAL_FILTERS)}
        total={produtos.length}
        filtered={filtered.length}
      />
      <main className="main">
        {filtered.length === 0 ? (
          <p className="empty">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid">
            {filtered.map(p => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
