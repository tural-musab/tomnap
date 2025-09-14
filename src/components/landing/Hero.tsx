'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, ChevronRight, Rocket, Play, Shield, Globe, Zap 
} from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 rounded-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Yeni Nesil Sosyal E-Ticaret Platformu</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Video İzle,
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Anında Satın Al
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
          >
            TikTok tarzı video akışında ürünleri keşfedin, influencer'ları takip edin,
            arkadaşlarınızla birlikte alışveriş yapın. Sosyal ticaretin geleceği burada!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 rounded-full">
                <Rocket className="w-5 h-5 mr-2" />
                Hemen Başla
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2">
                <Play className="w-5 h-5 mr-2" />
                Demo İzle
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              <span>SSL Güvenli</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              <span>7/24 Destek</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              <span>Hızlı Teslimat</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Image/Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-1">
              <div className="bg-gray-900 rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mock Phone Screens */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative">
                      <div className="bg-gray-800 rounded-3xl p-4 aspect-[9/16]">
                        <div className="bg-gray-700 rounded-2xl h-full flex flex-col items-center justify-center">
                          <Play className="w-12 h-12 text-white/50 mb-2" />
                          <span className="text-white/50 text-sm">Video {i}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
