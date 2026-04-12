import AccordionCard, { type AccordionItem } from '../ui/AccordionCard'

const XP_COLORS = ['#CC3300', '#4CAF50', '#1A6DC2', '#F5A500'] as const

// ─── Özet maddeleri ──────────────────────────────────────────────────────────

const OZET_MADDELER: { baslik: string; aciklama: string }[] = [
  {
    baslik: 'Rezervasyon Sistemi',
    aciklama:
      'Dinamik formlar, kullanıcı doğrulama ile güvenlik artırılacak, login olmadan rezervasyona izin verilmeyecek.',
  },
  {
    baslik: 'Kullanıcı Kısıtlamaları',
    aciklama:
      'Aynı anda üçten fazla etkinliğe katılım sınırlandırılacak, dolandırıcılık risklerine karşı kısıtlamalar getirilecek.',
  },
  {
    baslik: 'Audit Kayıtları',
    aciklama:
      'Rezervasyon iptalleri için kayıt tutulacak, yanlış bilgi yasal suç sayılacak.',
  },
  {
    baslik: 'Veritabanı Tasarımı',
    aciklama:
      'Yaklaşık 44 tablo içeren esnek bir yapı oluşturulacak, MVP için %80 oranında yeterli.',
  },
  {
    baslik: 'Reklam Modeli',
    aciklama:
      'Mekanlar reklam alanı seçebilecek, mobil tasarımda banner reklamlar yer alacak.',
  },
  {
    baslik: 'MVP Hedefi',
    aciklama:
      'Temel rezervasyon işlemleri hızlıca hayata geçirilecek, sonraki aşamalarda yeni özellikler eklenecek.',
  },
]

// ─── Accordion içerikleri ────────────────────────────────────────────────────

