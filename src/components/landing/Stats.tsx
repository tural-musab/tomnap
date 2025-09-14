'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Stats Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const steps = 50
    const increment = value / steps
    const stepDuration = duration / steps
    
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)
    
    return () => clearInterval(timer)
  }, [value])
  
  return (
    <span className="tabular-nums">
      {count.toLocaleString('tr-TR')}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="py-20 px-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-purple-600 mb-2">
              <AnimatedCounter value={1000000} suffix="+" />
            </div>
            <div className="text-gray-600 dark:text-gray-400">Aktif Kullanıcı</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-pink-600 mb-2">
              <AnimatedCounter value={50000} suffix="+" />
            </div>
            <div className="text-gray-600 dark:text-gray-400">Satıcı</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">
              <AnimatedCounter value={500000} suffix="+" />
            </div>
            <div className="text-gray-600 dark:text-gray-400">Ürün</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">
              <AnimatedCounter value={10000000} suffix="+" />
            </div>
            <div className="text-gray-600 dark:text-gray-400">Video İzlenme</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
