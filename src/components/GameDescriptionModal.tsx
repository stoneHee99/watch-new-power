import { useState, useEffect } from 'react'
import './GameDescriptionModal.css'

interface GameInfo {
  id: string
  name: string
  theme: string
  description: string
}

const gameDescriptions: Record<string, GameInfo> = {
  jerusalem: {
    id: 'jerusalem',
    name: '예루살렘 성전',
    theme: '정체성',
    description: '지훈이는 세상 속에서 본인이 그리스도인임을 떳떳하게 말하지 못해요. 보드게임에서 승리하여 지훈이의 과거를 바꿀 수 있어요.',
  },
  bethlehem: {
    id: 'bethlehem',
    name: '베들레헴 성전',
    theme: '관계',
    description: '지훈이는 교회 내 인간관계에 치우쳐 하나님과의 관계에 집중하지 못해요. 게임을 통과해서 지훈이의 과거를 바꿀 수 있어요.',
  },
  retreat: {
    id: 'retreat',
    name: '수양관 식당',
    theme: '비교',
    description: '다른 사람들의 시선을 의식하느라 하나님을 바라보지 못하는 지훈이를 도와주세요! 만들기 활동을 통해 지훈이의 과거를 바꿀 수 있어요.',
  },
}

interface GameDescriptionModalProps {
  locationId: string
  onClose: () => void
}

export function GameDescriptionModal({ locationId, onClose }: GameDescriptionModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const gameInfo = gameDescriptions[locationId]

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!gameInfo) return null

  return (
    <div className={`game-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`game-modal-container ${isVisible ? 'visible' : ''}`} onClick={e => e.stopPropagation()}>
        {/* 코너 장식 */}
        <div className="corner top-left" />
        <div className="corner top-right" />
        <div className="corner bottom-left" />
        <div className="corner bottom-right" />

        {/* 헤더 */}
        <div className="game-modal-header">
          <span className="theme-badge">{gameInfo.theme}</span>
          <h2 className="game-modal-title">{gameInfo.name}</h2>
        </div>

        {/* 설명 */}
        <div className="game-modal-content">
          <p className="game-description">{gameInfo.description}</p>
        </div>

        {/* 버튼 */}
        <div className="game-modal-footer">
          <button className="game-modal-btn" onClick={handleClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
