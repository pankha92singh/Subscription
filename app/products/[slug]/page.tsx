import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import { redirect } from 'next/navigation';
import { marked } from 'marked';
import { createOrderAction } from '@/lib/actions';

export default async function ProductDetail({ params, searchParams }: { params: { slug: string }; searchParams: { offerId?: string } }) {
  if (!(await getUserId())) redirect('/');
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { offers: { orderBy: { sortOrder: 'asc' } }, orderFields: { orderBy: { sortOrder: 'asc' } } } });
  if (!product || !product.active) redirect('/products');
  const selectedOffer = searchParams.offerId ? product.offers.find((o) => o.id === Number(searchParams.offerId)) : null;

  return (
    <main className="container">
      <a href="/products">← Back</a>
      <div className="card">
        <img src={product.iconUrl} alt={product.name} width={72} height={72} />
        <h1>{product.name}</h1>
        <div dangerouslySetInnerHTML={{ __html: await marked.parse(product.description) as string }} />
      </div>
      <section className="section">
        <h3>Offers</h3>
        <div className="grid">{product.offers.filter((o) => o.active).map((offer) => (
          <div key={offer.id} className="card">
            <h4>{offer.title}</h4>
            <p>NPR {offer.priceNpr}</p>
            {offer.note && <p>{offer.note}</p>}
            <a className="btn" href={`?offerId=${offer.id}`}>Buy</a>
          </div>
        ))}</div>
      </section>

      {selectedOffer && (
        <section className="section card">
          <h3>Complete order: {selectedOffer.title}</h3>
          <form action={createOrderAction} className="grid">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="offerId" value={selectedOffer.id} />
            {product.orderFields.map((field) => (
              <label key={field.id}>{field.label}{field.required ? ' *' : ''}
                {field.fieldType === 'textarea' ? (
                  <textarea className="textarea" name={`field_${field.id}`} required={field.required} />
                ) : (
                  <input className="input" type={field.fieldType} name={`field_${field.id}`} required={field.required} />
                )}
              </label>
            ))}
            <button className="btn">Submit Order</button>
          </form>
        </section>
      )}
    </main>
  );
}
