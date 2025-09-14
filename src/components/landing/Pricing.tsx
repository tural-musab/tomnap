'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

export default function Pricing() {
  // Pricing plans
  const plans = [
    {
      name: 'Başlangıç',
      price: 'Ücretsiz',
      description: 'Kişisel kullanım için',
      features: [
        'Sınırsız video izleme',
        'Aylık 10 ürün ekleme',
        'Temel analitikler',
        'Email destek'
      ],
      notIncluded: [
        'Canlı yayın',
        'Gelişmiş analitikler'
      ],
      cta: 'Hemen Başla',
      popular: false
    },
    {
      name: 'Profesyonel',
      price: '₺299',
      period: '/ay',
      description: 'Büyüyen işletmeler için',
      features: [
        'Başlangıç planındaki her şey',
        'Sınırsız ürün ekleme',
        'Canlı yayın (4 saat/ay)',
        'Gelişmiş analitikler',
        'Öncelikli destek',
        'Özel badge'
      ],
      notIncluded: [],
      cta: 'Ücretsiz Dene',
      popular: true
    },
    {
      name: 'İşletme',
      price: 'Özel Fiyat',
      description: 'Kurumsal çözümler',
      features: [
        'Profesyonel planındaki her şey',
        'Sınırsız canlı yayın',
        'API erişimi',
        'Özel entegrasyonlar',
        'Dedike hesap yöneticisi',
        'SLA garantisi'
      ],
      notIncluded: [],
      cta: 'İletişime Geç',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4" variant="outline">Fiyatlandırma</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Size Uygun Plan Seçin
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            İster ücretsiz başlayın, ister profesyonel özelliklerle büyüyün
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-8 relative ${plan.popular ? 'border-purple-600 border-2' : 'border-gray-200/50 dark:border-gray-800/50'} bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600">
                    En Popüler
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">
                    {plan.price}
                    {plan.period && <span className="text-lg font-normal text-gray-600 dark:text-gray-400">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <div key={i} className="flex items-center opacity-50">
                      <X className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-500 line-through">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`} 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