function BulletList({ items, tarih }: { items: string[]; tarih?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-canvas-border" />
          <span>
            {tarih && (
              <span className="mr-1.5 inline-flex items-center rounded bg-canvas-elevated px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
                {tarih}
              </span>
            )}
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
}

function SubSection({ baslik, items, tarih }: { baslik: string; items: string[]; tarih?: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted opacity-60">
        {baslik}
      </p>
      <BulletList items={items} tarih={tarih} />
    </div>
  )
}

// ─── Accordion veri tanımı ───────────────────────────────────────────────────

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: 'rezervasyon-event',
    title: 'Rezervasyon ve Event Yönetimi',
    badge: '4 Başlık',
    accentColor: XP_COLORS[0],
    children: (
      <div className="space-y-5">
        <SubSection
          tarih="12 Nisan"
          baslik="Dinamik Form ve Rezervasyon Kısıtlamaları"
          items={[
            'Formlar tamamen dinamik; kullanıcıdan katılım sayısı ve kuralları kabul etmesi gibi bilgiler alınacak.',
            'Rezervasyonların onay veya iptal süreçleri manuel ya da otomatik olarak işletmeye bırakılacak.',
            'Mekan bazında rezervasyon kapasitesi ve check-in politikaları detaylı takip edilecek.',
            'Rezervasyonlar kesinlikle login olan kullanıcılarla yapılacak, loginsiz rezervasyona izin verilmeyecek.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Çoklu Katılım ve Dolandırıcılık Kısıtlamaları"
          items={[
            'Bir kullanıcının aynı zaman diliminde üçten fazla etkinliğe katılması engellenecek.',
            'Aynı e-posta veya telefon numarası ile çoklu rezervasyonların önüne geçilecek.',
            'Toplu rezervasyonlarda her katılımcının kimlik bilgileri mekan tarafından talep edilebilecek.',
            "Mekanların onayı olmadan rezervasyonlar otomatik kabul edilmeyecek, işletmelerin inisiyatifi önemli olacak.",
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Audit Kayıtları ve Yasal Süreçler"
          items={[
            'Kullanıcının rezervasyon yaptığı tarih ve kabul ettiği kurallar kayıt altına alınacak.',
            'Mekanlarla yaşanabilecek iptal ve gelmeme durumlarında hukuki dayanak sağlanacak.',
            'Kullanıcıların yanlış bilgi vermesi yasal bir suç unsuru olarak değerlendirilebilecek.',
            'Sistem bu açıdan güçlü bir kontrol mekanizması sunmalıdır.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="MVP Aşaması ve İleri Özellikler"
          items={[
            'Canlı görüntü doğrulaması gibi ileri teknolojiler ikinci veya üçüncü aşamalarda değerlendirilecek.',
            'Mevcut sistemde rezervasyon bloklama, check-in bloklama ve event görünürlüğü filtreleri hazır.',
            'İlerleyen dönemde referans mektubu ve yapay zeka destekli sahte video tespiti gibi özellikler eklenebilir.',
          ]}
        />
      </div>
    ),
  },
  {
    id: 'veritabani-dokumantasyon',
    title: 'Veritabanı ve Teknik Dokümantasyon',
    badge: '4 Başlık',
    accentColor: XP_COLORS[1],
    children: (
      <div className="space-y-5">
        <SubSection
          tarih="12 Nisan"
          baslik="Veritabanı Yapısı (~44 Tablo)"
          items={[
            'Veritabanı tasarımı yaklaşık 44 tablo ile geniş ve esnek bir yapıya sahip, MVP için %80 oranında yeterli.',
            'Ufak tefek değişiklikler ve yeni tablolar ihtiyaca göre eklenebilecek.',
            "Veritabanının esnekliği sayesinde ilerideki ihtiyaçlara uyum sağlanacak.",
            'Backend kuralları ve kilitleme mekanizmaları hazır; backend tarafında Şahin sorumluluk alacak.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Dokümantasyon Planı"
          items={[
            'Baran veritabanı tablolarının içeriğini, iş mantığını ve kullanım senaryolarını içeren doküman hazırlayacak.',
            'SQL dosyaları ve XML formatında yapısal açıklamalar hazırlanacak.',
            'Dokümantasyon frontend ve pazarlama ekiplerine referans olarak kullanılacak.',
            'Liquibase değişiklik setleri detaylı incelenecek ve açıklanacak.',
            "1 MB'yi geçmeyen dosya boyutuyla Google Drive'da paylaşım yapılacak.",
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Export ve İnceleme Süreci"
          items={[
            'Veritabanı export ve inceleme süreci hızlandırılacak, gereksiz detaylarla vakit kaybı önlenecek.',
            'MVP için öncelikli tabloların seçilip hızlıca kurulması daha faydalı.',
            "Gereksiz overengineering'den kaçınılarak temel yapı hızla devreye alınacak.",
            'Sonrasında yeni ihtiyaçlar göz önüne alınarak sistem genişletilecek.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="API Endpoint Planı"
          items={[
            'İlk aşamada login, mekan listeleme ve rezervasyon oluşturma endpoint\'leri oluşturulacak.',
            'API yapısı sade tutulup MVP hızlı çıkarma odağında çalışılacak.',
          ]}
        />
      </div>
    ),
  },
  {
    id: 'reklam-gelir',
    title: 'Reklam ve Gelir Modeli Stratejisi',
    badge: '4 Başlık',
    accentColor: XP_COLORS[2],
    children: (
      <div className="space-y-5">
        <SubSection
          tarih="12 Nisan"
          baslik="Mobil Odaklı Reklam Alanları"
          items={[
            "Kullanıcıların %90'ının mobil üzerinden erişeceği öngörüldü.",
            'Ana sayfada akan ve sabit banner reklam alanları olacak.',
            'Reklam alanları hem ana sayfada hem de farklı bölümlerde yer alacak.',
            'Reklamların kullanıcı deneyimini bozmadan yönetilmesi gerekiyor.',
          ]}
        />
        <SubSection          tarih="12 Nisan"          baslik="Ücretlendirme Modeli"
          items={[
            'Reklam gösterim sürelerine göre ücretlendirme yapılacak.',
            'Mekanlar kendi bütçelerine göre reklam paketi seçebilecek.',
            'Mekanlar reklamlarda sabit süre gösterim hakkı alacak, ekstra süreler için ek ücret ödeyecek.',
            'Akan ve sabit bannerlar üst üste gelerek farklı reklam alanları sunacak.',
            'Reklamlar başlangıçta sınırlı tutulup platform büyüdükçe artırılacak.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Premium ve Verifiye Hesaplar"
          items={[
            'En başta ~30 premium mekan seçilip liste başı gösterilecek.',
            'Reklam alanlarının yeri ve sıralaması kullanıcı tercihlerine ve mekan bütçelerine göre dinamik değişebilecek.',
            'Reklam alanlarının filtreleme dışında ayrı bir mini tool olarak sunulması kullanımı kolaylaştıracak.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Gelir Modeli Ayrımı"
          items={[
            'Mekanlardan reklam ve görünürlük bazlı gelir beklenecek.',
            'Bireysel kullanıcıların gelir modeli riskleri tartışıldı.',
            'Bireysel kullanıcılar platform için önemli ancak mekanlar öncelikli.',
          ]}
        />
      </div>
    ),
  },
  {
    id: 'kullanici-guvenlik',
    title: 'Kullanıcı ve Güvenlik Politikaları',
    badge: '4 Başlık',
    accentColor: XP_COLORS[3],
    children: (
      <div className="space-y-5">
        <SubSection
          tarih="12 Nisan"
          baslik="Login Zorunluluğu"
          items={[
            'Rezervasyon yapabilmek için kullanıcıların mutlaka login olması zorunlu olacak.',
            'Login işlemi telefon veya e-posta ile şifresiz doğrulama kodu gönderilerek yapılacak.',
            'Anonim rezervasyonların sistem yükü ve güvenlik zaafları önleniyor.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Yasal Bağlayıcı Form Bilgileri"
          items={[
            "Kullanıcının yanlış bilgi vermesi veya sahte kimlik kullanması yasal yaptırım doğuracak.",
            'Formdaki kurallar ve taahhütler kayıt altına alınacak.',
            'Gerektiğinde hukuki süreç başlatılabilecek.',
            'Bu yapı hem kullanıcıyı hem de işletmeyi koruyacak.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Gizlilik ve Kullanıcı Tercihleri"
          items={[
            'Kullanıcı mail almak istemezse mekan bunu yönetebilecek.',
            'Telefonla önceden arama veya onay alma gibi yöntemler işletmeye bırakıldı.',
            'Bu esneklik ileri aşamalarda kullanıcı deneyimini iyileştirecek.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Çoklu Rezervasyon Engelleme"
          items={[
            'Aynı zamanda birden fazla etkinliğe katılım sınırı ve ekstra doğrulama mekanizmaları planlanıyor.',
            'Mekanların inisiyatifine bağlı olarak ek prosedürler istenebilecek.',
            'Yapay zeka destekli sahte video gibi dolandırıcılık önleyici teknolojiler sonraki aşamalara bırakıldı.',
          ]}
        />
      </div>
    ),
  },
  {
    id: 'mvp-strateji',
    title: 'Ürün Geliştirme ve MVP Stratejisi',
    badge: '4 Başlık',
    accentColor: XP_COLORS[0],
    children: (
      <div className="space-y-5">
        <SubSection
          tarih="12 Nisan"
          baslik="MVP Önceliği"
          items={[
            'Fazla özellik eklenmeden ürünün hızlı çıkması ve gerçek kullanıcı geri dönüşlerinin alınması amaçlanıyor.',
            'Geliştirme sürecinde fikirlerin uzaması gecikmelere neden olacak.',
            'İş bölümü ve görev önceliklendirmesi için planlama yapılıyor.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="İş Listesi ve Aşamalandırma"
          items={[
            'Fonksiyonlar ve müşteri ihtiyaçlarına göre yapılacak iş listesi oluşturulup MVP aşamalarına göre önceliklendirilecek.',
            'İşler backend, frontend, pazarlama ve kullanıcı profilleri bazında ayrılacak.',
            '1. aşamada çıkacak özellikler netleşecek, sonraki aşamalar için yol haritası çizilecek.',
            'Bu metodoloji kaynakların verimli kullanılmasını sağlayacak.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Frontend ve Backend API Yapısı"
          items={[
            'API yapısı basit tutulacak; temel login ve rezervasyon işlemleri ilk hedef.',
            "Öncelikli olarak login, mekan listeleme ve rezervasyon oluşturma endpoint'leri gerekli.",
            "Backend'in hazır olduğu, frontend entegrasyonunun hızla başlayabileceği belirtildi.",
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Lansman Sonrası"
          items={[
            'MVP sonrası esneklik ve yeni ihtiyaçların ortaya çıkacağı öngörülüyor.',
            'İkinci ve üçüncü aşamalarda gelişmiş güvenlik, canlı doğrulama ve UX iyileştirmeleri yapılacak.',
            'Bu yaklaşım sistem stabilitesini koruyarak büyüme sağlayacak.',
          ]}
        />
      </div>
    ),
  },
  {
    id: 'ekip-koordinasyon',
    title: 'Ekip Koordinasyonu ve İş Yükü Yönetimi',
    badge: '4 Başlık',
    accentColor: XP_COLORS[1],
    children: (
      <div className="space-y-5">
        <SubSection
          tarih="12 Nisan"
          baslik="Baran'ın Öncelikleri"
          items={[
            'Kısa sürede dokümantasyon tamamlanıp ekip ile paylaşılacak.',
            'Sağlık durumu nedeniyle tempo ayarlanarak çalışma sürdürülüyor.',
            'Veritabanı dokümantasyonu ve temel iş mantığının kontrolü öncelikli.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Şahin'in Dokümantasyon İsteği"
          items={[
            'Dokümantasyon XML formatında ve akış diyagramlarıyla desteklenmeli.',
            'Tüm ekip üyeleri tabloların işlevlerini ve kullanımını daha iyi anlayacak.',
            'Frontend ve pazarlama ekipleri için ayrı dokümanlar hazırlanacak.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Umut'un İş Listesi"
          items={[
            'İşler MVP 1, 2 ve 3 aşamalarına göre sınıflandırılacak.',
            'Gereksiz işlerde zaman kaybı önlenecek ve odaklanma artacak.',
            'Süreçlerin daha disiplinli ilerlemesi gerekiyor.',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Ekip İşbirliği"
          items={[
            'Ekip üyeleri birbirlerinin farklı iş yüklerini anlayarak destek sağlıyor.',
            'Şahin, başka projelerle de ilgilenirken bu projeye destek verecek.',
            'Ekip içinde işbirliği ve esneklik ön planda tutuluyor.',
          ]}
        />
      </div>
    ),
  },
  {
    id: 'action-items',
    title: 'Action Items',
    badge: '3 Kişi',
    accentColor: '#F5A500',
    children: (
      <div className="space-y-6">
        <SubSection
          tarih="12 Nisan"
          baslik="Baran Kaplan"
          items={[
            'Veri tabanının mevcut durumunu kontrol et ve veritabanı dokümantasyonunu oluştur (ER diyagramları, tablolar, ilişkiler)',
            "Backend ile entegre şekilde temel rezervasyon sistemi API'lerini hazırla; login, mekan listeleme, rezervasyon oluşturma gibi endpoint'leri geliştir",
            'Veri tabanı export\'larını SQL ve XML formatında al ve ilgili gruplara gönder',
            'Öncelikli olarak MVP geliştirme hedefiyle sistemin temel işleyişini tamamla ve frontend entegrasyonuna destek ol',
            'Reklam ve banner gösterimleriyle ilgili temel yapı ve taslak planı oluştur',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Şahincan ÖZBAKIR"
          items={[
            'Veri tabanı export alma ve analiz için Baran ile koordinasyon sağla; XML export ve dokümantasyon hazırlanmasında öncelik ver',
            'MVP için gerekli minimum işlevlerin belirlenmesinde Baran ile iş birliği yaparak öncelikleri netleştir',
            'Yasal onay mekanizması ve çeşitli senaryolar için taslak kontrol ve onboarding süreçlerine destek ver',
            'Pazar stratejisine uygun reklam ve VIP mekan önceliklendirme önerilerini geliştir ve sun',
            'Dokümantasyon ve geliştirme süreçlerinin düzenli ilerlemesi için grup koordinasyonu sağla',
          ]}
        />
        <SubSection
          tarih="12 Nisan"
          baslik="Umut Barış Terzioğlu"
          items={[
            'Pazarlama stratejisi çerçevesinde reklam alanlarının yerleşimi ve ücretlendirme modelleri üzerine görüş bildir ve önerilerde bulun',
            'Dokümantasyon sürecinin teknik tarafına katkı sağlayacak şekilde analizleri yap ve gerekli listelemeleri çıkar',
            'MVP ve sonrasının ihtiyaçlarını göz önünde bulundurarak iş ve pazarlama planlaması yap',
          ]}
        />
      </div>
    ),
  },
]

// ─── Bileşen ─────────────────────────────────────────────────────────────────

export default function ToplantiNotlariManager() {
  return (
    <section className="space-y-6" aria-labelledby="toplanti-notlari-heading">
      {/* Başlık */}
      <div className="space-y-2">
        <h2
          id="toplanti-notlari-heading"
          className="text-xl font-semibold text-ink-primary"
        >
          Toplantı Notları
        </h2>
        <p className="max-w-3xl text-sm text-ink-muted">
          12 Nisan 2026 — Rezervasyon sistemi, veritabanı tasarımı, reklam modeli ve MVP stratejisi üzerine yapılan toplantının özeti.
        </p>
      </div>

      {/* Sayfa Açıklaması */}
      <AccordionCard
        defaultOpenId="sayfa-aciklama"
        items={[
          {
            id: 'sayfa-aciklama',
            title: 'Sayfa Açıklaması',
            accentColor: '#1A6DC2',
            children: (
              <div className="space-y-3 text-sm text-ink-muted">
                <p>
                  Bu sayfa toplantı notlarının yapılandırılmış özetini içerir. Her ana başlık, toplantıda ele alınan bir konuyu temsil eder.
                </p>
                <p>
                  Her maddenin başındaki tarih etiketi, o kararın hangi toplantıda alındığını gösterir. Yeni toplantılar eklendiğinde mevcut başlıklara yeni tarihli maddeler eklenir — böylece hangi kararın ne zaman alındığı zaman içinde görünür hale gelir.
                </p>
              </div>
            ),
          },
        ]}
      />

      {/* Özet maddeleri */}
      <div className="rounded-lg border border-canvas-border bg-canvas-surface p-4">
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] opacity-50"
          style={{ color: '#F5A500' }}
        >
          Toplantı Özeti
        </p>
        <ul className="space-y-3">
          {OZET_MADDELER.map((madde, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: XP_COLORS[i % XP_COLORS.length] }}
              />
              <span className="text-sm text-ink-muted">
                <span className="font-semibold text-ink-primary">{madde.baslik}: </span>
                {madde.aciklama}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Accordion */}
      <AccordionCard items={ACCORDION_ITEMS} defaultOpenId="rezervasyon-event" />
    </section>
  )
}
