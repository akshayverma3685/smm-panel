'use client';
import { useEffect, useState } from 'react';

export default function Billing(){
  const [sub, setSub] = useState<any>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(()=>{ if(!token) return; (async()=>{
    const s = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/me/subscription`, { headers: { Authorization:`Bearer ${token}` }}).then(r=>r.json());
    setSub(s);
  })(); },[token]);

  if(!sub) return <div className="p-6">No active subscription. <a className="underline" href="/pricing">View plans</a></div>;

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold">Your Subscription</h1>
      <p className="opacity-80">Plan: {sub.plan?.name}</p>
      <p className="opacity-80">Status: {sub.status}</p>
      <p className="opacity-80">Renews: {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
    </div>
  );
      }
