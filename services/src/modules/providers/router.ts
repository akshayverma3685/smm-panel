import { env } from '../../env';
import type { Service, Provider, ProviderMapping, Order } from '@prisma/client';

export function selectBestMapping(mappings: (ProviderMapping & { provider: Provider })[]){
  return mappings.filter(m => m.provider.isActive).sort((a,b)=> a.priority - b.priority)[0];
}

export async function callProvider(order: Order & { service: Service & { providerMappings: (ProviderMapping & { provider: Provider })[] } }){
  const mapping = selectBestMapping(order.service.providerMappings);
  if (!mapping) throw new Error('No provider mapping');
  const provider = mapping.provider;
  if (provider.type === 'MODERN') return callModern(provider, mapping, order);
  return callLegacy(provider, mapping, order);
}

async function callModern(provider: Provider, mapping: ProviderMapping, order: Order){
  const url = new URL('/orders', provider.baseUrl!).toString();
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${provider.apiKey}` }, body: JSON.stringify({ serviceId: mapping.remoteId, quantity: order.quantity, target: order.targetUrl }) });
  if (!res.ok) throw new Error(`Modern provider error ${res.status}`);
  const j = await res.json();
  return { externalOrderId: j.id || j.orderId || String(j), note: j.message || 'accepted' };
}

async function callLegacy(provider: Provider, mapping: ProviderMapping, order: Order){
  const url = new URL('/', provider.baseUrl!).toString();
  const params = new URLSearchParams({ key: provider.apiKey, action: 'add', service: mapping.remoteId, link: order.targetUrl, quantity: String(order.quantity) });
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
  if (!res.ok) throw new Error(`Legacy provider error ${res.status}`);
  const j = await res.json().catch(()=>({}));
  const oid = j.order || j.id || j.order_id; if (!oid) throw new Error('No order id from legacy provider');
  return { externalOrderId: String(oid), note: j.remains ? `remains ${j.remains}` : 'accepted' };
                    }
