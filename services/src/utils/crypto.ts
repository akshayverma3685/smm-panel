import { createHmac } from 'crypto';
export function hmacSHA256(secret: string, payload: string){
  return createHmac('sha256', secret).update(payload).digest('hex');
}
