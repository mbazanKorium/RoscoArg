export const getConurbanoScore = (
  real: { lat: number; lng: number },
  guess: { lat: number; lng: number }
): { score: number; distance: number } => {
  const R = 6371;
  const dLat = ((guess.lat - real.lat) * Math.PI) / 180;
  const dLng = ((guess.lng - real.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((real.lat * Math.PI) / 180) *
      Math.cos((guess.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const score = distance >= 25 ? 0 : Math.round(1000 * (1 - distance / 25));

  return { score, distance };
};
