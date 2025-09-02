export const getDurationInMinutes=(distanceKm: number, avgSpeedKmh = 40)=> {
  return Math.ceil((distanceKm / avgSpeedKmh) * 60); 
}

