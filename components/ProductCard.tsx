import Link from 'next/link';

export function ProductCard({ product }: { product: any }) {
  const lowest = product.offers.filter((o: any) => o.active).sort((a: any, b: any) => a.priceNpr - b.priceNpr)[0];
  return (
    <article className="card">
      <img src={product.iconUrl} alt={product.name} width={56} height={56} />
      <h3>{product.name}</h3>
      <p>{product.description.slice(0, 90)}...</p>
      <p><strong>Starting from NPR {lowest?.priceNpr ?? 'N/A'}</strong></p>
      <Link className="btn" href={`/products/${product.slug}`}>View offers</Link>
    </article>
  );
}
