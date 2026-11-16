export interface Project {
    id: string;
    name: string;
    logo: string;
    category: string;
    status: string;
    lifecycle: "active" | "transitioning" | "paused";
    description: string;
    details: string;
    platform: string;
    highlights: string[];
    safetyNotice?: string;
    hideUntilGala?: boolean;
    galaStartsAt?: string;
    galaId?: string;
}

export const projects: Project[] = [
    {
        id: "engerek",
        name: "Engerek",
        logo: "/assets/img/engerek.png",
        category: "Güvenlik",
        status: "Koza'ya devrediliyor",
        lifecycle: "transitioning",
        description:
            "Notlar ve hassas bilgileri şifreleyerek saklamaya yönelik güvenli kasa uygulaması.",
        details:
            "Engerek, özel notları ve benzeri hassas içerikleri şifreli biçimde saklamak için geliştirildi. Ürün artık yerini, Engerek'in özelliklerini de bünyesinde toplayan Koza'ya bırakıyor.",
        platform: "Electron masaüstü uygulaması",
        highlights: ["Şifreli not saklama", "Güvenli kasa yaklaşımı"],
    },
    {
        id: "koru",
        name: "Koru",
        logo: "/assets/img/koru.png",
        category: "Mağaza",
        status: "Geliştiriliyor",
        lifecycle: "active",
        description:
            "Antic Valley'in resmi uygulama dağıtım ve güncelleştirme platformu",
        details:
            "Antic Valley'in resmi uygulama dağıtım ve güncelleştirme platformu. Koru, Antic Valley uygulamalarını tek bir yerden yönetmeyi hedefliyor.",
        platform: "Electron masaüstü uygulaması",
        highlights: ["Resmi Mağaza", "Otomatik güncelleştirme"],
    },
    {
        id: "koza",
        name: "Koza",
        logo: "/assets/img/koza.png",
        category: "Güvenlik",
        status: "Geliştiriliyor",
        lifecycle: "active",
        description:
            "Engerek'in özelliklerini devralan; parola yönetiminin yanında hesap kurtarma bilgilerini hatırlamaya yardımcı olan güvenli kasa.",
        details:
            "Koza, Ahtapot'un parola yönetim sistemini temel alıyor. Hesaplara ait kurtarma bilgilerini hatırlamaya yardımcı oluyor ve Engerek'in güvenli kasa özelliklerini de bir araya getiriyor.",
        platform: "Electron masaüstü uygulaması",
        highlights: [
            "Parola yönetimi",
            "Hesap kurtarma bilgileri için hatırlatıcı",
            "Engerek'in güvenli kasa özellikleri",
        ],
    },
    {
        id: "ahtapot",
        name: "Ahtapot",
        logo: "/assets/img/ahtapot.png",
        category: "Güvenlik",
        status: "Koza'ya devrediliyor",
        lifecycle: "transitioning",
        description:
            "Hesap parolalarını düzenli biçimde yönetmeye yönelik parola yöneticisi. Parola yönetimi Koza'ya aktarılıyor.",
        details:
            "Ahtapot, hesap parolalarını yönetmek için geliştirildi. Parola yönetim sistemi Koza'ya aktarılıyor; Koza bu özellikleri Engerek'in güvenli kasa altyapısı ve hesap kurtarma bilgileriyle birleştiriyor.",
        platform: "Electron masaüstü uygulaması",
        highlights: ["Parola yönetimi", "Parola yönetimi Koza'ya devrediliyor"],
    },
    {
        id: "nexaverse",
        name: "NexaVerse",
        logo: "/assets/img/nexaverse.png",
        category: "Topluluk",
        status: "Süresiz askıda",
        lifecycle: "paused",
        description:
            "Forum fikrinin ötesine geçen, siber şehir konseptli dijital topluluk projesi.",
        details:
            "NexaVerse; klasik bir forumdan daha geniş bir deneyim sunmayı hedefleyen siber şehir projesi. Geliştirme çalışmaları şu an için süresiz olarak askıya alınmış durumda.",
        platform: "Electron masaüstü uygulaması",
        highlights: [
            "Siber şehir konsepti",
            "Geliştirme süreci süresiz askıda",
        ],
    },
    {
        id: "kirpi",
        name: "Kirpi",
        logo: "/assets/img/kirpi.png",
        category: "İş Yönetimi",
        status: "Geliştiriliyor",
        lifecycle: "active",
        description:
            "İşletmelerin süreçlerini ve operasyonlarını yönetmek için geliştirilen kapsamlı ERP sistemi.",
        details:
            "Kirpi, işletme süreçlerini tek bir sistemde bir araya getirmeyi hedefleyen gelişmiş bir ERP yazılımı.",
        platform: "Electron masaüstü uygulaması",
        highlights: ["Kurumsal kaynak planlama", "İş süreçleri yönetimi"],
    },
    {
        id: "kirpi-fabrika",
        name: "Kirpi Fabrika",
        logo: "/assets/img/kirpifab.png",
        category: "Üretim & Stok",
        status: "Geliştiriliyor",
        lifecycle: "active",
        description:
            "Kirpi'nin, SG Bıçak Sepeti fabrikasının ihtiyaçlarına göre özelleştirilmiş saha içi ve saha dışı takip sürümü.",
        details:
            "Kirpi Fabrika; fabrika operasyonlarına uyarlanmış stok ve üretim takip yazılımı. Saha içindeki ve dışındaki stok hareketlerini, üretim takibiyle birlikte yönetmeye odaklanıyor.",
        platform: "Electron masaüstü uygulaması",
        highlights: [
            "Saha içi ve saha dışı stok takibi",
            "Üretim takibi",
            "SG Bıçak Sepeti için özelleştirilmiş",
        ],
    },
    {
        id: "lir",
        name: "Lir",
        logo: "/assets/img/lir.png",
        category: "Ses & Üretkenlik",
        status: "Geliştiriliyor",
        lifecycle: "active",
        description:
            "Soundpad benzeri ses uygulaması; oyun altyazılarını OCR ile anlık çevirebilir, Spotify müziğini entegre edebilir ve arayüzünü özelleştirebilirsin.",
        details:
            "Lir, sesleri hızlıca kullanmanın ötesinde oyun içi altyazılara OCR ile anlık çeviri, özelleştirilebilir arayüz ve Spotify bağlantısını tek masaüstü uygulamasında bir araya getiriyor.",
        platform: "Electron masaüstü uygulaması",
        highlights: [
            "Oyun altyazılarını OCR ile anlık çeviri",
            "Özelleştirilebilir arayüz",
            "Spotify ile müzik entegrasyonu",
        ],
    },
    {
        id: "delta-ecosystem",
        name: "Delta Ecosystem",
        logo: "/assets/img/delta.png",
        category: "Hesap & Senkronizasyon",
        status: "Geliştiriliyor",
        lifecycle: "active",
        description:
            "Delta ürünleri ve hesapları arasında bilgilerin senkronize çalışmasını hedefleyen ekosistem.",
        details:
            "Delta Ecosystem, farklı hesaplar arasında senkronizasyon sağlayarak kullandığın Delta hizmetleri arasındaki deneyimi bir arada tutmayı amaçlıyor.",
        platform: "Electron masaüstü uygulaması",
        highlights: [
            "Hesaplar arası senkronizasyon",
            "Delta ürünleri arasında ortak ekosistem",
        ],
    },
    {
        id: "yonga",
        name: "Yonga",
        logo: "/assets/img/mfgi.png",
        category: "Oyun & Görüntü",
        status: "Geliştiriliyor",
        lifecycle: "active",
        description:
            "Multi Frame Generation DLL'ini oyunlara entegre etmeyi ve oyunları uygulama içinden başlatmayı amaçlayan bir yazılım.",
        details:
            "Yonga, Multi Frame Generation DLL entegrasyonunu ve oyun başlatıcısını tek bir uygulamada buluşturur. Özelliği öncelikle çevrimdışı oyunlarda denemeniz önerilir.",
        safetyNotice:
            "DLL enjeksiyonu oyun dosyalarına müdahale eder. Çevrimiçi oyunlarda oyunun kurallarına veya anti-hile sistemlerine takılabilir ve hesabınızın yasaklanmasına yol açabilir. Çevrimiçi oyunlarda kullanmayın; oyunun kullanım koşullarını önceden kontrol edin.",
        platform: "Masaüstü oyun başlatıcısı",
        highlights: [
            "Multi Frame Generation DLL entegrasyonu",
            "Oyun başlatıcısı",
            "Öncelikli kullanım: çevrimdışı oyunlar",
        ],
    },
];
