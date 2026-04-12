export type DocCategorySlug =
  | 'mvp'
  | 'todo'
  | 'brainstorming'
  | 'milestones'
  | 'proje-takip'
  | 'contacts'
  | 'links'
  | 'proje-status'
  | 'neden-var'

export type DocIconKey =
  | 'book'
  | 'calendar'
  | 'file-text'
  | 'home'
  | 'layers'
  | 'test-tube'

export interface DocNavItem {
  id: string
  label: string
  description: string
  href: string
  categorySlug: DocCategorySlug
  featuredOrder?: number
}

export interface DocCategoryOverview {
  title: string
  description: string
  ctaLabel: string
}

export interface DocCategoryDefinition {
  slug: DocCategorySlug
  label: string
  shortDescription: string
  iconKey: DocIconKey
  defaultExpanded: boolean
  overview: DocCategoryOverview
  items: DocNavItem[]
}

export interface DocOverviewCard {
  id: string
  title: string
  description: string
  categorySlug: DocCategorySlug
  categoryLabel: string
  iconKey: DocIconKey
  ctaLabel: string
  href: string
}

export interface DocQuickLink {
  id: string
  label: string
  categorySlug: DocCategorySlug
}

export const defaultDocCategorySlug: DocCategorySlug = 'neden-var'
export const defaultDocItemId = 'neden-var-amac'

