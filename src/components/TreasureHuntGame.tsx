import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { ShopModal, ShopItem } from './ShopModal'
import { InventoryModal } from './InventoryModal'
import './TreasureHuntGame.css'

const STORAGE_KEY = 'treasureHunt_scannedQRs'
const SCORE_KEY = 'treasureHunt_totalScore'
const QR_PREFIX = 'JIHOON_TREASURE_' // QR 값 예시: JIHOON_TREASURE_001
const TOTAL_TREASURES = 50
const SCAN_COOLDOWN = 3000 // 스캔 후 3초간 대기

interface TreasureHuntGameProps {
  onBack: () => void
}

export function TreasureHuntGame({ onBack }: TreasureHuntGameProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [lastPoints, setLastPoints] = useState<number | null>(null)
  const [scannedCount, setScannedCount] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showShop, setShowShop] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isProcessingRef = useRef(false) // 디바운싱용

  // 로컬스토리지에서 데이터 불러오기
  useEffect(() => {
    const savedScore = localStorage.getItem(SCORE_KEY)
    const savedQRs = localStorage.getItem(STORAGE_KEY)

    if (savedScore) {
      setTotalScore(parseInt(savedScore, 10))
    }
    if (savedQRs) {
      const qrList = JSON.parse(savedQRs)
      setScannedCount(qrList.length)
    }
  }, [])

  // 스캔된 QR 목록 가져오기
  const getScannedQRs = (): string[] => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  }

  // QR 코드가 이미 스캔되었는지 확인
  const isAlreadyScanned = (qrCode: string): boolean => {
    const scannedQRs = getScannedQRs()
    return scannedQRs.includes(qrCode)
  }

  // QR 코드 저장
  const saveScannedQR = (qrCode: string) => {
    const scannedQRs = getScannedQRs()
    scannedQRs.push(qrCode)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scannedQRs))
    setScannedCount(scannedQRs.length)
  }

  // 현재 점수 가져오기 (localStorage에서 직접)
  const getCurrentScore = (): number => {
    const saved = localStorage.getItem(SCORE_KEY)
    return saved ? parseInt(saved, 10) : 0
  }

  // 점수 저장
  const saveScore = (newScore: number) => {
    localStorage.setItem(SCORE_KEY, newScore.toString())
    setTotalScore(newScore)
  }

  // 랜덤 포인트 생성 (100~300)
  const getRandomPoints = (): number => {
    return Math.floor(Math.random() * 201) + 100
  }

  // QR 스캔 성공 시
  const onScanSuccess = (decodedText: string) => {
    // 디바운싱: 이미 처리 중이면 무시
    if (isProcessingRef.current) {
      return
    }

    // 우리가 만든 QR인지 확인 (prefix 체크)
    if (!decodedText.startsWith(QR_PREFIX)) {
      isProcessingRef.current = true
      setMessage('유효하지 않은 QR이에요')
      setLastPoints(null)
      setTimeout(() => {
        setMessage('')
        isProcessingRef.current = false
      }, 2000)
      return
    }

    if (isAlreadyScanned(decodedText)) {
      isProcessingRef.current = true
      setMessage('이미 발견한 보물이에요!')
      setLastPoints(null)
      setTimeout(() => {
        setMessage('')
        isProcessingRef.current = false
      }, 2000)
      return
    }

    // 새로운 보물 발견!
    isProcessingRef.current = true
    const points = getRandomPoints()
    const currentScore = getCurrentScore() // localStorage에서 최신 점수 가져오기
    const newScore = currentScore + points

    saveScannedQR(decodedText)
    saveScore(newScore)
    setLastPoints(points)
    setMessage('보물 발견!')

    setTimeout(() => {
      setMessage('')
      setLastPoints(null)
      isProcessingRef.current = false
    }, SCAN_COOLDOWN)
  }

  // 카메라 시작
  const startScanning = async () => {
    setError('')

    try {
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' }, // 후면 카메라 우선
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        () => {} // 에러 무시 (스캔 중 계속 발생)
      )

      setIsScanning(true)
    } catch (err) {
      console.error('Camera error:', err)
      setError('카메라를 사용할 수 없습니다. 카메라 권한을 허용해주세요.')
    }
  }

  // 카메라 중지
  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current = null
      } catch (err) {
        console.error('Stop error:', err)
      }
    }
    setIsScanning(false)
  }

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const handleBack = async () => {
    await stopScanning()
    onBack()
  }

  // 상점에서 구매 시
  const handlePurchase = (item: ShopItem) => {
    const newScore = totalScore - item.price
    saveScore(newScore)
  }

  return (
    <div className="treasure-hunt">
      <div className="treasure-header">
        <button className="back-btn" onClick={handleBack}>
          ← 지도
        </button>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setShowInventory(true)}>
            📦
          </button>
          <button className="icon-btn" onClick={() => setShowShop(true)}>
            🛒
          </button>
        </div>
        <div className="score-display">
          <span className="score-label">포인트</span>
          <span className="score-value">{totalScore}</span>
        </div>
      </div>

      <div className="treasure-content">
        <div className="game-title">
          <span className="theme-badge">신앙</span>
          <h1>보물찾기</h1>
          <p className="game-subtitle">QR 코드를 스캔하여 보물을 찾으세요!</p>
        </div>

        <div className="scanner-container">
          <div id="qr-reader" className={isScanning ? 'active' : ''} />

          {!isScanning && (
            <div className="scanner-placeholder">
              <div className="scanner-icon">📷</div>
              <p>카메라를 켜서 보물을 찾으세요</p>
            </div>
          )}

          {message && (
            <div className={`scan-message ${lastPoints ? 'success' : 'warning'}`}>
              <span className="message-text">{message}</span>
              {lastPoints && <span className="points-earned">+{lastPoints}점</span>}
            </div>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="treasure-stats">
          <div className="stat-item">
            <span className="stat-value">{scannedCount}/{TOTAL_TREASURES}</span>
            <span className="stat-label">발견한 보물</span>
          </div>
        </div>

        <div className="treasure-actions">
          {!isScanning ? (
            <button className="action-btn start" onClick={startScanning}>
              카메라 켜기
            </button>
          ) : (
            <button className="action-btn stop" onClick={stopScanning}>
              카메라 끄기
            </button>
          )}
        </div>
      </div>

      {/* 상점 모달 */}
      {showShop && (
        <ShopModal
          currentScore={totalScore}
          onPurchase={handlePurchase}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* 인벤토리 모달 */}
      {showInventory && (
        <InventoryModal
          currentScore={totalScore}
          scannedCount={scannedCount}
          onClose={() => setShowInventory(false)}
        />
      )}
    </div>
  )
}
