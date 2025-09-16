export const priceFormat = (price) => { 

  const formatted =  new Intl.NumberFormat("en-US", {
    // style: "currency",
    // currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price ?? 0);

  return `৳ ${formatted}`
};
