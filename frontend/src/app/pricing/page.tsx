'use client';
import { useEffect, useState } from 'react';

export default function Pricing(){
  const [plans, setPlans] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(()=>{ (async()=>{
    const p = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/billing/plans`).then(r=>r.json());
    setPlans(p);
  })(); },[]);

  const checkout = async (planId: string, provider: 'stripe'|'razorpay') => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/billing/checkout`, { method:'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ provider, planId }) });
    const json = await res.json();
    if(provider==='stripe') window.location.href = json.url;
    if(provider==='razorpay') {
      // hand over to Razorpay Checkout (client-side integration minimal)
      // For demo: redirect to success after payment is captured by webhook
      alert(`Razorpay Order Created: ${json.orderId}. Complete in your test dashboard.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Choose a Plan</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p:any)=> (
          <div key={p.id} className="bg-white/5 rounded-2xl p-6">
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="opacity-70 text-sm mb-2">{p.description||''}</p>
            <p className="text-3xl font-bold">₹{(p.pricePaise/100).toFixed(0)}<span className="text-sm font-medium opacity-70">/{p.interval}</span></p>
            <ul className="mt-4 space-y-1 text-sm opacity-90">
              {p.features?.map((f:string, i:number)=> (<li key={i}>• {f}</li>))}
            </ul>
            <div className="mt-6 flex gap-2">
              <button onClick={()=>checkout(p.id,'razorpay')} className="px-3 py-2 bg-white text-black rounded">Razorpay</button>
              <button onClick={()=>checkout(p.id,'stripe')} className="px-3 py-2 bg-white text-black rounded">Stripe</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
                          }
