export const getBackendBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASEURL;
};
 

export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};
export const getImageBaseUrl = () => {
  return process.env.NEXT_PUBLIC_IMAGE_URL;
};