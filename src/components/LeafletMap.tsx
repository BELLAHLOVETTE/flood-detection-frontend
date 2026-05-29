// src/components/LeafletMap.tsx
'use client';
import { useEffect } from 'react';
import {
    MapContainer,
    TileLayer,
    GeoJSON,
    Marker,
    Popup,
    LayersControl,
    useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RiskLevel } from '@/types';
import { RISK_CONFIG } from '@/types';

// Fix Leaflet's default icon broken by webpack
function fixLeafletIcons() {
    // @ts-expect-error - Leaflet icon fix
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

interface Village {
    name: string;
    lat: number;
    lng: number;
    risk: RiskLevel;
}

interface Props {
    floodGeoJSON: GeoJSON.FeatureCollection | null;
    villages: Village[];
}

// Creates a coloured circle marker for each village
function createVillageIcon(risk: RiskLevel) {
    const color = RISK_CONFIG[risk].color;
    return L.divIcon({
        className: '',
        html: `
      <div style="
        background-color: ${color};
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      "></div>
    `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
}

// Component to set map view — handles dynamic centre changes
function MapController() {
    const map = useMap();
    useEffect(() => {
        map.setView([10.85, 14.92], 11);
    }, [map]);
    return null;
}

export default function LeafletMap({ floodGeoJSON, villages }: Props) {
    useEffect(() => {
        fixLeafletIcons();
    }, []);

    return (
        <MapContainer
            center={[10.85, 14.92]}
            zoom={11}
            style={{ height: '500px', width: '100%' }}
            scrollWheelZoom={true}
        >
            <MapController />

            <LayersControl position="topright">

                {/* Base map layers */}
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite (Esri)">
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution="© Esri"
                    />
                </LayersControl.BaseLayer>

                {/* Flood extent overlay */}
                {floodGeoJSON && floodGeoJSON.features?.length > 0 && (
                    <LayersControl.Overlay checked name="Étendue inondation">
                        <GeoJSON
                            data={floodGeoJSON}
                            style={{
                                color: '#2E75B6',
                                fillColor: '#2E75B6',
                                fillOpacity: 0.45,
                                weight: 1.5,
                            }}
                        />
                    </LayersControl.Overlay>
                )}

            </LayersControl>

            {/* Village markers */}
            {villages.map((village) => (
                <Marker
                    key={village.name}
                    position={[village.lat, village.lng]}
                    icon={createVillageIcon(village.risk)}
                >
                    <Popup>
                        <div style={{ minWidth: '140px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
                                {village.name}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>
                                Niveau de risque:
                            </p>
                            <p style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: RISK_CONFIG[village.risk].color,
                            }}>
                                {RISK_CONFIG[village.risk].icon} {RISK_CONFIG[village.risk].labelFr}
                            </p>
                            <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                                {village.lat.toFixed(3)}°N, {village.lng.toFixed(3)}°E
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    );
}