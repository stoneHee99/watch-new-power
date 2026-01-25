import { useState, useEffect } from 'react'
import './ShopModal.css'

export interface ShopItem {
  id: string
  name: string
  emoji: string
  price: number
}

// 예배에 필요한 물품들
export const SHOP_ITEMS: ShopItem[] = [
  { id: 'bible', name: '성경', emoji: '📖', price: 500 },
  { id: 'hymnal', name: '찬송가', emoji: '🎵', price: 400 },
  { id: 'offering', name: '헌금봉투', emoji: '💌', price: 150 },
  { id: 'robe', name: '성가대복', emoji: '👘', price: 700 },
  { id: 'chair', name: '의자', emoji: '🪑', price: 350 },
  { id: 'pen', name: '펜', emoji: '🖊️', price: 100 },
  { id: 'notebook', name: '노트', emoji: '📓', price: 200 },
  { id: 'water', name: '물병', emoji: '🧴', price: 150 },
  { id: 'handkerchief', name: '손수건', emoji: '🧣', price: 120 },
  { id: 'blanket', name: '담요', emoji: '🧥', price: 300 },
  { id: 'bag', name: '가방', emoji: '👜', price: 250 },
  { id: 'bookmark', name: '책갈피', emoji: '🔖', price: 80 },
]

const INVENTORY_KEY = 'treasureHunt_inventory'

interface ShopModalProps {
  currentScore: number
  onPurchase: (item: ShopItem) => void
  onClose: () => void
}

export function ShopModal({ currentScore, onPurchase, onClose }: ShopModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [purchasedItems, setPurchasedItems] = useState<string[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50)
    // 구매한 아이템 불러오기
    const saved = localStorage.getItem(INVENTORY_KEY)
    if (saved) {
      setPurchasedItems(JSON.parse(saved))
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handlePurchase = (item: ShopItem) => {
    if (currentScore < item.price) {
      setMessage('포인트가 부족해요!')
      setTimeout(() => setMessage(''), 2000)
      return
    }

    if (purchasedItems.includes(item.id)) {
      setMessage('이미 구매한 물품이에요!')
      setTimeout(() => setMessage(''), 2000)
      return
    }

    // 구매 처리
    const newInventory = [...purchasedItems, item.id]
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(newInventory))
    setPurchasedItems(newInventory)
    onPurchase(item)

    setMessage(`${item.name} 구매 완료!`)
    setTimeout(() => setMessage(''), 2000)
  }

  const isPurchased = (itemId: string) => purchasedItems.includes(itemId)

  return (
    <div className={`shop-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`shop-container ${isVisible ? 'visible' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="shop-header">
          <h2>상점</h2>
          <div className="shop-score">
            <span className="score-icon">💰</span>
            <span className="score-amount">{currentScore}</span>
          </div>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        {message && <div className="shop-message">{message}</div>}

        <div className="shop-items">
          {SHOP_ITEMS.map(item => (
            <div
              key={item.id}
              className={`shop-item ${isPurchased(item.id) ? 'purchased' : ''} ${currentScore < item.price ? 'disabled' : ''}`}
            >
              <div className="item-emoji">{item.emoji}</div>
              <div className="item-info">
                <span className="item-name">{item.name}</span>
              </div>
              <div className="item-action">
                {isPurchased(item.id) ? (
                  <span className="purchased-badge">구매완료</span>
                ) : (
                  <button
                    className="buy-btn"
                    onClick={() => handlePurchase(item)}
                    disabled={currentScore < item.price}
                  >
                    {item.price}P
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="shop-footer">
          <span className="progress-text">
            수집: {purchasedItems.length} / {SHOP_ITEMS.length}
          </span>
        </div>
      </div>
    </div>
  )
}
