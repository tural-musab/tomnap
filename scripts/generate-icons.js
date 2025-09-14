#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * Bu script'i çalıştırmadan önce sharp paketini yükleyin:
 * npm install --save-dev sharp
 * 
 * Kullanım:
 * 1. logo/ klasöründe yüksek çözünürlüklü (min 512x512) logo.png dosyası olmalı
 * 2. node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon boyutları
const sizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  // Apple Touch Icons
  { size: 180, name: 'apple-icon-180x180.png' },
  { size: 120, name: 'apple-icon-120x120.png' },
  // Favicon sizes
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
];

// Base logo path
const baseLogo = path.join(__dirname, '../logo/logo.png');
const outputDir = path.join(__dirname, '../public/icons');

// Dizin yoksa oluştur
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  try {
    // Base logo kontrolü
    if (!fs.existsSync(baseLogo)) {
      console.error(`❌ Base logo bulunamadı: ${baseLogo}`);
      console.log('📝 logo/logo.png dosyasını oluşturun (min 512x512px)');
      return;
    }

    console.log('🎨 Icon'lar oluşturuluyor...');

    // Her boyut için icon oluştur
    for (const { size, name } of sizes) {
      const outputPath = path.join(outputDir, name);
      
      await sharp(baseLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 147, g: 51, b: 234, alpha: 0 } // Purple background (#9333ea)
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ ${name} oluşturuldu`);
    }

    // Maskable icon oluştur (daha fazla padding ile)
    await sharp(baseLogo)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 147, g: 51, b: 234, alpha: 1 } // Solid purple background
      })
      .extend({
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
        background: { r: 147, g: 51, b: 234, alpha: 1 }
      })
      .resize(512, 512)
      .png()
      .toFile(path.join(outputDir, 'icon-512x512-maskable.png'));
    
    console.log('✅ Maskable icon oluşturuldu');

    // Favicon.ico oluştur (multi-size)
    await sharp(baseLogo)
      .resize(32, 32)
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('✅ Favicon.ico oluşturuldu');

    console.log('\n🎉 Tüm iconlar başarıyla oluşturuldu!');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

generateIcons();
