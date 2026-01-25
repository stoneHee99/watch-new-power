import { useState, useEffect } from 'react'
import './ConfirmModal.css'

interface ConfirmModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ onConfirm }: ConfirmModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showCancelBtn, setShowCancelBtn] = useState(true)

  useEffect(() => {
    // 모달 등장 애니메이션
    setTimeout(() => setIsVisible(true), 100)
    setTimeout(() => setShowContent(true), 600)
  }, [])

  const handleConfirm = () => {
    setIsVisible(false)
    setTimeout(onConfirm, 500)
  }

  const handleCancel = () => {
    // 아니오 버튼 사라지게 하기
    setShowCancelBtn(false)
  }

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`modal-container ${isVisible ? 'visible' : ''}`}>
        {/* 글로우 이펙트 */}
        <div className="modal-glow" />

        {/* 코너 장식 */}
        <div className="corner top-left" />
        <div className="corner top-right" />
        <div className="corner bottom-left" />
        <div className="corner bottom-right" />

        {/* 시스템 헤더 */}
        <div className="modal-header">
          <span className="system-text">SYSTEM</span>
        </div>

        {/* 메인 컨텐츠 */}
        <div className={`modal-content ${showContent ? 'visible' : ''}`}>
          <p className="modal-message">
            <span className="highlight">여러분</span>이라면
            <br />
            어떤 선택을 하시겠습니까?
          </p>

          <div className="modal-buttons">
            <button className="modal-btn confirm" onClick={handleConfirm}>
              <span className="btn-glow" />
              예
            </button>
            {showCancelBtn && (
              <button className="modal-btn cancel" onClick={handleCancel}>
                <span className="btn-glow" />
                아니오
              </button>
            )}
          </div>
        </div>

        {/* 파티클 효과 */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${Math.random() * 3}s`,
              '--x': `${Math.random() * 100}%`,
              '--duration': `${2 + Math.random() * 3}s`
            } as React.CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  )
}
