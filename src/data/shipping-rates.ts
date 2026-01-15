/**
 * Static shipping rates data
 * Origin: Surabaya
 * Rates in IDR
 */

export interface City {
  id: string;
  name: string;
  province: string;
  type?: "Kota" | "Kabupaten";
}

export interface ShippingRate {
  service: string;
  description: string;
  cost: number;
  etd: string; // Estimated Time Delivery in days
}

export interface CourierRates {
  [courier: string]: ShippingRate[];
}

// Daftar kota tujuan diperluas
export const CITIES: City[] = [
  // Jawa Timur
  { id: "surabaya", name: "Surabaya", province: "Jawa Timur" },
  { id: "malang", name: "Malang", province: "Jawa Timur" },
  { id: "sidoarjo", name: "Sidoarjo", province: "Jawa Timur" },
  { id: "gresik", name: "Gresik", province: "Jawa Timur" },
  { id: "mojokerto", name: "Mojokerto", province: "Jawa Timur" },
  { id: "jember", name: "Jember", province: "Jawa Timur" },
  { id: "kediri", name: "Kediri", province: "Jawa Timur" },
  { id: "probolinggo", name: "Probolinggo", province: "Jawa Timur" },
  { id: "pasuruan", name: "Pasuruan", province: "Jawa Timur" },
  { id: "madiun", name: "Madiun", province: "Jawa Timur" },
  { id: "banyuwangi", name: "Banyuwangi", province: "Jawa Timur" },
  { id: "tuban", name: "Tuban", province: "Jawa Timur" },

  // Jawa Tengah & DIY
  { id: "semarang", name: "Semarang", province: "Jawa Tengah" },
  { id: "solo", name: "Solo", province: "Jawa Tengah" },
  { id: "yogyakarta", name: "Yogyakarta", province: "DI Yogyakarta" },
  { id: "magelang", name: "Magelang", province: "Jawa Tengah" },
  { id: "purwokerto", name: "Purwokerto", province: "Jawa Tengah" },
  { id: "tegal", name: "Tegal", province: "Jawa Tengah" },
  { id: "cilacap", name: "Cilacap", province: "Jawa Tengah" },
  { id: "kudus", name: "Kudus", province: "Jawa Tengah" },

  // Jawa Barat & Banten
  { id: "bandung", name: "Bandung", province: "Jawa Barat" },
  { id: "bogor", name: "Bogor", province: "Jawa Barat" },
  { id: "depok", name: "Depok", province: "Jawa Barat" },
  { id: "bekasi", name: "Bekasi", province: "Jawa Barat" },
  { id: "cirebon", name: "Cirebon", province: "Jawa Barat" },
  { id: "sukabumi", name: "Sukabumi", province: "Jawa Barat" },
  { id: "tasikmalaya", name: "Tasikmalaya", province: "Jawa Barat" },
  { id: "tangerang", name: "Tangerang", province: "Banten" },
  { id: "serang", name: "Serang", province: "Banten" },
  { id: "cilegon", name: "Cilegon", province: "Banten" },

  // DKI Jakarta
  { id: "jakarta_pusat", name: "Jakarta Pusat", province: "DKI Jakarta" },
  { id: "jakarta_selatan", name: "Jakarta Selatan", province: "DKI Jakarta" },
  { id: "jakarta_barat", name: "Jakarta Barat", province: "DKI Jakarta" },
  { id: "jakarta_timur", name: "Jakarta Timur", province: "DKI Jakarta" },
  { id: "jakarta_utara", name: "Jakarta Utara", province: "DKI Jakarta" },

  // Bali & Nusa Tenggara
  { id: "denpasar", name: "Denpasar", province: "Bali" },
  { id: "gianyar", name: "Gianyar", province: "Bali" },
  { id: "mataram", name: "Mataram", province: "Nusa Tenggara Barat" },
  { id: "kupang", name: "Kupang", province: "Nusa Tenggara Timur" },

  // Kalimantan
  { id: "balikpapan", name: "Balikpapan", province: "Kalimantan Timur" },
  { id: "samarinda", name: "Samarinda", province: "Kalimantan Timur" },
  { id: "banjarmasin", name: "Banjarmasin", province: "Kalimantan Selatan" },
  { id: "pontianak", name: "Pontianak", province: "Kalimantan Barat" },
  { id: "palangkaraya", name: "Palangkaraya", province: "Kalimantan Tengah" },
  { id: "tarakan", name: "Tarakan", province: "Kalimantan Utara" },

  // Sulawesi
  { id: "makassar", name: "Makassar", province: "Sulawesi Selatan" },
  { id: "manado", name: "Manado", province: "Sulawesi Utara" },
  { id: "palu", name: "Palu", province: "Sulawesi Tengah" },
  { id: "kendari", name: "Kendari", province: "Sulawesi Tenggara" },
  { id: "gorontalo", name: "Gorontalo", province: "Gorontalo" },

  // Sumatera
  { id: "medan", name: "Medan", province: "Sumatera Utara" },
  { id: "palembang", name: "Palembang", province: "Sumatera Selatan" },
  { id: "pekanbaru", name: "Pekanbaru", province: "Riau" },
  { id: "lampung", name: "Bandar Lampung", province: "Lampung" },
  { id: "padang", name: "Padang", province: "Sumatera Barat" },
  { id: "jambi", name: "Jambi", province: "Jambi" },
  { id: "bengkulu", name: "Bengkulu", province: "Bengkulu" },
  { id: "aceh", name: "Banda Aceh", province: "Aceh" },
  { id: "batam", name: "Batam", province: "Kepulauan Riau" },
  { id: "pangkalpinang", name: "Pangkal Pinang", province: "Bangka Belitung" },

  // Maluku & Papua
  { id: "ambon", name: "Ambon", province: "Maluku" },
  { id: "ternate", name: "Ternate", province: "Maluku Utara" },
  { id: "jayapura", name: "Jayapura", province: "Papua" },
  { id: "sorong", name: "Sorong", province: "Papua Barat" },
  { id: "merauke", name: "Merauke", province: "Papua Selatan" },
];

