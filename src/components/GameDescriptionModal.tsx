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
    description: '세상 속에서 나의 정체성을 당당하게 드러낼 수 있을까요? 보드게임을 통해 그리스도인으로서의 정체성을 체험해보세요.',
  },
  bethlehem: {
    id: 'bethlehem',
    name: '베들레헴 성전',
    theme: '관계',
    description: '교회 안에서의 인간관계와 하나님과의 관계, 무엇이 더 중요할까요? 게임을 통해 진정한 관계의 의미를 체험해보세요.',
  },
  retreat: {
    id: 'retreat',
    name: '수양관 식당',
    theme: '비교',
    description: '다른 사람들의 시선이 신경 쓰이시나요? 만들기 활동을 통해 비교에서 벗어나 하나님만 바라보는 시간을 체험해보세요.',
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
