export const getPriceColor = (price) => {
  // Normalize price to a 0-1 range (assuming prices from 1000 to 10000)
  const minPrice = 1000;
  const maxPrice = 10000;
  const normalizedPrice = Math.min(Math.max((price - minPrice) / (maxPrice - minPrice), 0), 1);
  
  // Create a color gradient from green (cheap) to red (expensive)
  const hue = (1 - normalizedPrice) * 120; // 120 is green, 0 is red
  const saturation = 70 + (normalizedPrice * 30); // 70-100%
  const lightness = 45 + (normalizedPrice * 10); // 45-55%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const getPriceLightColor = (price) => {
  const minPrice = 1000;
  const maxPrice = 10000;
  const normalizedPrice = Math.min(Math.max((price - minPrice) / (maxPrice - minPrice), 0), 1);
  
  const hue = (1 - normalizedPrice) * 120;
  const saturation = 40 + (normalizedPrice * 20);
  const lightness = 85 + (normalizedPrice * 10);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};