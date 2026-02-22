'use client';

import { useState } from 'react';
import { FIELD_TYPES } from '@/lib/constants';

export function ProductForm({ product }: { product?: any }) {
  const [offers, setOffers] = useState(product?.offers ?? [{ title: '', priceNpr: 0, note: '', active: true }]);
  const [fields, setFields] = useState(product?.orderFields ?? [{ label: '', fieldType: 'text', required: true }]);

  return (
    <>
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <label>Name<input className="input" name="name" defaultValue={product?.name} required /></label>
      <label>Slug<input className="input" name="slug" defaultValue={product?.slug} required /></label>
      <label>Category<select name="category" defaultValue={product?.category || 'Games'} className="input"><option>Games</option><option>Entertainment</option><option>Productivity</option></select></label>
      <label>Description (Markdown supported)<textarea className="textarea" name="description" defaultValue={product?.description} rows={6} /></label>
      <label>Icon URL<input className="input" name="iconUrl" defaultValue={product?.iconUrl || '/uploads/default.svg'} required /></label>
      <label><input type="checkbox" name="active" defaultChecked={product?.active ?? true} /> Active</label>

      <h3>Offers</h3>
      {offers.map((offer: any, i: number) => <div key={i} className="card grid"><input className="input" placeholder="Title" value={offer.title} onChange={(e)=>{const n=[...offers];n[i].title=e.target.value;setOffers(n);}} /><input className="input" placeholder="Price NPR" type="number" value={offer.priceNpr} onChange={(e)=>{const n=[...offers];n[i].priceNpr=Number(e.target.value);setOffers(n);}} /><input className="input" placeholder="Note" value={offer.note||''} onChange={(e)=>{const n=[...offers];n[i].note=e.target.value;setOffers(n);}} /><label><input type="checkbox" checked={offer.active} onChange={(e)=>{const n=[...offers];n[i].active=e.target.checked;setOffers(n);}} /> Active</label></div>)}
      <button className="btn btn-outline" type="button" onClick={()=>setOffers([...offers,{ title: '', priceNpr: 0, note: '', active: true }])}>+ Add Offer</button>

      <h3>Custom Purchase Fields</h3>
      {fields.map((f: any, i: number) => <div key={i} className="card grid"><input className="input" placeholder="Label" value={f.label} onChange={(e)=>{const n=[...fields];n[i].label=e.target.value;setFields(n);}} /><select className="input" value={f.fieldType} onChange={(e)=>{const n=[...fields];n[i].fieldType=e.target.value;setFields(n);}}>{FIELD_TYPES.map((t)=> <option key={t}>{t}</option>)}</select><label><input type="checkbox" checked={f.required} onChange={(e)=>{const n=[...fields];n[i].required=e.target.checked;setFields(n);}} /> Required</label><div style={{display:'flex',gap:8}}><button type="button" className="btn btn-outline" onClick={()=> i>0 && setFields(fields.map((x:any,idx:number)=> idx===i-1?fields[i]:idx===i?fields[i-1]:x))}>↑</button><button type="button" className="btn btn-outline" onClick={()=>setFields(fields.filter((_:any,idx:number)=>idx!==i))}>Remove</button></div></div>)}
      <button className="btn btn-outline" type="button" onClick={()=>setFields([...fields,{ label: '', fieldType: 'text', required: false }])}>+ Add Field</button>

      <input type="hidden" name="offersJson" value={JSON.stringify(offers)} />
      <input type="hidden" name="fieldsJson" value={JSON.stringify(fields)} />
    </>
  );
}
