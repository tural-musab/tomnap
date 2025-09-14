'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, X, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as NavigatorWithStandalone).standalone === true
    )

    // Check if iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream
    )

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after 30 seconds or on user interaction
      setTimeout(() => {
        const hidePrompt = localStorage.getItem('hideInstallPrompt')
        if (!hidePrompt) {
          setShowPrompt(true)
        }
      }, 30000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check for iOS and show custom prompt
    if (isIOS && !isStandalone) {
      const iosPromptShown = localStorage.getItem('iosInstallPromptShown')
      if (!iosPromptShown) {
        setTimeout(() => setShowPrompt(true), 5000)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isIOS, isStandalone])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        // Show iOS install instructions
        alert(
          'iOS\'ta yüklemek için:\n' +
          '1. Safari\'de paylaş butonuna (□↑) dokunun\n' +
          '2. "Ana Ekrana Ekle" seçeneğini seçin\n' +
          '3. "Ekle" butonuna dokunun'
        )
        localStorage.setItem('iosInstallPromptShown', 'true')
      }
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      localStorage.setItem('appInstalled', 'true')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('hideInstallPrompt', 'true')
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('hideInstallPrompt')
    }, 7 * 24 * 60 * 60 * 1000)
  }

  // Don't show if already installed
  if (isStandalone) return null

  return (
    <>
      {/* Floating Install Button */}
      {deferredPrompt && !showPrompt && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-24 right-4 z-40"
        >
          <Button
            onClick={() => setShowPrompt(true)}
            size="lg"
            className="rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Download className="w-5 h-5 mr-2" />
            Uygulamayı Yükle
          </Button>
        </motion.div>
      )}

      {/* Install Prompt Modal */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md p-6 bg-white dark:bg-gray-900">
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    TomNAP'ı Yükleyin
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Daha hızlı ve kolay alışveriş deneyimi için uygulamayı cihazınıza yükleyin
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                      <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium">Çevrimdışı Erişim</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        İnternet olmadan da gezinin
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                      <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">Ana Ekran Erişimi</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Tek dokunuşla açın
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleInstall}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Yükle
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                  >
                    Sonra
                  </Button>
                </div>

                {isIOS && (
                  <p className="text-xs text-center text-gray-500 mt-4">
                    iOS: Safari'de paylaş → Ana Ekrana Ekle
                  </p>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
