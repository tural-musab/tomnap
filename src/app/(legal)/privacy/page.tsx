export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Gizlilik Politikası</h1>
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Toplanan Bilgiler</h2>
            <p className="text-gray-600 dark:text-gray-400">
              TomNAP, kullanıcı deneyimini iyileştirmek için aşağıdaki bilgileri toplar:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mt-2">
              <li>Ad, soyad ve email adresi</li>
              <li>Profil bilgileri ve tercihleri</li>
              <li>Alışveriş geçmişi</li>
              <li>Cihaz ve konum bilgileri</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Bilgilerin Kullanımı</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Toplanan bilgiler şu amaçlarla kullanılır:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mt-2">
              <li>Kişiselleştirilmiş deneyim sunmak</li>
              <li>Sipariş işlemlerini gerçekleştirmek</li>
              <li>Güvenlik ve dolandırıcılık önlemleri</li>
              <li>Yasal yükümlülükleri yerine getirmek</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Bilgi Güvenliği</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Bilgileriniz endüstri standardı güvenlik önlemleriyle korunmaktadır.
              SSL şifreleme ve güvenli sunucular kullanılmaktadır.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Çerezler</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Platform deneyimini iyileştirmek için çerezler kullanılmaktadır.
              Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. KVKK Hakları</h2>
            <p className="text-gray-600 dark:text-gray-400">
              KVKK kapsamında bilgilerinize erişim, düzeltme ve silme haklarına sahipsiniz.
              Taleplerinizi privacy@tomnap.com adresine iletebilirsiniz.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. İletişim</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gizlilik ile ilgili sorularınız için: privacy@tomnap.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
