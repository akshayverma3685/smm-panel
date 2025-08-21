export function fraudScore(input: { amount: number; newUser: boolean; failedPayments: number }){
  // simple heuristic placeholder
  let score = 0;
  if (input.amount > 500000) score += 40; // > ₹5000
  if (input.newUser) score += 30;
  score += Math.min(30, input.failedPayments * 5);
  return Math.min(100, score);
}
