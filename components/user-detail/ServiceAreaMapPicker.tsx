"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiCloseLine,
  RiLoader4Line,
  RiMapPinLine,
} from "react-icons/ri";

// ── Google Maps script loader (singleton) ─────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    __gmapsInit?: () => void;
  }
}

let gmapsReady = false;
let gmapsLoading = false;
const gmapsQueue: (() => void)[] = [];

function loadGoogleMaps(apiKey: string, onReady: () => void) {
  // Already fully loaded
  if (gmapsReady || window.google?.maps) {
    gmapsReady = true;
    onReady();
    return;
  }
  gmapsQueue.push(onReady);
  // Script tag already in DOM (e.g. Strict Mode double-effect) — just wait
  if (gmapsLoading || document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
    gmapsLoading = true;
    return;
  }
  gmapsLoading = true;
  window.__gmapsInit = () => {
    gmapsReady = true;
    gmapsLoading = false;
    gmapsQueue.forEach((cb) => cb());
    gmapsQueue.length = 0;
  };
  const s = document.createElement("script");
  s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__gmapsInit`;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

// ── Component ──────────────────────────────────────────────────────────────────

interface ServiceAreaMapPickerProps {
  initialLocation?: { latitude: number; longitude: number };
  initialServiceArea?: string;
  onConfirm: (serviceArea: string, latitude: number, longitude: number) => void;
  onClose: () => void;
}

export function ServiceAreaMapPicker({
  initialLocation,
  initialServiceArea,
  onConfirm,
  onClose,
}: ServiceAreaMapPickerProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const [address, setAddress] = useState(initialServiceArea ?? "");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    initialLocation
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : null
  );
  const [mapReady, setMapReady] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  const reverseGeocode = async (lat: number, lng: number) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json() as { display_name?: string };
      setAddress(data.display_name ?? "");
    } catch {
      setAddress("");
    } finally {
      setGeocoding(false);
    }
  };

  const initMap = () => {
    if (!mapDivRef.current || mapRef.current) return;

    const defaultCenter = coords ?? { lat: 41.9028, lng: 12.4964 }; // Rome

    const map = new window.google.maps.Map(mapDivRef.current, {
      center: defaultCenter,
      zoom: coords ? 13 : 6,
      disableDefaultUI: true,
      zoomControl: true,
      clickableIcons: false,
    });

    const marker = new window.google.maps.Marker({
      position: defaultCenter,
      map,
      draggable: true,
    });

    mapRef.current = map;
    markerRef.current = marker;

    // If no initial location, try browser geolocation
    if (!coords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(loc);
        map.setZoom(13);
        marker.setPosition(loc);
        setCoords(loc);
        reverseGeocode(loc.lat, loc.lng);
      });
    } else if (coords) {
      reverseGeocode(coords.lat, coords.lng);
    }

    map.addListener("click", (e: { latLng: { lat: () => number; lng: () => number } }) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition({ lat, lng });
      setCoords({ lat, lng });
      reverseGeocode(lat, lng);
    });

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      const lat = pos.lat();
      const lng = pos.lng();
      setCoords({ lat, lng });
      reverseGeocode(lat, lng);
    });

    setMapReady(true);
  };

  useEffect(() => {
    loadGoogleMaps(apiKey, initMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleConfirm = () => {
    if (!coords || !address) return;
    onConfirm(address, coords.lat, coords.lng);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl flex flex-col"
        style={{ height: "520px" }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <RiMapPinLine size={15} className="text-[var(--primary)]" />
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Select Service Area
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
          >
            <RiCloseLine size={16} />
          </button>
        </div>

        {/* Map container */}
        <div className="relative flex-1">
          <div ref={mapDivRef} className="absolute inset-0" />
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-alt)]">
              <RiLoader4Line
                className="animate-spin text-[var(--primary)]"
                size={24}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[var(--border)]/60 flex-shrink-0 space-y-2.5 bg-[var(--surface)]">
          {/* Selected address */}
          <div className="flex items-center gap-2 min-h-[18px]">
            <RiMapPinLine
              size={13}
              className="text-[var(--primary)] flex-shrink-0"
            />
            {geocoding ? (
              <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
                <RiLoader4Line className="animate-spin" size={11} />
                Getting address…
              </span>
            ) : address ? (
              <span className="text-xs text-[var(--text-secondary)] line-clamp-1">
                {address}
              </span>
            ) : (
              <span className="text-xs text-[var(--text-tertiary)]">
                Tap the map to pick a location
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!coords || !address || geocoding}
              className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
