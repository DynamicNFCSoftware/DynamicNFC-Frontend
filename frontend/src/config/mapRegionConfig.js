const BASE_MAP_REGION_DATA = {
  canada: {
    reg: "Canada · Vancouver",
    city: "Vancouver",
    code: "CAN",
    accent: "#457b9d",
    gold: "#b8860b",
    coords: { lat: "49.28° N", lng: "123.12° W", short: "49.3N / 123.1W" },
    miniMap: { x: 38, y: 30, countryId: "mm-canada" },
  },
  gulf: {
    reg: "Gulf · Riyadh",
    city: "Riyadh",
    code: "SAU",
    accent: "#b8860b",
    gold: "#b8860b",
    coords: { lat: "24.71° N", lng: "46.67° E", short: "24.7N / 46.7E" },
    miniMap: { x: 130, y: 54, countryId: "mm-gulf" },
  },
  usa: {
    reg: "USA · Miami Beach",
    city: "Miami",
    code: "USA",
    accent: "#1e3a8a",
    gold: "#c7302f",
    coords: { lat: "25.79° N", lng: "80.13° W", short: "25.8N / 80.1W" },
    miniMap: { x: 53, y: 56, countryId: "mm-usa" },
  },
  mexico: {
    reg: "Mexico · San Miguel",
    city: "San Miguel",
    code: "MEX",
    accent: "#006341",
    gold: "#c7302f",
    coords: { lat: "20.91° N", lng: "100.74° W", short: "20.9N / 100.7W" },
    miniMap: { x: 42, y: 72, countryId: "mm-mexico" },
  },
};

const REAL_ESTATE_PROJECTS = {
  canada: "Vista Residences",
  gulf: "Al Noor Residences",
  usa: "Skyline Towers",
  mexico: "Residencias del Sol",
};

const AUTOMOTIVE_REGION_META = {
  canada: { proj: "Cascade British Motors", model: "BENTLEY · BENTAYGA SPEED" },
  gulf: { proj: "Al Noor Prestige", model: "ROLLS-ROYCE · PHANTOM VIII" },
  usa: { proj: "Liberty British Motors", model: "ASTON MARTIN · DB12" },
  mexico: { proj: "Motores Colonial", model: "JAGUAR · E-TYPE SERIES 1 · 1968" },
};

function mergeWithBase(overridesByRegion) {
  return Object.fromEntries(
    Object.entries(BASE_MAP_REGION_DATA).map(([regionId, base]) => [
      regionId,
      { ...base, ...(overridesByRegion[regionId] || {}) },
    ])
  );
}

export function getRealEstateMapRegionData() {
  return mergeWithBase(
    Object.fromEntries(
      Object.entries(REAL_ESTATE_PROJECTS).map(([regionId, proj]) => [regionId, { proj }])
    )
  );
}

export function getAutomotiveMapRegionData() {
  return mergeWithBase(AUTOMOTIVE_REGION_META);
}
