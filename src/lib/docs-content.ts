import {
  docsOverviewCards,
  getDocCategory,
  type DocCategorySlug,
  type DocIconKey,
} from './docs-hub'
import { buildDocCategoryHref, buildDocItemHref } from './docs-navigation'

const detailByItemId: Record<string, string> = {
  'mvp-urun-tanimi': `DesireMap, Almanya'da faaliyet gosteren yetiskin hizmet saglayicilari ile kullanicilari bir araya getiren dijital kesif ve listeleme platformu olarak konumlaniyor.

Platform modeli hibrit:
- Listeleme platformu
- Lead generation ve rezervasyon yonlendirmesi

Temel deger onerisi:
- Genis ve guncel veri tabani
- Kullanici icin hizli ve anonim erisim
- Isletme icin gorunurluk ve musteri kazanimi

Marka tonu:
- Luks
- Gizlilik odakli
- Low-profile ama guclu`,
  'mvp-hedef-kitle': `Ana kullanici segmenti 18+ erkek agirlikli, Almanya merkezli ve gizlilik hassasiyeti yuksek bir kitle.

Isletme tarafi:
- Bireysel calisanlar
- Kucuk isletmeler
- Buyuk isletmeler

Kritik insight:
- En buyuk korku ifsa olmak
- Bu nedenle urunun cekirdegi anonimlik ve veri minimizasyonu olmali`,
  'mvp-gizlilik-guvenlik': `Veri minimizasyonu temel ilke:
- Zorunlu veri olabildigince azaltilacak
- Gercek isim, telefon, kimlik gibi alanlar zorunlu olmayacak

Teknik guvenlik:
- HTTPS zorunlu
- bcrypt ya da argon2 ile sifre hashleme
- Rate limiting ve bot korumasi

Anonimlik onerileri:
- Guest mode
- Disposable email destegi
- Partial logging
- Session tabanli kullanim

Hesap silme:
- Instant soft delete
- 30 gun sonra hard delete
- GDPR uyumlu erase sureci`,
  'mvp-hukuki-cerceve': `Almanya icin platform rolu net:
- Araci platform
- Hizmeti dogrudan saglamayan, listeleyen ve yonlendiren taraf

Zorunlu hukuki sayfalar:
- Impressum
- Datenschutzerklarung
- AGB

Risk alanlari:
- Insan ticareti icerikleri
- Zorla calistirma
- Fake ilanlar

Operasyonel cevap:
- Manuel moderasyon
- Sikayet sistemi
- Isletme iceriginde sorumlulugun acik ayrimi`,
  'mvp-monetizasyon': `Gelir modeli cift tarafli uyelik mantigina yaslaniyor.

Gelir kalemleri:
- Premium listing
- One cikarma
- Abonelik paketleri
- Reklam alanlari
- Opsiyonel affiliate

Paket mantigi:
- Free
- Starter
- Pro
- VIP`,
  'mvp-urun-ozellikleri': `Core feature set:
- Sehir ve kategori bazli listeleme
- Sehir, eyalet ve hizmet turu filtreleme
- Rezervasyon yonlendirme
- Fotograf ve video icerigi
- Isletme aciklamalari

Review sistemi kontrollu ilerlemeli:
- Sadece login kullanici yorum yazabilmeli
- Rate limiting olmali
- AI ve manuel moderasyon desteklenmeli
- Ileride verified visit gibi guven katmanlari eklenebilir`,
  'mvp-marka-pr': `Dil stratejisi:
- Ana dil Almanca
- Ikincil diller TR, EN, AR ve RU

Marka tonu:
- Acik ama abartisiz
- Low-profile premium

Growth ve PR cizgisi:
- SEO cok kritik
- Backlink ve forum dagitimi onemli
- Asiri agresif reklamdan ve mainstream medya exposure'dan kacinilmali`,
  'mvp-growth-stratejisi': `Ilk kazanım modeli:
- Ucretsiz listing
- Promosyon paketleri
- Direkt outreach

Acquisition kanallari:
- SEO
- Paid ads
- Referral sistemi

Retention tarafi:
- Notification sistemi
- Favoriler
- Yeni eklenenler feed'i
- Ileride personalizasyon`,
  'mvp-teknik-mimari': `Belirtilen stack:
- Frontend: Next.js
- Backend: Node.js
- Veritabani: PostgreSQL
- Hosting: Strato

Onerilen altyapi destekleri:
- Cloudflare CDN
- Rate limiting
- Gerekirse Redis cache

Kritik teknik konular:
- SEO friendly yapi
- Server side rendering
- Performans optimizasyonu
- Moderasyon dashboard'u`,
  'mvp-kritik-eksikler': `Ilk etapta en riskli bosluklar:
1. Sikayet sistemi eksik
2. Fake profil cozum akisi net degil
3. GDPR detaylari tamamlanmamis
4. Hukuki metinler hazir degil
5. Moderasyon surecleri belirsiz

Bu sayfa sonraki sprintlerde onceliklendirme listesine donusturulmeli.`,
  'mvp-sonraki-adim': `Kaynagin sonundaki onerilen uretim paketleri:
- Privacy Policy
- Terms and Conditions
- Conversion odakli landing page copy

Bu alan, MVP sonrasinda karar verilen ciktilarin uretim backlog'una donusecek.`,
  'todo-teknik-yapilacaklar': `Teknik yapilacaklar:
- DB Design
- Security / Backend Mimarisi

Bu blok Blank Board notlarindaki dogrudan todo kalemlerini korur.`,
  'todo-egitim': `Egitim:
- JS / TS kurslarini bitir

Bu not bireysel hazirlik ve delivery kapasitesi icin ayri tutuldu.`,
  'todo-operasyonel-basliklar': `Yonetim alanlari ve tekrar eden ana sistem bilesenleri:
- Rezervasyon
- Admin paneli
- Nested UI (isletmelerden veri cekme)
- Yasal surecler

Ayni dörtlü not tahtasinda tekrar tekrar geciyor; bu nedenle backbone olarak ele alinmali.`,
  'brainstorming-genel-notlar': `Genel notlar:
- +18 schemalardan safe search false getirilmesi
- Arayuz yapisi tartisilacak (sehirlere / eyalete gore arka plan)
- Filtreleme zenginlestirmesi (butce bazli vb.)
- FAQ (ilerisi icin) + chatbot
- Login olmadan / olarak:
  rollback
  transaction
  logging
- Banner konusu
- Nested UI:
  isletmelerden arka plan ve diger bilgilerin alinmasi
  harita eklenmesi
- UBT logo ureten (gerekirse parali) en iyi AI uygulamasi
- Arrow (sehirdeki gibi) alternatif secenekler
- UBT giris yazisi
- Asagi kaydirmaya tesvik edecek arka plan fotografi
- Standort kategori birlestirme
- Premium vb. kaldirilmasi
- Suche sonrasi akis
- Geri donus / feedback mekanizmasi`,
  'brainstorming-banner-ui': `UI / Banner yapisi:
- Akan Banner
- Sabit Banner 1
- Sabit Banner 2

Tekrarlayan yapi:
- Akan Banner
- Sabit Banner 1
- Akan Banner

Bu notlar banner kurgusunun UX ve monetization tarafinda aktif bir deneme alani oldugunu gosteriyor.`,
  'brainstorming-screen-akisi': `Screen akisi:
- Screen 1
- Screen 2
- Screen 3
- Suche Screen

Mobil card-based akis mantigi sonraki wireframe'lere temel olabilir.`,
  'brainstorming-kritik-noktalar': `One cikan kritik noktalar:
- Nested UI + isletmeden veri cekme -> core feature
- Rezervasyon + admin panel -> ana sistem backbone
- Banner + UI akisi -> monetization / UX kritik
- Suche sonrasi flow -> urunun kalbi
- Login'siz kullanim + logging -> teknik risk / karar noktasi`,
  'milestones-placeholder': `Blank Board notlarinda tarih ya da kesin milestone listesi bulunmuyor.

Bu sayfa su an su is icin hazirlandi:
- milestone cikarma
- tarih atama
- owner belirleme
- faz kapilari tanimlama

Yani alan acildi ama kaynakta milestone verisi olmadigi icin bilincli olarak bos tutuluyor.`,
  'proje-takip-moduller': `Uygulama modulleri:
- Rezervasyon
- Admin paneli
- Nested UI (isletmelerden veri cekme)
- Yasal surecler

Bu moduller hem yonetim alanlari hem de tekrar eden sistem bilesenleri olarak notlarda geciyor.`,
  'proje-takip-diyagram': `Gorsel diyagramdan anlasilanlar:
- Sol tarafta Site / Notlar bloklari
- Orta alanda feature listeleri ve backend / surec notlari
- Sag tarafta mobil UI ekran akisi ve kullanici akisi baglantilari
- En sagda muhtemelen placeholder / future screen alani

Bu yorumlar bilgi mimarisi ve ekranlar arasi gecis kurgusunu anlamak icin tutuldu.`,
  'proje-takip-marka': `Urun / Marka:
- Desiremap

Bu not tek satirlik olsa da proje kimliginin merkezine yerlestirilmeli.`,
  'contacts-kisiler': `Ilgili kisiler:
- Baran Kaplan
- Sahin
- UBT`,
  'links-kaynaklar': `Kaynak:
- Blank Board PDF notlari

Bu bolum ileride:
- dokuman linkleri
- figma / board linkleri
- harici arac linkleri
- operasyonel referanslar
icin kullanilacak.`,
  'proje-status-backend': `Backend status alani ilk etapta bos tutuluyor.

Burada ileride:
- API durumu
- Veritabani ilerlemesi
- Entegrasyon notlari
- Teknik blokajlar izlenecek.`,
  'proje-status-frontend': `Frontend status alani ilk etapta bos tutuluyor.

Burada ileride:
- UI akislari
- Sayfa durumu
- Kullanici deneyimi eksikleri
- Frontend teslim listesi izlenecek.`,
}

