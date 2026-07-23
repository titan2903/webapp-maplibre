import {
  Map,
  FullscreenControl,
  GlobeControl,
  NavigationControl,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import { addKotaLayer, addPulauLayer, clearAllAnalysisLayers } from './layers/vector';
import { addMonasImage } from './layers/raster';
import { addAttribution } from './controls/basicControls';
import { logoMitsubishiControl } from './controls/customLogoControls';
import { storeAreaGeometry } from './engine/areaTool';
import { storeBufferGeometry } from './engine/bufferTool';
import { handleDistanceClick, resetDistanceState } from './engine/distanceTool';
import { storeCentroidGeometry } from './engine/centroidTool';
import { checkHealth } from './services/spatialApi';
import type { AnalysisToolType } from './types/spatial';

let activeTool: AnalysisToolType = 'buffer';
let bufferDistanceMeters: number = 1000000;

// Initialize Map
const map = new Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/globe.json',
  center: [106.83, -6.19],
  zoom: 2,
  attributionControl: false,
  cooperativeGestures: true
});

function loadBaseLayers(): void {
  addKotaLayer(map);
  addPulauLayer(map);
  addMonasImage(map);
}

map.on("load", () => {
  loadBaseLayers();
  verifyEngineHealth();
});

// Controls
addAttribution(map, "Natural Earth, Monas");
map.addControl(new NavigationControl(), "top-right");
map.addControl(new FullscreenControl(), "top-right");
map.addControl(new GlobeControl(), "top-right");
map.addControl(new logoMitsubishiControl(), "top-left");
map.doubleClickZoom.disable();

// Loading Indicator Helper
const spinner = document.getElementById("loading-spinner");
function showLoading(show: boolean): void {
  if (spinner) {
    if (show) spinner.classList.remove("hidden");
    else spinner.classList.add("hidden");
  }
}

// Check Backend Spatial Engine Connection
async function verifyEngineHealth(): Promise<void> {
  const badge = document.getElementById("engine-status");
  const isHealthy = await checkHealth();
  if (badge) {
    if (isHealthy) {
      badge.className = "status-badge online";
      badge.innerHTML = '<span class="status-dot"></span> Online';
    } else {
      badge.className = "status-badge offline";
      badge.innerHTML = '<span class="status-dot" style="background:#ef4444;box-shadow:none"></span> Offline';
    }
  }
}

// Tool Buttons Switcher
const toolButtons = document.querySelectorAll<HTMLButtonElement>(".tool-btn");
const bufferParamSection = document.getElementById("buffer-param-section");

toolButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    toolButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeTool = btn.dataset.tool as AnalysisToolType;

    resetDistanceState();

    if (bufferParamSection) {
      if (activeTool === 'buffer') {
        bufferParamSection.classList.remove("hidden");
      } else {
        bufferParamSection.classList.add("hidden");
      }
    }
  });
});

// Buffer Radius Slider
const bufferSlider = document.getElementById("buffer-slider") as HTMLInputElement | null;
const bufferValDisplay = document.getElementById("buffer-val-display");

if (bufferSlider && bufferValDisplay) {
  bufferSlider.addEventListener("input", () => {
    const valKm = parseInt(bufferSlider.value, 10);
    bufferDistanceMeters = valKm * 1000;
    bufferValDisplay.textContent = `${valKm.toLocaleString("ID-id")} km`;
  });
}

// Basemap Switcher
const basemapBtns = document.querySelectorAll<HTMLButtonElement>(".basemap-btn");
basemapBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    basemapBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const styleType = btn.dataset.style;
    if (styleType === "globe") {
      map.setStyle('https://demotiles.maplibre.org/globe.json');
    } else {
      map.setStyle('https://demotiles.maplibre.org/style.json');
    }
    map.once("style.load", () => {
      loadBaseLayers();
    });
  });
});

// Clear Analysis Layers Button
const clearBtn = document.getElementById("btn-clear-layers");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    clearAllAnalysisLayers(map);
    resetDistanceState();
    const resultItems = document.querySelectorAll(".result-item");
    resultItems.forEach(item => {
      item.classList.add("hidden");
      item.textContent = "";
    });
  });
}

// Map Click Event Dispatcher
map.on("click", (event) => {
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["titik-kota", "area-pulau"]
  });

  const evt = event as any;
  evt.features = features;

  if (activeTool === "distance") {
    handleDistanceClick(map, evt, showLoading);
  } else if (features.length > 0) {
    const layerId = features[0].layer.id;

    if (activeTool === "buffer" && layerId === "titik-kota") {
      storeBufferGeometry(map, evt, bufferDistanceMeters, showLoading);
    } else if (activeTool === "area" && layerId === "area-pulau") {
      storeAreaGeometry(evt, showLoading);
    } else if (activeTool === "centroid" && layerId === "area-pulau") {
      storeCentroidGeometry(map, evt, showLoading);
    }
  }
});

// Hover Cursor Settings
["titik-kota", "area-pulau"].forEach(layerId => {
  map.on("mouseenter", layerId, () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", layerId, () => {
    map.getCanvas().style.cursor = "";
  });
});