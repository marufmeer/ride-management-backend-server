export const getCalculateEstimatedFare=(distance:number,durationMin:number,baseFare=50,perKmRate=10,perMinRate=10)=>{
const totalFare=Math.ceil(baseFare+distance*perKmRate+durationMin*perMinRate)

return totalFare
}