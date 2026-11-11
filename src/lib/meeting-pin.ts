export type MeetingPin = { lat: number; lng: number };

const PAIR = /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/;

export function parseMeetingCoords(latRaw: string, lngRaw: string): MeetingPin | null {
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  if (lat === 0 && lng === 0) return null;
  return { lat: roundCoord(lat), lng: roundCoord(lng) };
}

export function parseMapsPin(raw: string): MeetingPin | null {
  const text = raw.trim();
  if (!text) return null;
  const pair = text.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (pair) return parseMeetingCoords(pair[1], pair[2]);
  const at = text.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) return parseMeetingCoords(at[1], at[2]);
  try {
    const url = new URL(text);
    const query =
      url.searchParams.get("q") ||
      url.searchParams.get("query") ||
      url.searchParams.get("ll") ||
      url.searchParams.get("destination") ||
      url.searchParams.get("center");
    if (query) {
      const match = query.match(PAIR);
      if (match) return parseMeetingCoords(match[1], match[2]);
    }
    const path = url.pathname.match(PAIR);
    if (path) return parseMeetingCoords(path[1], path[2]);
  } catch {
    return null;
  }
  return null;
}

export function googleMapsPinUrl(pin: MeetingPin) {
  return `https://www.google.com/maps?q=${pin.lat},${pin.lng}`;
}

export function googleMapsOpenUrl(pin: MeetingPin | null, query = "") {
  if (pin) return googleMapsPinUrl(pin);
  const text = query.trim();
  return text ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}` : "";
}

export function googleMapsEmbedUrl(pin: MeetingPin | null, query = "", locale = "es") {
  const hl = locale.slice(0, 2);
  const q = pin ? `${pin.lat},${pin.lng}` : query.trim();
  if (!q) return "";
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&hl=${hl}&output=embed`;
}

function roundCoord(value: number) {
  return Math.round(value * 1e6) / 1e6;
}
