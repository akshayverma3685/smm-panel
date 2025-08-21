import { hmacSHA256 } from '../../utils/crypto';
import { env } from '../../env';

export function verifySignature(rawBody: string, signature?: string){
  if (!signature) return false;
  const digest = hmacSHA256(env.WEBHOOK_SIGNING_SECRET, rawBody);
  return digest === signature;
}
