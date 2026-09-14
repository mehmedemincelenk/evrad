# Zikirlerim

Mobile-first, çevrimdışı çalışabilen kişisel ibadet ve okuma takip PWA’sı.

## Geliştirme

Node.js 22.13 veya üzeri gerekir.

```bash
npm install
npm run dev
```

Doğrulama için:

```bash
npm run lint
npm test
```

## Mimari

- `app/core`: Modül kayıtları, alan tipleri ve saf yardımcılar
- `app/data`: IndexedDB bağlantısı ve repository’ler
- `app/hooks`: Tekrar kullanılabilir etkileşim ve veri akışları
- `app/components`: Bölümlerden bağımsız arayüz parçaları
- `app/features`: Zikir/dua/ezber, kitap, keşfet ve ana sayfa özellikleri
- `app/styles`: Sorumluluklarına göre ayrılmış global stil katmanları

Kullanıcı kütüphanesi cihazdaki IndexedDB’de tutulur. Hesap ve bulut eşitleme henüz bulunmaz.