export type ContentViewMode = 'hub-overview' | 'category-detail'
export type ContentCardDensity = 'default' | 'compact' | 'detail'
export type ContentCardActionSurface = 'card' | 'cta'

export interface ContentViewCardAction {
  type: 'link'
  href: string
  label: string
  surface?: ContentCardActionSurface
}

export interface ContentViewCard {
  id: string
  title: string
  description: string
  badge?: string
  eyebrow?: string
  detail?: string
  iconKey?: DocIconKey
  density?: ContentCardDensity
  anchorId?: string
  action?: ContentViewCardAction
}

export interface ContentViewEmptyState {
  title: string
  description: string
  action?: ContentViewCardAction
}

export interface ContentViewSection {
  id: string
  title: string
  description?: string
  columns?: 1 | 2 | 3
  cards: ContentViewCard[]
  emptyState?: ContentViewEmptyState
}

export interface ContentViewSearch {
  label: string
  placeholder: string
  helperText: string
}

export interface ContentView {
  mode: ContentViewMode
  eyebrow?: string
  title: string
  description: string
  supportingText?: string
  backLink?: {
    href: string
    label: string
  }
  metaBadges?: string[]
  search?: ContentViewSearch
  sections: ContentViewSection[]
}

export function getDocsHubContentView(): ContentView {
  return {
    mode: 'hub-overview',
    eyebrow: 'Project Space',
    title: 'DesireMap Workspace',
    description:
      'Yeni dokuman yapisi temizlendi. Sol menude MVP, operasyon panelleri ve teknik status alanlari bulunuyor.',
    supportingText:
      'Ilk etapta ana icerik MVP altinda derlendi; diger alanlar yeni notlar icin hazirlandi.',
    sections: [
      {
        id: 'workspace-sections',
        title: 'Workspace Alanlari',
        description:
          'Her kart ilgili calisma alanina gider. MVP disindaki bolumler su anda temiz bir baslangic durumu tasiyor.',
        columns: 2,
        cards: docsOverviewCards.map((card) => ({
          id: card.id,
          title: card.title,
          description: card.description,
          badge: card.categoryLabel,
          iconKey: card.iconKey,
          density: 'default',
          action: {
            type: 'link',
            href: buildDocCategoryHref(card.categorySlug),
            label: card.ctaLabel,
            surface: 'card',
          },
        })),
      },
    ],
  }
}

