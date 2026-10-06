import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export const OTHER_PLACE = "other";

export type CountryPlace = {
  id: string;
  name: Record<Locale, string>;
  cities: string[];
};

function names(es: string, ca: string, en: string, fr: string, de: string): Record<Locale, string> {
  return { es, ca, en, fr, de };
}

export const COUNTRIES: CountryPlace[] = [
  {
    id: "es",
    name: names("España", "Espanya", "Spain", "Espagne", "Spanien"),
    cities: [
      "Madrid",
      "Barcelona",
      "Valencia",
      "Sevilla",
      "Zaragoza",
      "Málaga",
      "Bilbao",
      "Palma",
      "Alicante",
      "Murcia",
      "Granada",
      "Córdoba",
      "Valladolid",
      "Vigo",
      "Gijón",
      "San Sebastián",
      "Pamplona",
      "Santander",
      "Girona",
      "Tarragona",
      "Logroño",
    ],
  },
  {
    id: "ad",
    name: names("Andorra", "Andorra", "Andorra", "Andorre", "Andorra"),
    cities: ["Andorra la Vella", "Escaldes-Engordany", "Encamp", "La Massana", "Ordino"],
  },
  {
    id: "mx",
    name: names("México", "Mèxic", "Mexico", "Mexique", "Mexiko"),
    cities: [
      "Ciudad de México",
      "Guadalajara",
      "Monterrey",
      "Puebla",
      "Querétaro",
      "Mérida",
      "Tijuana",
      "León",
      "Cancún",
    ],
  },
  {
    id: "ar",
    name: names("Argentina", "Argentina", "Argentina", "Argentine", "Argentinien"),
    cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Tucumán", "Mar del Plata", "Salta"],
  },
  {
    id: "co",
    name: names("Colombia", "Colòmbia", "Colombia", "Colombie", "Kolumbien"),
    cities: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira"],
  },
  {
    id: "cl",
    name: names("Chile", "Xile", "Chile", "Chili", "Chile"),
    cities: ["Santiago", "Valparaíso", "Viña del Mar", "Concepción", "La Serena", "Antofagasta", "Temuco"],
  },
  {
    id: "pe",
    name: names("Perú", "Perú", "Peru", "Pérou", "Peru"),
    cities: ["Lima", "Arequipa", "Cusco", "Trujillo", "Chiclayo", "Piura"],
  },
  {
    id: "uy",
    name: names("Uruguay", "Uruguai", "Uruguay", "Uruguay", "Uruguay"),
    cities: ["Montevideo", "Punta del Este", "Salto", "Paysandú", "Maldonado"],
  },
  {
    id: "ec",
    name: names("Ecuador", "Equador", "Ecuador", "Équateur", "Ecuador"),
    cities: ["Quito", "Guayaquil", "Cuenca", "Loja", "Ambato"],
  },
  {
    id: "cr",
    name: names("Costa Rica", "Costa Rica", "Costa Rica", "Costa Rica", "Costa Rica"),
    cities: ["San José", "Alajuela", "Cartago", "Heredia", "Liberia"],
  },
  {
    id: "fr",
    name: names("Francia", "França", "France", "France", "Frankreich"),
    cities: [
      "París",
      "Lyon",
      "Marsella",
      "Toulouse",
      "Burdeos",
      "Niza",
      "Nantes",
      "Estrasburgo",
      "Lille",
      "Montpellier",
      "Grenoble",
      "Annecy",
    ],
  },
  {
    id: "be",
    name: names("Bélgica", "Bèlgica", "Belgium", "Belgique", "Belgien"),
    cities: ["Bruselas", "Amberes", "Gante", "Lieja", "Brujas", "Lovaina", "Namur"],
  },
  {
    id: "ch",
    name: names("Suiza", "Suïssa", "Switzerland", "Suisse", "Schweiz"),
    cities: ["Zúrich", "Ginebra", "Basilea", "Berna", "Lausana", "Lucerna", "Lugano"],
  },
  {
    id: "lu",
    name: names("Luxemburgo", "Luxemburg", "Luxembourg", "Luxembourg", "Luxemburg"),
    cities: ["Luxemburgo", "Esch-sur-Alzette", "Differdange"],
  },
  {
    id: "mc",
    name: names("Mónaco", "Mònaco", "Monaco", "Monaco", "Monaco"),
    cities: ["Mónaco"],
  },
  {
    id: "de",
    name: names("Alemania", "Alemanya", "Germany", "Allemagne", "Deutschland"),
    cities: [
      "Berlín",
      "Múnich",
      "Hamburgo",
      "Colonia",
      "Fráncfort",
      "Stuttgart",
      "Düsseldorf",
      "Leipzig",
      "Dresde",
      "Hannover",
      "Friburgo",
    ],
  },
  {
    id: "at",
    name: names("Austria", "Àustria", "Austria", "Autriche", "Österreich"),
    cities: ["Viena", "Graz", "Linz", "Salzburgo", "Innsbruck", "Klagenfurt"],
  },
  {
    id: "li",
    name: names("Liechtenstein", "Liechtenstein", "Liechtenstein", "Liechtenstein", "Liechtenstein"),
    cities: ["Vaduz", "Schaan"],
  },
  {
    id: "gb",
    name: names("Reino Unido", "Regne Unit", "United Kingdom", "Royaume-Uni", "Vereinigtes Königreich"),
    cities: [
      "Londres",
      "Manchester",
      "Birmingham",
      "Edimburgo",
      "Glasgow",
      "Liverpool",
      "Bristol",
      "Leeds",
      "Cardiff",
      "Belfast",
    ],
  },
  {
    id: "ie",
    name: names("Irlanda", "Irlanda", "Ireland", "Irlande", "Irland"),
    cities: ["Dublín", "Cork", "Galway", "Limerick", "Waterford"],
  },
  {
    id: "us",
    name: names("Estados Unidos", "Estats Units", "United States", "États-Unis", "Vereinigte Staaten"),
    cities: [
      "Nueva York",
      "Los Ángeles",
      "Chicago",
      "San Francisco",
      "Seattle",
      "Boston",
      "Austin",
      "Denver",
      "Miami",
      "Portland",
    ],
  },
  {
    id: "can",
    name: names("Canadá", "Canadà", "Canada", "Canada", "Kanada"),
    cities: ["Montreal", "Toronto", "Vancouver", "Ottawa", "Calgary", "Quebec", "Edmonton"],
  },
  {
    id: "au",
    name: names("Australia", "Austràlia", "Australia", "Australie", "Australien"),
    cities: ["Sídney", "Melbourne", "Brisbane", "Perth", "Adelaida", "Canberra"],
  },
  {
    id: "nz",
    name: names("Nueva Zelanda", "Nova Zelanda", "New Zealand", "Nouvelle-Zélande", "Neuseeland"),
    cities: ["Auckland", "Wellington", "Christchurch", "Hamilton", "Dunedin"],
  },
  {
    id: "za",
    name: names("Sudáfrica", "Sud-àfrica", "South Africa", "Afrique du Sud", "Südafrika"),
    cities: ["Ciudad del Cabo", "Johannesburgo", "Durban", "Pretoria", "Port Elizabeth"],
  },
];

export function placeLocale(locale: string): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

export function countryById(id: string) {
  return COUNTRIES.find((item) => item.id === id) ?? null;
}

export function countryLabel(id: string, locale: string) {
  const country = countryById(id);
  if (!country) return "";
  return country.name[placeLocale(locale)];
}

export function storedCountryName(countryId: string, countryOther: string) {
  if (countryId === OTHER_PLACE || !countryId) return countryOther.trim();
  return countryById(countryId)?.name.es ?? countryOther.trim();
}

export function storedCityName(countryId: string, cityId: string, cityOther: string) {
  const typed = cityOther.trim();
  if (countryId === OTHER_PLACE || cityId === OTHER_PLACE || !cityId) return typed;
  const country = countryById(countryId);
  if (!country?.cities.includes(cityId)) return typed;
  return cityId;
}

export function formatSignupPlace(city: string, country: string) {
  if (city && country) return `${city} · ${country}`;
  return city || country;
}
