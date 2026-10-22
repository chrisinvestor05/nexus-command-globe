'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

// Sample data matching Nexus structure (replace with Drive API later)
const SAMPLE_POINTS = [
  { lat: 39.7392, lng: -104.9903, type: 'green', name: 'Hot Lead - Denver', info: 'Seller ready to move' },
  { lat: 39.5501, lng: -105.7821, type: 'green', name: 'Hot Lead - CO Springs', info: 'Probate property' },
  { lat: 32.7767, lng: -96.7970, type: 'red', name: 'Dead Lead - Dallas', info: 'No response' },
  { lat: 30.2672, lng: -97.7431, type: 'red', name: 'Dead Lead - Austin', info: 'Not motivated' },
  { lat: 39.7294, lng: -104.8319, type: 'contract', name: 'Signed Contract - Aurora', info: 'Under contract $185k' },
  { lat: 39.6133, lng: -104.8878, type: 'contract', name: 'Signed - Englewood', info: 'Duplex deal closed' },
  { lat: 40.0150, lng: -105.2705, type: 'buyer', name: 'Investor - Boulder', info: 'Cash buyer VIP' },
  { lat: 39.9205, lng: -105.0867, type: 'buyer', name: 'Buyer - Westminster', info: 'Looking for flips' },
  { lat: 33.4484, lng: -112.0740, type: 'green', name: 'Hot Lead - Phoenix', info: 'Distressed' },
  { lat: 25.7617, lng: -80.1918, type: 'buyer', name: 'Investor - Miami', info: 'Nationwide cash' },
];

const COLORS = {
  green: '#00ff88',
  red: '#ff3366',
  contract: '#ffd700',
  buyer: '#00ccff',
};

export default function Home() {
  const globeRef = useRef<any>();
  const [layers, setLayers] = useState({
    green: true,
    red: true,
    contract: true,
    buyer: true,
  });

  const points = SAMPLE_POINTS.filter(p => layers[p.type as keyof typeof layers]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 39.5, lng: -105, altitude: 1.8 }, 1500);
    }
  }, []);

  const toggle = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className="controls">
        <h2>Nexus Command Globe</h2>
        <label className="layer-toggle">
          <input type="checkbox" checked={layers.green} onChange={() => toggle('green')} />
          Hot / Green Leads
        </label>
        <label className="layer-toggle">
          <input type="checkbox" checked={layers.red} onChange={() => toggle('red')} />
          Dead / Red Leads
        </label>
        <label className="layer-toggle">
          <input type="checkbox" checked={layers.contract} onChange={() => toggle('contract')} />
          Signed Contracts
        </label>
        <label className="layer-toggle">
          <input type="checkbox" checked={layers.buyer} onChange={() => toggle('buyer')} />
          Investors / Buyers
        </label>
        <div className="legend">
          <span><span className="dot" style={{background: COLORS.green}}></span> Green</span>
          <span><span className="dot" style={{background: COLORS.red}}></span> Red</span>
          <span><span className="dot" style={{background: COLORS.contract}}></span> Contracts</span>
          <span><span className="dot" style={{background: COLORS.buyer}}></span> Buyers</span>
        </div>
        <p style={{marginTop: 12, fontSize: 12, opacity: 0.7}}>
          Public link — no login. Data from Drive folder can be wired next.
        </p>
      </div>

      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d: any) => COLORS[d.type]}
        pointAltitude={0.02}
        pointRadius={0.4}
        pointLabel={(d: any) => `<b>${d.name}</b><br/>${d.info}`}
        atmosphereColor="#00ffaa"
        atmosphereAltitude={0.25}
        width={typeof window !== 'undefined' ? window.innerWidth : 1200}
        height={typeof window !== 'undefined' ? window.innerHeight : 800}
      />
    </div>
  );
}
