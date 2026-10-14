// Prices are shown in Rwandan francs. To use dollars, change "RWF" to "USD" and "en-RW" to "en-US".
const priceFormatter = new Intl.NumberFormat("en-RW", {
  style: "currency",
  currency: "RWF",
  maximumFractionDigits: 0,
});

export const formatPrice = (price: number) => priceFormatter.format(price);

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
