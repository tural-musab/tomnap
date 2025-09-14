'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Video, Users, Zap, Shield, Smartphone, Gift 
} from 'lucide-react'

// Floating Card Component
function FloatingCard({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative"
    >
      {children}
    </motion.div>
  )
}

export default function Features() {
  // Features data
  const features = [
    {
      icon: Video,
      title: 'Video Commerce',
      description: 'Ürünleri canlı videolarla keşfedin, anında satın alın',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Sosyal Alışveriş',
      description: 'Arkadaşlarınızla birlikte alışveriş yapın, indirim kazanın',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Canlı Yayınlar',
      description: 'Influencer\'lardan canlı ürün tanıtımları izleyin',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Güvenli Ödeme',
      description: 'Stripe ve İyzico ile güvenli alışveriş',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Smartphone,
      title: 'Mobil Öncelikli',
      description: 'Her cihazda mükemmel deneyim',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Gift,
      title: 'Ödül Sistemi',
      description: 'Alışveriş yapın, puan kazanın, hediye alın',
      gradient: 'from-pink-500 to-rose-500'
    }
  ]

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4" variant="outline">Özellikler</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Neden TomNAP?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Sosyal medya ve e-ticaretin mükemmel birleşimi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FloatingCard key={index} delay={index * 0.1}>
              <Card className="p-6 hover:shadow-xl transition-shadow border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Card>
            </FloatingCard>
          ))}
        </div>
      </div>
    </section>
  )
}
