import AccordionCard, { type AccordionItem } from '../ui/AccordionCard'

const XP_COLORS = ['#CC3300', '#4CAF50', '#1A6DC2', '#F5A500'] as const

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-canvas-border" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: 'genel-notlar',
    title: 'Genel Notlar',
    badge: '14 Madde',
    accentColor: XP_COLORS[0],
    children: (
      <BulletList
        items={[
          '+18 schemalardan safe search false getirilmesi',
          'Arayüz yapısı tartışılacak (şehirlere / eyalete göre arka plan)',
          'Filtreleme zenginleştirmesi (bütçe bazlı vb.)',
          'FAQ (ilerisi için) + chatbot',
          'Login olmadan / olarak: rollback, transaction, logging',
          'Banner konusu',
          'Nested UI: işletmelerden arka plan ve diğer bilgilerin alınması',
          'Nested UI: harita eklenmesi',
          'UBT logo üreten (gerekirse paralı) en iyi AI uygulaması',
          'Arrow (şehirdeki gibi) alternatif seçenekler',
          'UBT giriş yazısı',
          'Aşağı kaydırmaya teşvik edecek arka plan fotoğrafı',
          'Standort kategori birleştirme',
          'Premium vb. kaldırılması',
          'Suche sonrası akış',
          'Geri dönüş / feedback mekanizması',
        ]}
      />
    ),
  },
  {
    id: 'banner-ui',
    title: 'Banner ve UI Yapısı',
    badge: '5 Madde',
    accentColor: XP_COLORS[1],
    children: (
      <BulletList
        items={[
          'Akan Banner',
          'Sabit Banner 1',
          'Sabit Banner 2',
          'Tekrarlayan yapı: Akan Banner → Sabit Banner 1 → Akan Banner',
          'Banner kurgusu UX ve monetization tarafında aktif bir deneme alanı',
        ]}
      />
    ),
  },
  {
    id: 'screen-akisi',
    title: 'Screen Akışı',
    badge: '4 Madde',
    accentColor: XP_COLORS[2],
    children: (
      <BulletList
        items={[
          'Screen 1',
          'Screen 2',
          'Screen 3',
          'Suche Screen',
          'Mobil card-based akış mantığı sonraki wireframe\'lere temel olabilir',
        ]}
      />
    ),
  },
  {
    id: 'kritik-noktalar',
    title: 'Kritik Noktalar',
    badge: '5 Madde',
    accentColor: XP_COLORS[3],
    children: (
      <BulletList
        items={[
          'Nested UI + işletmeden veri çekme → core feature',
          'Rezervasyon + admin panel → ana sistem backbone',
          'Banner + UI akışı → monetization / UX kritik',
          'Suche sonrası flow → ürünün kalbi',
          'Login\'siz kullanım + logging → teknik risk / karar noktası',
        ]}
      />
    ),
  },
]

export default function BrainstormingManager() {
  return (
    <section className="space-y-6" aria-labelledby="brainstorming-heading">
      <div className="space-y-2">
        <h2 id="brainstorming-heading" className="text-xl font-semibold text-ink-primary">
          Brainstorming
        </h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          Ham fikirler, açık sorular ve konsept notları. Her kategori bir konu alanını temsil eder.
        </p>
      </div>

      <AccordionCard items={ACCORDION_ITEMS} defaultOpenId="genel-notlar" />
    </section>
  )
}
