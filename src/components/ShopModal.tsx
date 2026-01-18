import { useState, useEffect } from 'react'
import './ShopModal.css'

export interface ShopItem {
  id: string
  name: string
  emoji: string
  price: number
  description: string
}

// 예배에 필요한 물품들
export const SHOP_ITEMS: ShopItem[] = [
  { id: 'bible', name: '성경', emoji: '📖', price: 500, description: '하나님의 말씀' },
  { id: 'hymnal', name: '찬송가', emoji: '🎵', price: 400, description: '찬양을 위한 책' },
  { id: 'cross', name: '십자가', emoji: '✝️', price: 600, description: '예수님의 사랑' },
  { id: 'candle', name: '촛불', emoji: '🕯️', price: 200, description: '빛으로 인도하는' },
  { id: 'offering', name: '헌금봉투', emoji: '💌', price: 150, description: '감사의 마음' },
  { id: 'prayer_cushion', name: '기도방석', emoji: '🧎', price: 350, description: '무릎 꿇고 기도' },
  { id: 'rosary', name: '묵주', emoji: '📿', price: 450, description: '기도를 세며' },
  { id: 'holy_water', name: '성수', emoji: '💧', price: 300, description: '정결케 하는 물' },
  { id: 'incense', name: '향', emoji: '🌿', price: 250, description: '기도의 향기' },
  { id: 'robe', name: '성가대복', emoji: '👘', price: 700, description: '찬양을 위한 옷' },
  { id: 'communion_cup', name: '성찬컵', emoji: '🍷', price: 550, description: '그리스도의 피' },
  { id: 'bread', name: '떡', emoji: '🍞', price: 200, description: '그리스도의 몸' },
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
                <span className="item-desc">{item.description}</span>
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
