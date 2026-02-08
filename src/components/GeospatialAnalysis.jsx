import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDistrictMap } from '../data/districtMaps';
import '../styles/Dashboard.css';
import { useTranslation } from '../i18n';
import MapLayers from './MapLayers';

// Component to handle FlyTo animation
function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 });
    }, [center, zoom, map]);
    return null;
}

export default function GeospatialAnalysis({ districtId, selectedBlock, onSelect }) {
    const { t } = useTranslation();
    const [mapMode, setMapMode] = useState('hightech'); // Default to Dark/High-Tech
    const [heatmapMode, setHeatmapMode] = useState(false);
    const [showClusters, setShowClusters] = useState(true);

    // Get District Data
    const districtData = getDistrictMap(districtId || 'vellore');
    const { center, blocks } = districtData;

    // Tile Layers
    const layers = {
        hightech: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', // Dark Matter
        standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        terrain: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}'
    };

    const getRiskColor = (density) => {
        if (density === 'Very High') return '#EF4444';
        if (density === 'High') return '#F97316';
        if (density === 'Medium') return '#EAB308';
        return '#10B981';
    };

    return (
        <div className="geo-panel" style={{ width: '100%', height: '100%', position: 'relative' }}>

            {/* Map Header */}
            <div className="map-header" style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'rgba(15, 23, 42, 0.9)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-primary-emerald)' }}>
                <span className="cyber-font" style={{ color: 'var(--color-primary-emerald)' }}>{t('geospatial_twin')}: {districtId.toUpperCase()}</span>
            </div>

            {/* Map Controls */}
            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {['hightech', 'satellite', 'standard'].map(mode => (
                        <button
                            key={mode}
                            onClick={() => setMapMode(mode)}
                            style={{
                                background: mapMode === mode ? 'var(--color-primary-emerald)' : 'rgba(15, 23, 42, 0.8)',
                                color: mapMode === mode ? '#000' : '#fff',
                                border: '1px solid var(--color-border)',
                                padding: '4px 8px',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            {mode === 'hightech' ? 'DARK' : mode}
                        </button>
                    ))}
                </div>

                {/* Layer Toggles */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <button
                        onClick={() => setShowClusters(!showClusters)}
                        style={{
                            background: showClusters ? '#3B82F6' : 'rgba(15, 23, 42, 0.8)',
                            color: 'white', border: '1px solid var(--color-border)',
                            padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer'
                        }}
                    >
                        CLUSTERS: {showClusters ? 'ON' : 'OFF'}
                    </button>
                    <button
                        onClick={() => setHeatmapMode(!heatmapMode)}
                        style={{
                            background: heatmapMode ? '#EF4444' : 'rgba(15, 23, 42, 0.8)',
                            color: 'white', border: '1px solid var(--color-border)',
                            padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer'
                        }}
                    >
                        HEATMAP: {heatmapMode ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            <MapContainer
                center={center}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer url={layers[mapMode]} attribution='&copy; OpenStreetMap & CartoDB' />

                <MapController center={center} zoom={11} />

                {/* District Polygons */}
                {blocks.map(block => {
                    const isSelected = selectedBlock === block.id;
                    const color = getRiskColor(block.density);

                    return (
                        <Polygon
                            key={block.id}
                            positions={block.polygon}
                            pathOptions={{
                                color: isSelected ? '#fff' : color,
                                fillColor: color,
                                fillOpacity: heatmapMode ? 0.1 : (isSelected ? 0.4 : 0.2), // Brighter opacity
                                weight: isSelected ? 3 : 1,
                                className: isSelected ? 'selected-glow' : '' // Neon Glow Effect
                            }}
                            eventHandlers={{
                                click: () => onSelect(block.id),
                            }}
                        >
                            <Tooltip sticky direction="top" className="map-label-tooltip">
                                <span className="cyber-font">{block.name}</span><br />
                                <span style={{ fontSize: '0.8rem' }}>{t('risk_profile')}: {block.density}</span>
                            </Tooltip>
                        </Polygon>
                    );
                })}

                {/* Dynamic Markers & Heatmap */}
                <MapLayers districtId={districtId} center={center} heatmapMode={heatmapMode} showMarkers={showClusters} />

            </MapContainer>

            {/* Legend */}
            <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000, background: 'rgba(0,0,0,0.7)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: '#ccc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%' }}></span> {t('alert_safe')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, background: '#EF4444', borderRadius: '50%' }}></span> {t('alert_critical')}</div>
            </div>
        </div>
    );
}
