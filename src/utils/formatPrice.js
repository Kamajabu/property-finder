export const formatPrice = (price) => {
  return new Intl.NumberFormat('pl-PL').format(price);
};