export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Kullanım Koşulları</h1>
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Kabul Edilen Şartlar</h2>
            <p className="text-gray-600 dark:text-gray-400">
              TomNAP platformunu kullanarak, bu kullanım koşullarını kabul etmiş olursunuz.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Hizmet Tanımı</h2>
            <p className="text-gray-600 dark:text-gray-400">
              TomNAP, sosyal ticaret özelliklerine sahip bir video paylaşım ve e-ticaret platformudur.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Kullanıcı Sorumlulukları</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Doğru ve güncel bilgi sağlamak</li>
              <li>Hesap güvenliğini korumak</li>
              <li>Yasalara uygun hareket etmek</li>
              <li>Diğer kullanıcıların haklarına saygı göstermek</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Fikri Mülkiyet</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Platform üzerindeki tüm içerikler ilgili sahiplerinin mülkiyetindedir.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. İletişim</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sorularınız için: support@tomnap.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
