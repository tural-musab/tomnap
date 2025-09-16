import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

type AnyPromise = Promise<unknown>

interface ProductRecord {
  id: string
  title: string
  description?: string | null
  price?: number | null
  currency?: string | null
  images?: string[] | null
  category?: string | null
  stock_quantity?: number | null
  barcode?: string | null
  created_at?: string
  updated_at?: string
  vendor?: {
    id?: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    is_verified?: boolean | null
  } | null
}

async function getProduct(id: string): Promise<ProductRecord | null> {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(
      `
      *,
      vendor:profiles!vendor_id(
        id, 
        username, 
        full_name,
        avatar_url,
        is_verified
      )
    `
    )
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error || !product) {
    return null
  }

  return product as unknown as ProductRecord
}

export async function generateMetadata({ params }: { params?: AnyPromise }): Promise<Metadata> {
  const p = (params ? await params : undefined) as { id?: string } | undefined
  const product = p?.id ? await getProduct(p.id) : null

  if (!product) {
    return {
      title: 'Ürün Bulunamadı',
      description: 'Aradığınız ürün mevcut değil veya kaldırılmış.',
    }
  }

  const productTitle = product.title
  const productDescription = product.description || `${productTitle} - TomNAP'ta keşfet`
  const productPrice = product.price ? formatPrice(product.price) : 'Fiyat Belirtilmemiş'
  const vendorName = product.vendor?.full_name || product.vendor?.username || 'TomNAP'

  return {
    title: productTitle,
    description: productDescription,
    keywords: [
      productTitle,
      product.category,
      vendorName,
      'TomNAP',
      'online alışveriş',
      'e-ticaret',
    ].filter((k): k is string => typeof k === 'string'),
    openGraph: {
      title: productTitle,
      description: productDescription,
      url: `https://tomnap.com/products/${product.id}`,
      siteName: 'TomNAP',
      images:
        product.images && product.images.length > 0 && product.images[0]
          ? [
              {
                url: product.images[0]!,
                width: 1200,
                height: 630,
                alt: productTitle,
              },
            ]
          : [],
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: productTitle,
      description: productDescription,
      images:
        product.images && product.images.length > 0 && product.images[0]
          ? [String(product.images[0])]
          : [],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params?: AnyPromise
}): Promise<ReactElement> {
  const p = (params ? await params : undefined) as { id?: string } | undefined
  const product = p?.id ? await getProduct(p.id) : null

  if (!product) {
    notFound()
  }

  const vendorName = product.vendor?.full_name || product.vendor?.username || 'TomNAP'
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || `${product.title} - TomNAP'ta keşfet`,
    image: product.images || [],
    brand: {
      '@type': 'Brand',
      name: vendorName,
    },
    manufacturer: {
      '@type': 'Organization',
      name: vendorName,
    },
    offers: {
      '@type': 'Offer',
      price: product.price || 0,
      priceCurrency: product.currency || 'TRY',
      availability:
        product.stock_quantity && product.stock_quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: vendorName,
      },
      url: `https://tomnap.com/products/${product.id}`,
      itemCondition: 'https://schema.org/NewCondition',
    },
    category: product.category,
    sku: product.id,
    gtin: product.barcode || undefined,
    productID: product.id,
    url: `https://tomnap.com/products/${product.id}`,
    dateCreated: product.created_at,
    dateModified: product.updated_at,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.images && product.images.length > 0 && (
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative rounded overflow-hidden bg-gray-100"
                >
                  <img
                    src={image}
                    alt={`${product.title} - ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>

            {product.vendor && (
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <span>Satıcı:</span>
                <span className="font-medium">{vendorName}</span>
                {product.vendor.is_verified && <span className="text-blue-500">✓</span>}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-foreground">
            {product.price ? formatPrice(product.price) : 'Fiyat Belirtilmemiş'}
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose prose-gray">
              <p>{product.description}</p>
            </div>
          )}

          {/* Category */}
          {product.category && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Kategori:</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Stok Durumu:</span>
            {product.stock_quantity && product.stock_quantity > 0 ? (
              <span className="text-green-600 font-medium">
                Stokta ({product.stock_quantity} adet)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Stokta Yok</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="pt-4">
            <button
              className="w-full bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!product.stock_quantity || product.stock_quantity <= 0}
            >
              {product.stock_quantity && product.stock_quantity > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
