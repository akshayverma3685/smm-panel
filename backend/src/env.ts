export const env = {
  // ...existing
  STRIPE_SECRET: process.env.STRIPE_SECRET,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  APP_URL: process.env.APP_URL || 'http://localhost:3000'
};
