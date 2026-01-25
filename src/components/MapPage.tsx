import { useState, useEffect } from 'react'
import './MapPage.css'

interface Location {
  id: string
  name: string
  theme: string
  x: number // 퍼센트 위치
  y: number
}

const locations: Location[] = [
  { id: 'retreat', name: '수양관 식당', theme: '정체성', x: 28, y: 68 },
  { id: 'jerusalem', name: '예루살렘 성전', theme: '비교', x: 58, y: 18 },
  { id: 'bethlehem', name: '베들레헴 성전', theme: '관계', x: 72, y: 22 },
  { id: 'smallField', name: '소운동장', theme: '신앙', x: 58, y: 70 },
]

interface MapPageProps {
  onSelectLocation: (locationId: string) => void
}

export function MapPage({ onSelectLocation }: MapPageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeMarker, setActiveMarker] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div className={`map-page ${isVisible ? 'visible' : ''}`}>
      <div className="map-header">
        <span className="system-text">QUEST MAP</span>
        <h1 className="map-title">선택의 순간</h1>
      </div>

      <div className="map-container">
        <div className="map-wrapper">
          <img src="/map.png" alt="지도" className="map-image" />

          {/* 오버레이 효과 */}
          <div className="map-overlay" />

          {/* 장소 마커들 */}
          {locations.map((loc) => (
            <button
              key={loc.id}
              className={`location-marker ${activeMarker === loc.id ? 'active' : ''}`}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              onClick={() => onSelectLocation(loc.id)}
              onMouseEnter={() => setActiveMarker(loc.id)}
              onMouseLeave={() => setActiveMarker(null)}
            >
              <span className="marker-glow" />
              <span className="marker-dot" />
              <div className="marker-tooltip">
                <span className="tooltip-name">{loc.name}</span>
                <span className="tooltip-theme">{loc.theme}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="map-hint">장소를 선택하여 퀘스트를 시작하세요</p>
    </div>
  )
}