export function getDocCategoryContentView(categorySlug: DocCategorySlug): ContentView {
  const category = getDocCategory(categorySlug)

  return {
    mode: 'category-detail',
    eyebrow: category.label,
    title: category.overview.title,
    description: category.overview.description,
    supportingText: category.shortDescription,
    backLink: {
      href: '/',
      label: 'Workspace ana sayfasina don',
    },
    metaBadges: [
      `${category.items.length} blok`,
      `Route: /${category.slug}`,
    ],
    sections: [
      {
        id: `${category.slug}-content`,
        title: category.label,
        description:
          category.slug === 'mvp'
            ? 'dm_ubt_docu kaynagindan duzenlenmis ana basliklar asagida bloklar halinde yer aliyor.'
            : 'Bu alan yeni icerikler icin acildi. Simdilik temiz bir baslangic durumu korunuyor.',
        columns: 1,
        cards: category.items.map((item, index) => ({
          id: item.id,
          anchorId: item.id,
          title: item.label,
          description: item.description,
          detail: detailByItemId[item.id] ?? 'Bu bolum icin henuz icerik girilmedi.',
          badge: category.label,
          eyebrow: `Blok ${String(index + 1).padStart(2, '0')}`,
          density: 'detail',
          action: {
            type: 'link',
            href: buildDocItemHref(item),
            label: 'Permalink',
            surface: 'cta',
          },
        })),
      },
    ],
  }
}
