function Badge({ value, trueLabel, falseLabel, unknownLabel }) {
  if (value === true)
    return <span className="badge badge-warn">{trueLabel}</span>;
  if (value === false)
    return <span className="badge badge-ok">{falseLabel}</span>;
  if (unknownLabel)
    return <span className="badge badge-unknown">{unknownLabel}</span>;
  return null;
}

export default function ProductCard({ product }) {
  const { nome, imagem, empresa, descricao, atributos, url } = product;

  return (
    <a className="card" href={url} target="_blank" rel="noopener noreferrer">
      <div className="card-img-wrap">
        <img src={imagem} alt={nome} loading="lazy" />
      </div>
      <div className="card-body">
        <p className="card-company">{empresa?.nome}</p>
        <h3 className="card-name">{nome}</h3>
        {descricao && <p className="card-desc">{descricao}</p>}
        <div className="card-badges">
          <Badge
            value={atributos.contem_ovos}
            trueLabel="Com ovos"
            falseLabel="Sem ovos"
          />
          <Badge
            value={atributos.contem_carne}
            trueLabel="Com carne"
            falseLabel="Sem carne"
          />
          <Badge
            value={atributos.contem_gluten}
            trueLabel="Com glúten"
            falseLabel="Sem glúten"
          />
          <Badge
            value={atributos.leite_ou_derivados}
            trueLabel="Com leite"
            falseLabel="Sem leite"
          />
          <Badge
            value={atributos.origem_animal}
            trueLabel="Origem animal"
            falseLabel="Sem origem animal"
            unknownLabel="Origem desconhecida"
          />
        </div>
      </div>
    </a>
  );
}
