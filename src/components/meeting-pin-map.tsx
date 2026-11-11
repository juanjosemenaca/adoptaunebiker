"use client";

import { useEffect, useRef, useState } from "react";
import { googleMapsBrowserKey, loadGoogleMaps } from "@/lib/google-maps";
import { googleMapsEmbedUrl, parseMapsPin, type MeetingPin } from "@/lib/meeting-pin";

const DEFAULT_CENTER = { lat: 41.3874, lng: 2.1686 };

type Props = {
  pin: MeetingPin | null;
  query?: string;
  locale?: string;
  editable?: boolean;
  searchPlaceholder?: string;
  onPin?: (pin: MeetingPin | null) => void;
  onPlaceName?: (name: string) => void;
};

export function MeetingPinMap({
  pin,
  query = "",
  locale = "es",
  editable = false,
  searchPlaceholder = "",
  onPin,
  onPlaceName,
}: Props) {
  const key = googleMapsBrowserKey();
  const node = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const pinRef = useRef(pin);
  const onPinRef = useRef(onPin);
  const onPlaceNameRef = useRef(onPlaceName);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [embedQuery, setEmbedQuery] = useState("");
  const useJsMap = Boolean(editable && key && !failed);
  pinRef.current = pin;
  onPinRef.current = onPin;
  onPlaceNameRef.current = onPlaceName;

  useEffect(() => {
    if (!editable || !key) return;
    let cancelled = false;
    const listeners: google.maps.MapsEventListener[] = [];

    void loadGoogleMaps(key, locale)
      .then((maps) => {
        if (cancelled || !node.current) return;
        const start = pinRef.current ?? DEFAULT_CENTER;
        const map = new maps.Map(node.current, {
          center: start,
          zoom: pinRef.current ? 16 : 12,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          gestureHandling: "greedy",
          clickableIcons: true,
        });
        mapRef.current = map;

        const placeMarker = (next: MeetingPin) => {
          if (markerRef.current) {
            markerRef.current.setPosition(next);
          } else {
            const marker = new maps.Marker({
              map,
              position: next,
              draggable: true,
              animation: maps.Animation.DROP,
            });
            markerRef.current = marker;
            listeners.push(
              marker.addListener("dragend", () => {
                const pos = marker.getPosition();
                if (!pos) return;
                const dropped = roundPin(pos.lat(), pos.lng());
                onPinRef.current?.(dropped);
              }),
            );
          }
          map.panTo(next);
          if ((map.getZoom() ?? 12) < 15) map.setZoom(16);
        };

        if (pinRef.current) placeMarker(pinRef.current);

        listeners.push(
          map.addListener("click", (event: google.maps.MapMouseEvent) => {
            if (!event.latLng) return;
            const next = roundPin(event.latLng.lat(), event.latLng.lng());
            placeMarker(next);
            onPinRef.current?.(next);
          }),
        );

        if (searchRef.current) {
          const autocomplete = new maps.places.Autocomplete(searchRef.current, {
            fields: ["geometry", "name", "formatted_address"],
          });
          autocomplete.bindTo("bounds", map);
          listeners.push(
            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              const loc = place.geometry?.location;
              if (!loc) return;
              const next = roundPin(loc.lat(), loc.lng());
              placeMarker(next);
              map.setZoom(17);
              onPinRef.current?.(next);
              const name = (place.name || place.formatted_address || "").slice(0, 120);
              if (name) {
                setSearch(name);
                onPlaceNameRef.current?.(name);
              }
            }),
          );
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      listeners.forEach((item) => item.remove());
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapRef.current = null;
    };
  }, [editable, key, locale]);

  useEffect(() => {
    const timer = window.setTimeout(() => setEmbedQuery(search), 450);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map) return;
    if (!pin) {
      marker?.setMap(null);
      markerRef.current = null;
      return;
    }
    if (marker) {
      marker.setPosition(pin);
      map.panTo(pin);
      return;
    }
  }, [pin]);

  function applySearch(value: string) {
    setSearch(value);
    const fromLink = parseMapsPin(value);
    if (fromLink) {
      onPin?.(fromLink);
      mapRef.current?.panTo(fromLink);
      markerRef.current?.setPosition(fromLink);
      return;
    }
    if (!useJsMap && value.trim()) onPlaceName?.(value.trim().slice(0, 120));
  }

  const embed = googleMapsEmbedUrl(
    pin,
    embedQuery.trim() || query.trim() || "Barcelona, España",
    locale,
  );

  return (
    <div className="space-y-2">
      {editable ? (
        <input
          ref={searchRef}
          value={search}
          onChange={(event) => applySearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
          placeholder={searchPlaceholder}
          autoComplete="off"
          className="min-h-11 w-full border border-line bg-asphalt px-3 py-2 text-sm text-bone"
        />
      ) : null}
      <div className="google-meeting-map overflow-hidden border border-line bg-panel">
        {useJsMap ? (
          <div ref={node} className="h-80 w-full sm:h-96" />
        ) : embed ? (
          <iframe
            title="Google Maps"
            src={embed}
            className="h-80 w-full sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="h-80 w-full bg-panel sm:h-96" />
        )}
      </div>
    </div>
  );
}

function roundPin(lat: number, lng: number): MeetingPin {
  return { lat: Math.round(lat * 1e6) / 1e6, lng: Math.round(lng * 1e6) / 1e6 };
}

