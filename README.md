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
npm run typecheck
npm test
```

## Mimari

- `app/core`: Modül kayıtları, alan tipleri ve saf yardımcılar
- `app/data`: IndexedDB bağlantısı ve repository’ler
- `app/hooks`: Tekrar kullanılabilir etkileşim ve veri akışları
- `app/components`: Bölümlerden bağımsız arayüz parçaları
- `app/features`: Virdlerim, Beğenilenler, Keşfet, kitap ve yedekleme özellikleri
- `app/styles`: Sorumluluklarına göre ayrılmış global stil katmanları

Kullanıcı kütüphanesi cihazdaki IndexedDB’de tutulur. Hesap ve bulut eşitleme henüz bulunmaz.
Uygulama `/virdlerim` adresinde açılır; eski `/` bağlantıları buraya yönlenir. Eski tür rotaları ve depoları mevcut kayıtlarla uyumluluk için korunur.

### Koleksiyon modeli

Virdlerim ve Beğenilenler aynı kaydın bağımsız üyelikleridir; kalp ve `+` kayıt kopyalamaz.
Tür ve vakit seçimleri etiketlerdir. Yeni kayıtlar ortak kayıt oluşturma akışından geçer.
Eski dua/ezber/şiir/zikir depoları bir uyumluluk katmanında okunur; kimlikler ve geçmiş korunur.
Kitap kayıtları ayrı alan modeline sahip olduğu için eski kitap ekranları erişilebilir kalır.

- `core/collections.ts`: kimlik, üyelik ve sıralama kuralları.
- `data/collection-repository.ts`: oluşturma, alan güncelleme, üyelik ve atomik sıralama.
- `hooks/useRecordLibrary.ts`: yükleme ve seri yazma yaşam döngüsü.
- `hooks/useCompletionState.ts`: ortak günlük tamamlama, hata geri alma ve yerel gün değişimi.
- `features/collections/CollectionApp.tsx`: iki koleksiyonun ortak ekranı.
- `components/RecordFilters.tsx`: ekranlar arası ortak çoklu filtreler.
- `core/record-filters.ts`: saf filtre ve çoklu seçim kuralları; filtre bileşeni hook tipine bağımlı değildir.
- `hooks/useDialogFocus.ts`: onay dialoglarının ortak odak, Escape ve Tab yaşam döngüsü.
- `core/module-registry.ts`: görünen bölümler ve eski depoların tek kayıt kaynağı.

IndexedDB v8 yükseltmesi kayıt silmez. Önceki sürümlerdeki yıkıcı temizlik kaldırılmıştır.
Yedek dışa aktarımı bütün eski depoları ve tamamlanmaları içerir; içe aktarma/bulut eşitleme yoktur.

### Kontroller

`npm run test:unit`, bellekte IndexedDB ile migration, üyelik bağımsızlığı, atomik geri alma,
çakışan kimlikler ve sıralama senaryolarını sınar. Kullanıcının tarayıcı verisini değiştirmez.
`npm test` ayrıca üretim build'i, sunucu çıktısı, eski rotalar ve mimari sınır kontrollerini çalıştırır.
Gerçek iOS PWA, çevrimdışı rota geçişleri ve dokunarak sıralama ayrıca cihazda kontrol edilmelidir.
