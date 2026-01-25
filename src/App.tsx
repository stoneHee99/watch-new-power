import { useState, useEffect } from 'react'
import { ConfirmModal } from './components/ConfirmModal'
import { MapPage } from './components/MapPage'
import { GameDescriptionModal } from './components/GameDescriptionModal'
import { TreasureHuntGame } from './components/TreasureHuntGame'
import './App.css'

type Page = 'intro' | 'loading' | 'map' | 'game'

function App() {
  const [showModal, setShowModal] = useState(true)
  const [currentPage, setCurrentPage] = useState<Page>('intro')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [showGameDescription, setShowGameDescription] = useState(false)

  const handleConfirm = () => {
    setShowModal(false)
    setCurrentPage('loading')
  }

  // 로딩 후 맵으로 이동
  useEffect(() => {
    if (currentPage === 'loading') {
      const timer = setTimeout(() => {
        setCurrentPage('map')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentPage])

  const handleSelectLocation = (locationId: string) => {
    setSelectedLocation(locationId)

    if (locationId === 'smallField') {
      // 소운동장(신앙)만 실제 게임 페이지로 이동
      setCurrentPage('game')
    } else {
      // 나머지는 게임 설명 모달 표시
      setShowGameDescription(true)
    }
  }

  const handleCloseGameDescription = () => {
    setShowGameDescription(false)
    setSelectedLocation(null)
  }

  const handleBackToMap = () => {
    setCurrentPage('map')
    setSelectedLocation(null)
  }

  return (
    <div className="app">
      {showModal && (
        <ConfirmModal onConfirm={handleConfirm} onCancel={() => {}} />
      )}

      {currentPage === 'loading' && (
        <div className="loading-screen">
          <div className="loading-content">
            <h1 className="title">접속 시작</h1>
            <p className="subtitle">해당 상황을 시뮬레이션 합니다.</p>
            <div className="loading-bar">
              <div className="loading-progress" />
            </div>
          </div>
        </div>
      )}

      {currentPage === 'map' && (
        <>
          <MapPage onSelectLocation={handleSelectLocation} />
          {showGameDescription && selectedLocation && (
            <GameDescriptionModal
              locationId={selectedLocation}
              onClose={handleCloseGameDescription}
            />
          )}
        </>
      )}

      {currentPage === 'game' && selectedLocation === 'smallField' && (
        <TreasureHuntGame onBack={handleBackToMap} />
      )}
    </div>
  )
}

export default App