// Base rates per kg dari Surabaya (Estimasi Logistik Reguler)
const BASE_RATES_PER_KG: { [cityId: string]: number } = {
  // Jawa Timur
  surabaya: 5000,
  sidoarjo: 6000,
  gresik: 7000,
  mojokerto: 8000,
  pasuruan: 9000,
  malang: 10000,
  probolinggo: 12000,
  kediri: 12000,
  madiun: 13000,
  jember: 15000,
  tuban: 14000,
  banyuwangi: 18000,

  // Jawa Tengah & DIY
  semarang: 15000,
  solo: 13000,
  yogyakarta: 14000,
  magelang: 15000,
  kudus: 16000,
  purwokerto: 17000,
  tegal: 18000,
  cilacap: 19000,

  // Jawa Barat, Banten & Jakarta
  jakarta_pusat: 20000,
  jakarta_selatan: 20000,
  jakarta_barat: 20000,
  jakarta_timur: 20000,
  jakarta_utara: 20000,
  bekasi: 21000,
  depok: 21000,
  bogor: 21000,
  tangerang: 21000,
  bandung: 19000,
  cirebon: 17000,
  tasikmalaya: 22000,
  serang: 23000,

  // Bali & Nusa Tenggara
  denpasar: 18000,
  gianyar: 20000,
  mataram: 22000,
  kupang: 45000,

  // Kalimantan
  banjarmasin: 30000,
  balikpapan: 32000,
  samarinda: 35000,
  pontianak: 38000,
  palangkaraya: 36000,
  tarakan: 48000,

  // Sulawesi
  makassar: 35000,
  manado: 50000,
  palu: 45000,
  kendari: 48000,
  gorontalo: 52000,

  // Sumatera
  lampung: 28000,
  palembang: 32000,
  jambi: 35000,
  pekanbaru: 38000,
  padang: 40000,
  medan: 45000,
  aceh: 55000,
  batam: 42000,
  bengkulu: 38000,

  // Maluku & Papua
  ambon: 65000,
  ternate: 70000,
  jayapura: 95000,
  sorong: 90000,
  merauke: 110000,
};

/**
 * Calculate shipping cost based on weight and destination
 */
export function calculateShippingCost(
  destinationId: string,
  weightInGrams: number,
  courier: string
): ShippingRate[] {
  const baseRate = BASE_RATES_PER_KG[destinationId.toLowerCase()] || 20000;
  const weightInKg = weightInGrams / 1000;

  // Minimum 1kg untuk perhitungan
  const chargeableWeight = Math.max(1, Math.ceil(weightInKg));

  const baseCost = baseRate * chargeableWeight;

  // Different courier services with different pricing
  const rates: { [key: string]: ShippingRate[] } = {
    jne: [
      {
        service: "REG",
        description: "Layanan Reguler",
        cost: Math.round(baseCost * 1.0),
        etd: "2-3",
      },
      {
        service: "YES",
        description: "Yakin Esok Sampai",
        cost: Math.round(baseCost * 1.5),
        etd: "1-1",
      },
      {
        service: "OKE",
        description: "Ongkos Kirim Ekonomis",
        cost: Math.round(baseCost * 0.8),
        etd: "3-5",
      },
    ],
    jnt: [
      {
        service: "EZ",
        description: "Ekonomis",
        cost: Math.round(baseCost * 0.75),
        etd: "3-5",
      },
      {
        service: "REG",
        description: "Reguler",
        cost: Math.round(baseCost * 0.95),
        etd: "2-3",
      },
    ],
    sicepat: [
      {
        service: "REG",
        description: "Reguler",
        cost: Math.round(baseCost * 0.9),
        etd: "2-3",
      },
      {
        service: "BEST",
        description: "Best",
        cost: Math.round(baseCost * 1.2),
        etd: "1-2",
      },
      {
        service: "HALU",
        description: "Halu",
        cost: Math.round(baseCost * 0.7),
        etd: "4-6",
      },
    ],
    anteraja: [
      {
        service: "REG",
        description: "Reguler",
        cost: Math.round(baseCost * 0.85),
        etd: "2-4",
      },
      {
        service: "NEXT",
        description: "Next Day",
        cost: Math.round(baseCost * 1.3),
        etd: "1-1",
      },
    ],
    ninja: [
      {
        service: "REG",
        description: "Reguler",
        cost: Math.round(baseCost * 0.88),
        etd: "2-3",
      },
      {
        service: "INSTANT",
        description: "Instant",
        cost: Math.round(baseCost * 1.4),
        etd: "1-1",
      },
    ],
    idexpress: [
      {
        service: "REG",
        description: "Reguler",
        cost: Math.round(baseCost * 0.92),
        etd: "2-4",
      },
      {
        service: "CARGO",
        description: "Cargo",
        cost: Math.round(baseCost * 0.65),
        etd: "5-7",
      },
    ],
  };

  return rates[courier.toLowerCase()] || rates.jne;
}

/**
 * Get all available cities
 */
export function getCities(): City[] {
  return CITIES;
}

/**
 * Find city by name (case insensitive, partial match)
 */
export function findCityByName(cityName: string): City | undefined {
  const searchTerm = cityName.toLowerCase().trim();
  return CITIES.find(
    (city) =>
      city.name.toLowerCase().includes(searchTerm) ||
      searchTerm.includes(city.name.toLowerCase())
  );
}
