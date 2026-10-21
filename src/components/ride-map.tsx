"use client";

import { useEffect, useRef } from "react";
import { decodePolyline } from "@/lib/polyline";
import "leaflet/dist/leaflet.css";

export function RideMap({ polyline }: { polyline: string }) {
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = node.current;
    if (!el) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    void import("leaflet").then((mod) => {
      if (cancelled || !node.current) return;
      const L = (mod.default ?? mod) as typeof import("leaflet");
      const points = decodePolyline(polyline);
      map = L.map(node.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);
      if (points.length >= 2) {
        const line = L.polyline(points, { color: "#e67812", weight: 3, opacity: 0.95 });
        line.addTo(map);
        map.fitBounds(line.getBounds(), { padding: [18, 18] });
      } else {
        map.setView([40.4168, -3.7038], 5);
      }
      if (cancelled) {
        map.remove();
        map = undefined;
      }
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [polyline]);

  return <div ref={node} className="ride-map h-72 w-full border border-line bg-panel" />;
}
