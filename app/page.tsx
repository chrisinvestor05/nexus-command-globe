'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const SAMPLE_POINTS = [
  { lat: 39.7392, lng: -104.9903, type: 'green', name: 'Hot Lead — Denver', info: 'Motivated seller • Ready this week' },
  { lat: 39.5501, lng: -105.7821, type: 'green', name: 'Hot Lead — Colorado Springs', info: 'Probate • High equity' },
  { lat: 39.8028, lng: -105.0875, type: 'green', name: 'Hot Lead — Arvada', info: 'Pre-foreclosure' },
  { lat: 39.7294, lng: -104.8319, type: 'contract', name: 'Signed — Aurora', info: 'Under contract • $185k' },
  { lat: 39.6133, lng: -104.8878, type: 'contract', name: 'Signed — Englewood', info: 'Duplex closed' },
  { lat: 40.0150, lng: -105.2705, type: 'buyer', name: 'VIP Investor — Boulder', info: 'Cash • Nationwide' },
  { lat: 39.9205, lng: -105.0867, type: 'buyer', name: 'Buyer — Westminster', info: 'Flip specialist' },
  { lat: 32.7767, lng: -96.7970, type: 'red', name: 'Dead Lead — Dallas', info: 'No response' },
  { lat: 30.2672, lng: -97.7431, type: 'red', name: 'Dead Lead — Austin', info: 'Not motivated' },
  { lat: 33.4484, lng: -112.0740, type: 'green', name: 'Hot Lead — Phoenix', info: 'Distressed' },
  { lat: 25.7617, lng: -80.1918, type: 'buyer', name: 'Investor — Miami', info: 'Cash buyer' },
  { lat: 41.8781, lng: -87.6298, type: 'green', name: 'Hot Lead — Chicago', info: 'Wholesale opportunity' },
  { lat: 29.7604, lng: -95.3698, type: 'contract', name: 'Signed — Houston', info: 'Assigned' },
  { lat: 47.6062, lng: -122.3321, type: 'buyer', name: 'Investor — Seattle', info: 'Portfolio buyer' },
];

const COLORS: Record<string, string> = {
  green: '#00ff88',
  red: '#ff3366',
  contract: '#ffd700',
  buyer: '#00ccff',
};

export default function Home() {
  const globeRef = useRef<any>();
  const [layers, setLayers] = useState({ green: true, red: true, contract: true, buyer: true });
  const [hovered, setHovered] = useState<any>(null);

  const points = SAMPLE_POINTS.filter(p => layers[p.type as keyof typeof layers]);
  const rings = points.filter(p => p.type === 'contract');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat: 39.0, lng: -105, altitude: 2.2 }, 1800);
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.35;
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const toggle = (key: keyof typeof layers) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  const counts = {
    green: SAMPLE_POINTS.filter(p => p.type === 'green').length,
    red: SAMPLE_POINTS.filter(p => p.type === 'red').length,
    contract: SAMPLE_POINTS.filter(p => p.type === 'contract').length,
    buyer: SAMPLE_POINTS.filter(p => p.type === 'buyer').length,
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#030308' }}>
      {/* Title overlay */}
      <div style={{
        position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, textAlign: 'center', pointerEvents: 'none',
        textShadow: '0 0 30px #00ffaa66'
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2, color: '#fff', margin: 0 }}>
          NEXUS <span style={{ color: '#00ffaa' }}>COMMAND</span>
        </h1>
        <p style={{ fontSize: 13, color: '#88ffcc', marginTop: 4, opacity: 0.85 }}>Live Deal & Investor Globe</p>
      </div>

      {/* Glass controls */}
      <div style={{
        position: 'absolute', top: 24, left: 24, zIndex: 10,
        background: 'rgba(8, 12, 24, 0.72)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,255,170,0.25)',
        borderRadius: 20,
        padding: '18px 20px',
        boxShadow: '0 8px 40px rgba(0,255,170,0.12)',
        minWidth: 220
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#00ffaa', marginBottom: 12, letterSpacing: 1 }}>LAYERS</div>
        {([
          ['green', 'Hot Leads', counts.green],
          ['red', 'Dead Leads', counts.red],
          ['contract', 'Signed Contracts', counts.contract],
          ['buyer', 'Investors / Buyers', counts.buyer],
        ] as const).map(([key, label, count]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0', cursor: 'pointer', fontSize: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={layers[key]} onChange={() => toggle(key)} style={{ accentColor: COLORS[key] }} />
              {label}
            </span>
            <span style={{ color: COLORS[key], fontWeight: 700 }}>{count}</span>
          </label>
        ))}
        <div style={{ marginTop: 14, fontSize: 11, opacity: 0.6, lineHeight: 1.4 }}>
          Public • No login<br/>Drive data ready to connect
        </div>
      </div>

      {/* Hover card */}
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20,
          background: 'rgba(6, 10, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${COLORS[hovered.type]}55`,
          borderRadius: 14,
          padding: '14px 20px',
          minWidth: 280,
          textAlign: 'center',
          boxShadow: `0 0 30px ${COLORS[hovered.type]}33`
        }}>
          <div style={{ color: COLORS[hovered.type], fontWeight: 700, fontSize: 16 }}>{hovered.name}</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{hovered.info}</div>
        </div>
      )}

      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d: any) => COLORS[d.type]}
        pointAltitude={0.015}
        pointRadius={0.45}
        pointResolution={12}
        pointsMerge={false}
        onPointHover={setHovered}
        ringsData={rings}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => '#ffd700'}
        ringMaxRadius={4}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1400}
        atmosphereColor="#00ffaa"
        atmosphereAltitude={0.28}
        width={typeof window !== 'undefined' ? window.innerWidth : 1400}
        height={typeof window !== 'undefined' ? window.innerHeight : 900}
      />
    </div>
  );
}
