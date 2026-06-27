"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { climateAPI } from "@/services/api";
import type { MonthlyDataPoint, MapLayer, BaseMapId, VisMode } from "@/types";
import { idwGridMercator, krigingGridMercator, classifyGrid } from "@/utils/interpolation";

const CENTER: [number, number] = [78.9629, 20.5937];
const ZOOM = 5;
const MIN_ZOOM = 4;
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [65, 4],
  [100, 39],
];

const BASE_MAP_TILES: Record<
  BaseMapId,
  { tiles: string[]; attribution: string }
> = {
  clear_view: {
    tiles: [
      "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      "https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      "https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    ],
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  street: {
    tiles: [
      "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    ],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
  natural_earth: {
    tiles: [
      "https://a.tiles.wmflabs.org/natural-earth/{z}/{x}/{y}.jpg",
      "https://b.tiles.wmflabs.org/natural-earth/{z}/{x}/{y}.jpg",
    ],
    attribution:
      '&copy; <a href="https://www.naturalearthdata.com/">Natural Earth</a>',
  },
  black_marble: {
    tiles: [
      "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      "https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      "https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    ],
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  true_marble: {
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    attribution: '&copy; <a href="https://www.esri.com/">ESRI</a>',
  },
  natural: {
    tiles: [
      "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
      "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
      "https://c.tile.opentopomap.org/{z}/{x}/{y}.png",
    ],
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
  },
};

const LABEL_TILES = [
  "https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
  "https://b.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
  "https://c.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
];

function rainfallColor(value: number): string {
  if (value <= 0) return "#f0f9ff";
  if (value < 5) return "#e0f2fe";
  if (value < 15) return "#bae6fd";
  if (value < 30) return "#7dd3fc";
  if (value < 60) return "#38bdf8";
  if (value < 100) return "#0ea5e9";
  if (value < 150) return "#0284c7";
  if (value < 250) return "#0369a1";
  if (value < 400) return "#075985";
  if (value < 600) return "#0c4a6e";
  return "#082f49";
}

function tempColor(value: number, layer: MapLayer): string {
  if (layer === "minTemp") {
    if (value <= 5) return "#0c4a6e";
    if (value <= 10) return "#0369a1";
    if (value <= 15) return "#0284c7";
    if (value <= 20) return "#0ea5e9";
    if (value <= 25) return "#38bdf8";
    if (value <= 30) return "#7dd3fc";
    return "#bae6fd";
  }
  if (value <= 20) return "#bbf7d0";
  if (value <= 25) return "#86efac";
  if (value <= 30) return "#4ade80";
  if (value <= 35) return "#fcd34d";
  if (value <= 38) return "#fb923c";
  if (value <= 40) return "#f97316";
  return "#dc2626";
}

function contourBandColor(band: number, layer: MapLayer): string {
  if (layer === "rainfall") {
    const colors = ["#f0f9ff","#e0f2fe","#bae6fd","#7dd3fc","#38bdf8","#0ea5e9","#0284c7","#0369a1","#075985","#0c4a6e","#082f49"];
    return colors[Math.min(band, colors.length - 1)] ?? "#082f49";
  }
  if (layer === "minTemp") {
    const colors = ["#bae6fd","#7dd3fc","#38bdf8","#0ea5e9","#0284c7","#0369a1","#0c4a6e"];
    return colors[Math.min(band, colors.length - 1)] ?? "#0c4a6e";
  }
  const colors = ["#bbf7d0","#86efac","#4ade80","#fcd34d","#fb923c","#f97316","#dc2626"];
  return colors[Math.min(band, colors.length - 1)] ?? "#dc2626";
}

const LEGENDS: Record<string, { label: string; color: string }[]> = {
  rainfall: [
    { label: "0", color: "#f0f9ff" },
    { label: "5", color: "#e0f2fe" },
    { label: "15", color: "#bae6fd" },
    { label: "30", color: "#7dd3fc" },
    { label: "60", color: "#38bdf8" },
    { label: "100", color: "#0ea5e9" },
    { label: "150", color: "#0284c7" },
    { label: "250", color: "#0369a1" },
    { label: "400", color: "#075985" },
    { label: "600", color: "#0c4a6e" },
    { label: ">600", color: "#082f49" },
  ],
  minTemp: [
    { label: "<5°C", color: "#0c4a6e" },
    { label: "5-10", color: "#0369a1" },
    { label: "10-15", color: "#0284c7" },
    { label: "15-20", color: "#0ea5e9" },
    { label: "20-25", color: "#38bdf8" },
    { label: "25-30", color: "#7dd3fc" },
    { label: ">30°C", color: "#bae6fd" },
  ],
  maxTemp: [
    { label: "<20°C", color: "#bbf7d0" },
    { label: "20-25", color: "#86efac" },
    { label: "25-30", color: "#4ade80" },
    { label: "30-35", color: "#fcd34d" },
    { label: "35-38", color: "#fb923c" },
    { label: "38-40", color: "#f97316" },
    { label: ">40°C", color: "#dc2626" },
  ],
};

function createStyle(
  baseMap: BaseMapId,
): maplibregl.StyleSpecification {
  const t = BASE_MAP_TILES[baseMap];
  return {
    version: 8,
    sources: {
      basemap: {
        type: "raster",
        tiles: t.tiles,
        tileSize: 256,
        attribution: t.attribution,
      },
    },
    layers: [
      { id: "basemap-layer", type: "raster", source: "basemap" },
    ],
  };
}

export default function IndiaMap({
  year,
  month,
  activeLayer,
  baseMap,
  visMode,
  onLocationSelect,
}: {
  year: number;
  month: number;
  activeLayer: MapLayer;
  baseMap: BaseMapId;
  visMode: VisMode;
  onLocationSelect: (loc: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [data, setData] = useState<MonthlyDataPoint[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const climateUrlRef = useRef<string | null>(null);
  const climateCoordsRef = useRef<[[number, number], [number, number], [number, number], [number, number]] | null>(null);
  const boundaryRef = useRef<number[][][][] | null>(null);

  useEffect(() => {
    fetch("/data/india.json")
      .then((r) => r.json())
      .then((gj) => {
        const feature = gj.features?.[0];
        if (feature?.geometry?.type === "MultiPolygon") {
          boundaryRef.current = feature.geometry.coordinates;
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchMonthly() {
      try {
        const variable =
          activeLayer === "rainfall"
            ? "rainfall"
            : activeLayer === "maxTemp"
              ? "max_temp"
              : "min_temp";
        const response = await climateAPI.getMonthlyData(year, month, variable);
        setData(response.data.filter((d: MonthlyDataPoint) => d.lat && d.lon));
      } catch (err) {
        console.warn("Could not fetch monthly climate data:", err);
        setData([]);
      }
    }
    fetchMonthly();
  }, [year, month, activeLayer]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: createStyle(baseMap),
      center: CENTER,
      zoom: ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: MAX_BOUNDS,
      attributionControl: false,
    });

    map.on("load", () => {
      map.addSource("labels", {
        type: "raster",
        tiles: LABEL_TILES,
        tileSize: 256,
      });
      map.addLayer({ id: "labels-layer", type: "raster", source: "labels" });
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const style = createStyle(baseMap);
    const prevUrl = climateUrlRef.current;
    const prevCoords = climateCoordsRef.current;

    map.setStyle(style);

    map.once("style.load", () => {
      map.addSource("labels", {
        type: "raster",
        tiles: LABEL_TILES,
        tileSize: 256,
      });
      map.addLayer({ id: "labels-layer", type: "raster", source: "labels" });

      if (prevUrl && prevCoords) {
        addClimateOverlay(map, prevUrl, prevCoords);
      }
    });
  }, [baseMap, mapLoaded]);

  function addClimateOverlay(
    map: maplibregl.Map,
    url: string,
    coords: [[number, number], [number, number], [number, number], [number, number]],
  ) {
    if (map.getLayer("climate-layer")) map.removeLayer("climate-layer");
    if (map.getSource("climate")) map.removeSource("climate");

    map.addSource("climate", {
      type: "image",
      url,
      coordinates: coords,
    });
    map.addLayer(
      { id: "climate-layer", type: "raster", source: "climate" },
      "labels-layer",
    );
  }

  useEffect(() => {
    if (data.length < 2 || !mapRef.current || !mapLoaded) return;

    const lats = Array.from(new Set(data.map((d) => d.lat))).sort(
      (a, b) => a - b,
    );
    const lons = Array.from(new Set(data.map((d) => d.lon))).sort(
      (a, b) => a - b,
    );
    const rows = lats.length;
    const cols = lons.length;
    const minLat = lats[0],
      maxLat = lats[rows - 1];
    const minLon = lons[0],
      maxLon = lons[cols - 1];
    const lonMap = new Map(lons.map((v, i) => [v, i]));
    const latMap = new Map(lats.map((v, i) => [v, rows - 1 - i]));
    const isRain = activeLayer === "rainfall";
    const colorFn = isRain ? rainfallColor : (v: number) => tempColor(v, activeLayer);

    const up = 8;
    const w = cols * up,
      h = rows * up;
    const cvs = document.createElement("canvas");
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext("2d")!;

    const mer = (lat: number) =>
      Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
    const merY = lats.map(mer);
    const minMY = merY[0],
      maxMY = merY[rows - 1];
    const myRng = maxMY - minMY;
    const latToY = (lat: number, hh: number) =>
      hh - ((mer(lat) - minMY) / myRng) * hh;

    const rings = boundaryRef.current;
    if (rings) {
      ctx.save();
      ctx.beginPath();
      for (const polygon of rings) {
        for (const ring of polygon) {
          if (ring.length < 3) continue;
          const sx =
            ((ring[0][0] as number) - minLon) / (maxLon - minLon) * w;
          const sy = latToY(ring[0][1] as number, h);
          ctx.moveTo(sx, sy);
          for (let i = 1; i < ring.length; i++) {
            const px =
              ((ring[i][0] as number) - minLon) / (maxLon - minLon) * w;
            const py = latToY(ring[i][1] as number, h);
            ctx.lineTo(px, py);
          }
          ctx.closePath();
        }
      }
      ctx.clip("evenodd");
    }

    if (visMode === "raw_grid") {
      for (const d of data) {
        const col = lonMap.get(d.lon);
        const row = latMap.get(d.lat);
        if (col === undefined || row === undefined) continue;
        const value = isRain
          ? d.rainfall
          : activeLayer === "maxTemp"
            ? d.maxTemp
            : d.minTemp;
        if (value === null || value < 0) continue;
        ctx.fillStyle = colorFn(value);
        const y0 = latToY(d.lat, h);
        const nextLatIdx = rows - 2 - row;
        const nextLat =
          nextLatIdx >= 0
            ? lats[nextLatIdx]
            : lats[0] - (lats[1] - lats[0]);
        const y1 = latToY(nextLat, h);
        ctx.fillRect(
          col * up,
          Math.round(y0),
          up,
          Math.round(y1) - Math.round(y0),
        );
      }
    } else {
      const outW = cols * 2;
      const outH = rows * 2;
      const bounds = { minLat, maxLat, minLon, maxLon };
      let values: number[][];

      if (visMode === "idw") {
        values = idwGridMercator(data, isRain, outW, outH, bounds);
      } else if (visMode === "kriging") {
        values = krigingGridMercator(data, isRain, outW, outH, bounds);
      } else {
        const smooth = idwGridMercator(data, isRain, outW, outH, bounds);
        const breaks =
          activeLayer === "rainfall"
            ? [0, 5, 15, 30, 60, 100, 150, 250, 400, 600]
            : activeLayer === "minTemp"
              ? [5, 10, 15, 20, 25, 30]
              : [20, 25, 30, 35, 38, 40];
        values = classifyGrid(smooth, breaks);
      }

      const scaleX = w / outW;
      const scaleY = h / outH;
      for (let py = 0; py < outH; py++) {
        for (let px = 0; px < outW; px++) {
          const v = values[py][px];
          if (v === -999 || v === undefined) continue;
          ctx.fillStyle = visMode === "contour"
            ? contourBandColor(v, activeLayer)
            : colorFn(v);
          ctx.fillRect(
            Math.round(px * scaleX),
            Math.round(py * scaleY),
            Math.ceil(scaleX),
            Math.ceil(scaleY),
          );
        }
      }
    }

    if (rings) ctx.restore();

    const imageUrl = cvs.toDataURL("image/png");
    const coords: [[number, number], [number, number], [number, number], [number, number]] = [
      [minLon, maxLat],
      [maxLon, maxLat],
      [maxLon, minLat],
      [minLon, minLat],
    ];

    climateUrlRef.current = imageUrl;
    climateCoordsRef.current = coords;

    const map = mapRef.current;
    addClimateOverlay(map, imageUrl, coords);
  }, [data, activeLayer, visMode, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    function findNearest(latlng: { lat: number; lng: number }) {
      let closest: MonthlyDataPoint | null = null;
      let minDist = Infinity;
      for (const d of data) {
        const dist =
          (d.lat - latlng.lat) ** 2 + (d.lon - latlng.lng) ** 2;
        if (dist < minDist) {
          minDist = dist;
          closest = d;
        }
      }
      return closest;
    }

    function handleClick(e: any) {
      const closest = findNearest(e.lngLat);
      if (closest) {
        onLocationSelect({
          name: `${closest.lat.toFixed(4)}°N, ${closest.lon.toFixed(4)}°E`,
          rainfall: closest.rainfall ?? 0,
          maxTemp: closest.maxTemp ?? 0,
          minTemp: closest.minTemp ?? 0,
        });
      }
    }

    function handleMouseMove(e: any) {
      const closest = findNearest(e.lngLat);
      map!.getCanvas().style.cursor = closest ? "crosshair" : "";
    }

    map.on("click", handleClick);
    map.on("mousemove", handleMouseMove);

    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMouseMove);
    };
  }, [mapLoaded, data, onLocationSelect]);

  const legend = LEGENDS[activeLayer] || LEGENDS.rainfall;
  const legendTitle =
    activeLayer === "rainfall"
      ? "Rainfall (mm)"
      : activeLayer === "minTemp"
        ? "Min Temp (°C)"
        : "Max Temp (°C)";

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-6 left-4 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-3.5 text-xs border border-white/20 min-w-[90px]">
        <p className="font-semibold mb-2 dark:text-white capitalize">
          {legendTitle}
        </p>
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 py-1">
            <div
              className="w-5 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="dark:text-gray-300 text-gray-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