export const docsCategories: DocCategoryDefinition[] = [
  {
    slug: 'neden-var',
    label: 'BU SAYFA NEDEN VAR?',
    shortDescription: 'Bu dokumantasyon panosunun varlik sebebi ve amaci.',
    iconKey: 'home',
    defaultExpanded: true,
    overview: {
      title: 'Bu Sayfa Neden Var?',
      description: 'DesireMap proje panosunun neden olusturuldugunu, nasil kullanilacagini ve ne ise yaradigini aciklayan giris bolumu.',
      ctaLabel: 'Amaci oku',
    },
    items: [
      {
        id: 'neden-var-amac',
        label: 'Amac ve Varlik Sebebi',
        description: 'Bu panonun neden olusturuldugu ve hangi sorulara cevap verdigi.',
        href: '#neden-var-amac',
        categorySlug: 'neden-var',
      },
    ],
  },
  {
    slug: 'mvp',
    label: 'MVP',
    shortDescription:
      'dm_ubt_docu kaynagindan duzenlenmis urun, gizlilik, PR ve operasyon omurgasi.',
    iconKey: 'book',
    defaultExpanded: true,
    overview: {
      title: 'MVP',
      description:
        'Ilk faz urun tanimi, hedef kitle, guvenlik, hukuk, monetizasyon ve teknik mimari notlari.',
      ctaLabel: 'MVP dokumanina git',
    },
    items: [
      {
        id: 'mvp-urun-tanimi',
        label: 'Urun Tanimi ve Konumlandirma',
        description: 'Platform ne yapiyor, nasil konumlaniyor ve hangi degeri tasiyor.',
        href: '#mvp-urun-tanimi',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-hedef-kitle',
        label: 'Hedef Kitle',
        description: 'Kullanici segmentleri, isletme tipleri ve kritik davranis icgoruleri.',
        href: '#mvp-hedef-kitle',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-gizlilik-guvenlik',
        label: 'Gizlilik ve Guvenlik',
        description: 'Veri minimizasyonu, anonimlik, hesap silme ve teknik koruma ilkeleri.',
        href: '#mvp-gizlilik-guvenlik',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-hukuki-cerceve',
        label: 'Hukuki Cerceve',
        description: 'Almanya icin araci platform rolu, zorunlu sayfalar ve risk alanlari.',
        href: '#mvp-hukuki-cerceve',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-monetizasyon',
        label: 'Monetizasyon',
        description: 'Uyelik paketleri, premium alanlar ve gelir kalemleri.',
        href: '#mvp-monetizasyon',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-urun-ozellikleri',
        label: 'Urun Ozellikleri',
        description: 'Core feature set, icerik modeli ve review sistemine dair notlar.',
        href: '#mvp-urun-ozellikleri',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-marka-pr',
        label: 'Marka ve PR',
        description: 'Dil, ton, growth yaklasimi ve kacinilmasi gereken alanlar.',
        href: '#mvp-marka-pr',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-growth-stratejisi',
        label: 'Growth Stratejisi',
        description: 'Ilk kullanici kazanimi, acquisition ve retention ekseni.',
        href: '#mvp-growth-stratejisi',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-teknik-mimari',
        label: 'Teknik Mimari',
        description: 'Stack, performans, admin panel ve altyapi notlari.',
        href: '#mvp-teknik-mimari',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-kritik-eksikler',
        label: 'Kritik Eksikler',
        description: 'Ilk etapta kapanmasi gereken operasyonel ve hukuki bosluklar.',
        href: '#mvp-kritik-eksikler',
        categorySlug: 'mvp',
      },
      {
        id: 'mvp-sonraki-adim',
        label: 'Sonraki Adim',
        description: 'Bir sonraki uretim paketleri ve cikartilabilecek deliverable alanlari.',
        href: '#mvp-sonraki-adim',
        categorySlug: 'mvp',
      },
    ],
  },
  {
    slug: 'todo',
    label: 'TODO',
    shortDescription: 'Yapilacaklar listesi icin ayrilmis temiz alan.',
    iconKey: 'file-text',
    defaultExpanded: false,
    overview: {
      title: 'Todo',
      description: 'Sprint bazli ya da operasyonel gorevlerin tek listede toplandigi ve bu sayfadan yonetildigi alan.',
      ctaLabel: 'Todo alanini ac',
    },
    items: [
      {
        id: 'todo-listesi',
        label: 'Todo Listesi ve Yonetim Alani',
        description: 'Mevcut backlog ozeti ve bu sayfadan yonetilen canli todo listesi.',
        href: '#todo-listesi',
        categorySlug: 'todo',
      },
    ],
  },
  {
    slug: 'brainstorming',
    label: 'BRAINSTORMING',
    shortDescription: 'Ham fikirler, acik sorular ve konsept notlari icin ayri alan.',
    iconKey: 'layers',
    defaultExpanded: false,
    overview: {
      title: 'Brainstorming',
      description: 'Yeni urun fikirleri ve acik dusunce alanlari burada tutulacak.',
      ctaLabel: 'Brainstorming alanini ac',
    },
    items: [
      {
        id: 'brainstorming-genel-notlar',
        label: 'Genel Notlar',
        description: 'Safe search, arayuz, filtreleme, search flow ve feedback eksenli ham notlar.',
        href: '#brainstorming-genel-notlar',
        categorySlug: 'brainstorming',
      },
      {
        id: 'brainstorming-banner-ui',
        label: 'Banner ve UI Yapisi',
        description: 'Banner tekrar yapisi, arka plan kurgusu ve nested UI fikirleri.',
        href: '#brainstorming-banner-ui',
        categorySlug: 'brainstorming',
      },
      {
        id: 'brainstorming-screen-akisi',
        label: 'Screen Akisi',
        description: 'Screen 1, Screen 2, Screen 3 ve Suche ekran akisi notlari.',
        href: '#brainstorming-screen-akisi',
        categorySlug: 'brainstorming',
      },
      {
        id: 'brainstorming-kritik-noktalar',
        label: 'Kritik Noktalar',
        description: 'Core feature ve karar noktalarini toplayan kritik madde seti.',
        href: '#brainstorming-kritik-noktalar',
        categorySlug: 'brainstorming',
      },
    ],
  },
  {
    slug: 'milestones',
    label: 'MILESTONES',
    shortDescription: 'Teslim tarihleri, ana fazlar ve kilometre taslari.',
    iconKey: 'calendar',
    defaultExpanded: false,
    overview: {
      title: 'Milestones',
      description: 'Projenin ana teslim noktalarini izlemek icin ayrilan bolum.',
      ctaLabel: 'Milestones alanini ac',
    },
    items: [
      {
        id: 'milestones-placeholder',
        label: 'Milestone Cikarma Alani',
        description: 'Kaynak notlarda tarihli milestone gecmiyor; bu alan sonraki planlama icin hazir.',
        href: '#milestones-placeholder',
        categorySlug: 'milestones',
      },
    ],
  },
  {
    slug: 'proje-takip',
    label: 'PROJE TAKIP',
    shortDescription: 'Durum, blokaj ve sahiplik bazli genel proje takibi.',
    iconKey: 'home',
    defaultExpanded: false,
    overview: {
      title: 'Proje Takip',
      description: 'Operasyonel izleme ve calisma ritmi icin ayrilan ana takip sayfasi.',
      ctaLabel: 'Proje takip alanini ac',
    },
    items: [
      {
        id: 'proje-takip-moduller',
        label: 'Uygulama Modulleri',
        description: 'Rezervasyon, admin paneli, nested UI ve yasal surecler ana moduller olarak cikiyor.',
        href: '#proje-takip-moduller',
        categorySlug: 'proje-takip',
      },
      {
        id: 'proje-takip-diyagram',
        label: 'Diyagramdan Anlasilanlar',
        description: 'Site notlari, feature alanlari, mobil akıs ve future screen yorumlari.',
        href: '#proje-takip-diyagram',
        categorySlug: 'proje-takip',
      },
      {
        id: 'proje-takip-marka',
        label: 'Urun ve Marka',
        description: 'Marka ekseninde Desiremap notu ve ana urun kimligi.',
        href: '#proje-takip-marka',
        categorySlug: 'proje-takip',
      },
    ],
  },
  {
    slug: 'contacts',
    label: 'CONTACTS',
    shortDescription: 'Kisi ve kurum baglantilari icin merkezi liste alani.',
    iconKey: 'file-text',
    defaultExpanded: false,
    overview: {
      title: 'Contacts',
      description: 'Paydas, kurum ve servis baglantilarinin tek listede toplandigi ve bu sayfadan yonetildigi alan.',
      ctaLabel: 'Contacts alanini ac',
    },
    items: [
      {
        id: 'contacts-listesi',
        label: 'Contact Listesi ve Yonetim Alani',
        description: 'Kisi ve kurum kayitlarinin bu sayfadan yonetilen canli listesi.',
        href: '#contacts-listesi',
        categorySlug: 'contacts',
      },
    ],
  },
  {
    slug: 'links',
    label: 'LINKS',
    shortDescription: 'Referans linkleri, harici kaynaklar ve hizli erisimler.',
    iconKey: 'file-text',
    defaultExpanded: false,
    overview: {
      title: 'Links',
      description: 'Dokumanlar, araclar ve kaynaklar icin hizli link havuzu.',
      ctaLabel: 'Links alanini ac',
    },
    items: [
      {
        id: 'links-kaynaklar',
        label: 'Kaynaklar',
        description: 'Blank Board notlari ve ilerde eklenecek referans linkleri icin alan.',
        href: '#links-kaynaklar',
        categorySlug: 'links',
      },
    ],
  },
  {
    slug: 'proje-status',
    label: 'PROJE STATUS',
    shortDescription: 'Teknik akis icin backend ve frontend durum bolumleri.',
    iconKey: 'test-tube',
    defaultExpanded: false,
    overview: {
      title: 'Proje Status',
      description: 'Teknik durum takibi backend ve frontend ekseninde ayrisiyor.',
      ctaLabel: 'Status alanini ac',
    },
    items: [
      {
        id: 'proje-status-backend',
        label: 'Backend',
        description: 'API, veri modeli ve sistem entegrasyonlarinin durum takibi.',
        href: '#proje-status-backend',
        categorySlug: 'proje-status',
      },
      {
        id: 'proje-status-frontend',
        label: 'Frontend',
        description: 'Arayuz, deneyim ve teslim akislarinin durum takibi.',
        href: '#proje-status-frontend',
        categorySlug: 'proje-status',
      },
    ],
  },
]

export const docsOverviewCards: DocOverviewCard[] = docsCategories.map((category) => ({
  id: `${category.slug}-overview-card`,
  title: category.overview.title,
  description: category.overview.description,
  categorySlug: category.slug,
  categoryLabel: category.label,
  iconKey: category.iconKey,
  ctaLabel: category.overview.ctaLabel,
  href: `/${category.slug}`,
}))

export const docsQuickLinks: DocQuickLink[] = []

export const docCategorySlugs = docsCategories.map((category) => category.slug)

export function isDocCategorySlug(value: string | null): value is DocCategorySlug {
  return value !== null && docsCategories.some((category) => category.slug === value)
}

export function getDocCategory(slug: DocCategorySlug): DocCategoryDefinition {
  return docsCategories.find((category) => category.slug === slug) ?? docsCategories[0]
}

export function getDocItemById(itemId: string | null): DocNavItem | undefined {
  if (!itemId) {
    return undefined
  }

  return docsCategories
    .flatMap((category) => category.items)
    .find((item) => item.id === itemId)
}
