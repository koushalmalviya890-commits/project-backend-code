function getFixedServiceFee(facilityType) {
  if (!facilityType) return 30; // Default safety
  const normalizedType = facilityType.toLowerCase().trim();

  // 40Rs Tier
  if (
    normalizedType.includes('individual-cabin') || 
    normalizedType.includes('individual cabin') ||
    normalizedType.includes('coworking') || 
    normalizedType.includes('raw space office') ||
    normalizedType.includes('raw-space-office')
  ) {
    return 40;
  }
  
  // 10Rs Tier
  if (
    normalizedType.includes('bio-allied') || 
    normalizedType.includes('bio allied') ||
    normalizedType.includes('manufacturing') || 
    normalizedType.includes('prototyping') ||
    normalizedType.includes('software') || 
    normalizedType.includes('saas') ||
    normalizedType.includes('raw space lab') ||
    normalizedType.includes('raw-space-lab')
  ) {
    return 10;
  }
  
  // 50Rs Tier
  if (
    normalizedType.includes('studio') || 
    normalizedType.includes('meeting')
  ) {
    return 50;
  }
  
  // Default Tier
  return 30;
}