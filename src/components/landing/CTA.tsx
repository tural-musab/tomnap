'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Hemen Başlayın!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sosyal ticaret deneyimine katılın, fırsatları kaçırmayın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full">
                Ücretsiz Hesap Oluştur
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full">
                Demo İzle
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-4 text-sm">
            <span className="flex items-center">
              <Check className="w-5 h-5 mr-1" />
              Kredi kartı gerekmez
            </span>
            <span className="flex items-center">
              <Check className="w-5 h-5 mr-1" />
              14 gün ücretsiz deneme
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
