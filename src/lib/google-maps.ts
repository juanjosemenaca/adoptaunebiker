export function googleMapsBrowserKey() {
  return (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "").trim();
}

declare global {
  interface Window {
    google?: typeof google;
  }
}

let loading: Promise<typeof google.maps> | null = null;

export function loadGoogleMaps(key: string, locale = "es") {
  if (typeof window === "undefined") return Promise.reject(new Error("window"));
  if (window.google?.maps?.Map && window.google.maps.places) {
    return Promise.resolve(window.google.maps);
  }
  if (loading) return loading;
  const language = locale.slice(0, 2);
  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&v=weekly&language=${encodeURIComponent(language)}&region=ES`;
    script.async = true;
    script.onload = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else {
        loading = null;
        reject(new Error("maps"));
      }
    };
    script.onerror = () => {
      loading = null;
      reject(new Error("maps"));
    };
    document.head.appendChild(script);
  });
  return loading;
}
