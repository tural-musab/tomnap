import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, Instagram, Twitter, Youtube, 
  Linkedin, Shield, Globe 
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">TomNAP</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sosyal ticaretin geleceği. Video ile alışverişin buluştuğu platform.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
                aria-label="Youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">Hakkımızda</Link></li>
              <li><Link href="/features" className="hover:text-white transition">Özellikler</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Fiyatlandırma</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Destek</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white transition">Yardım Merkezi</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">İletişim</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Kullanım Koşulları</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Gizlilik Politikası</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 TomNAP. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Badge variant="outline" className="text-gray-400 border-gray-700">
              <Shield className="w-3 h-3 mr-1" />
              SSL Güvenli
            </Badge>
            <Badge variant="outline" className="text-gray-400 border-gray-700">
              <Globe className="w-3 h-3 mr-1" />
              Türkiye
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}
