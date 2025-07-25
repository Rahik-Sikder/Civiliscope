// House of Representatives seating arrangement
// Semicircle layout with Democrats on left, Republicans on right

interface SeatPosition {
  id: number;
  left: string;
  top: string;
  rotation: number;
  partyPreference?: 'Democrat' | 'Republican' | 'Other';
}

// Configuration constants for easy adjustment
const CHAMBER_CONFIG = {
  totalSeats: 435,
  centerX: 48,        // Center X position (%)
  centerY: 20,        // Center Y position (%) - moved down for proper horseshoe
  minRadius: 15,      // Inner radius
  maxRadius: 45,      // Outer radius - increased for better horseshoe shape
  totalRows: 7,       // Number of concentric rows
  startAngle: 190,    // Start angle (degrees) - slightly less than 180 for horseshoe
  endAngle: -10,       // End angle (degrees) - slightly more than 0 for horseshoe
  seatSpacing: 4.5,   // Spacing between seats
};

export const generateHouseSeats = (): SeatPosition[] => {
  const seats: SeatPosition[] = [];
  const { totalSeats, centerX, centerY, minRadius, maxRadius, totalRows, startAngle, endAngle, seatSpacing } = CHAMBER_CONFIG;
  const angleSpan = startAngle - endAngle;
  
  let seatId = 1;
  
  for (let row = 0; row < totalRows; row++) {
    // Calculate radius for this row
    const radius = minRadius + (maxRadius - minRadius) * (row / (totalRows - 1));
    
    // Calculate number of seats in this row based on circumference and spacing
    const circumference = Math.PI * radius;
    const seatsInRow = Math.floor(circumference / seatSpacing) + row * 2;
    
    // Ensure we don't exceed total seats
    const remainingSeats = totalSeats - (seatId - 1);
    const actualSeatsInRow = Math.min(seatsInRow, remainingSeats);
    
    if (actualSeatsInRow <= 0) break;
    
    // Calculate angle step for this row
    const angleStep = angleSpan / (actualSeatsInRow - 1);
    
    for (let seatInRow = 0; seatInRow < actualSeatsInRow; seatInRow++) {
      const angle = startAngle - (seatInRow * angleStep);
      const radians = (angle * Math.PI) / 180;
      
      // Calculate position
      const x = centerX + radius * Math.cos(radians);
      const y = centerY + radius * Math.sin(radians);
      
      // Determine party preference based on position
      let partyPreference: 'Democrat' | 'Republican' | 'Other';
      if (angle > 90) {
        partyPreference = 'Democrat'; // Left side
      } else if (angle < 90) {
        partyPreference = 'Republican'; // Right side
      } else {
        partyPreference = 'Other'; // Center
      }
      
      // Calculate rotation to face center
      const rotation = -(angle - 90);
      
      seats.push({
        id: seatId,
        left: `${x.toFixed(2)}%`,
        top: `${y.toFixed(2)}%`,
        rotation: parseFloat(rotation.toFixed(1)),
        partyPreference
      });
      
      seatId++;
      if (seatId > totalSeats) break;
    }
    
    if (seatId > totalSeats) break;
  }
  
  return seats;
};

export const houseSeats = generateHouseSeats();