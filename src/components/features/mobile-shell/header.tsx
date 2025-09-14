import { Bell, Settings, ShoppingCart } from '@/lib/icons'

const Header = () => {
  return (
    <div className="mx-1 rounded-3xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <ShoppingCart className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold">TomNAP</h1>
          <p className="text-xs text-white/70">Social Commerce</p>
        </div>
      </div>
      {/* Minimal başlık; mock rozetler kaldırıldı */}
    </div>
  )
}

export default Header


