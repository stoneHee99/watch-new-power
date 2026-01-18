import { useState, useEffect } from 'react'
import { SHOP_ITEMS } from './ShopModal'
import './InventoryModal.css'

const INVENTORY_KEY = 'treasureHunt_inventory'
const TOTAL_TREASURES = 50

interface InventoryModalProps {
  currentScore: number
  scannedCount: number
  onClose: () => void
}

export function InventoryModal({ currentScore, scannedCount, onClose }: InventoryModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [purchasedItems, setPurchasedItems] = useState<string[]>([])

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50)
    const saved = localStorage.getItem(INVENTORY_KEY)
    if (saved) {
      setPurchasedItems(JSON.parse(saved))
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const collectedItems = SHOP_ITEMS.filter(item => purchasedItems.includes(item.id))
  const uncollectedItems = SHOP_ITEMS.filter(item => !purchasedItems.includes(item.id))

  return (
    <div className={`inventory-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`inventory-container ${isVisible ? 'visible' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="inventory-header">
          <h2>내 가방</h2>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        {/* 통계 */}
        <div className="inventory-stats">
          <div className="stat-box">
            <span className="stat-icon">💰</span>
            <div className="stat-info">
              <span className="stat-value">{currentScore}</span>
              <span className="stat-label">포인트</span>
            </div>
          </div>
          <div className="stat-box">
            <span className="stat-icon">🎁</span>
            <div className="stat-info">
              <span className="stat-value">{scannedCount}/{TOTAL_TREASURES}</span>
              <span className="stat-label">보물</span>
            </div>
          </div>
          <div className="stat-box">
            <span className="stat-icon">📦</span>
            <div className="stat-info">
              <span className="stat-value">{purchasedItems.length}/{SHOP_ITEMS.length}</span>
              <span className="stat-label">물품</span>
            </div>
          </div>
        </div>

        {/* 수집한 물품 */}
        <div className="inventory-section">
          <h3 className="section-title">수집한 예배 물품</h3>
          {collectedItems.length > 0 ? (
            <div className="items-grid">
              {collectedItems.map(item => (
                <div key={item.id} className="inventory-item collected">
                  <span className="item-emoji">{item.emoji}</span>
                  <span className="item-name">{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">아직 수집한 물품이 없어요. 상점에서 구매해보세요!</p>
          )}
        </div>

        {/* 미수집 물품 */}
        {uncollectedItems.length > 0 && (
          <div className="inventory-section">
            <h3 className="section-title">미수집 물품</h3>
            <div className="items-grid">
              {uncollectedItems.map(item => (
                <div key={item.id} className="inventory-item uncollected">
                  <span className="item-emoji">❓</span>
                  <span className="item-name">???</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 완료 체크 */}
        {purchasedItems.length === SHOP_ITEMS.length && (
          <div className="completion-banner">
            🎉 모든 예배 물품을 수집했어요!
          </div>
        )}
      </div>
    </div>
  )
}
