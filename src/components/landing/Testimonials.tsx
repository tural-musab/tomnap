'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

export default function Testimonials() {
  // Testimonials data
  const testimonials = [
    {
      name: 'Ayşe Yılmaz',
      role: 'Fashion Influencer',
      avatar: '👩‍🎤',
      content: 'TomNAP ile takipçilerime ürün tanıtmak çok kolay. Canlı yayınlarda anında satış yapabiliyorum!',
      rating: 5
    },
    {
      name: 'Mehmet Kaya',
      role: 'Satıcı',
      avatar: '👨‍💼',
      content: 'Video içeriklerle ürünlerimi göstermek satışlarımı %300 artırdı. Harika bir platform!',
      rating: 5
    },
    {
      name: 'Zeynep Demir',
      role: 'Müşteri',
      avatar: '👩',
      content: 'Alışverişi sosyal medya ile birleştiren mükemmel bir uygulama. Arkadaşlarımla birlikte alışveriş yapıyoruz.',
      rating: 5
    }
  ]

  return (
    <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4" variant="outline">Kullanıcı Yorumları</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Kullanıcılarımız Ne Diyor?
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.content}"</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
