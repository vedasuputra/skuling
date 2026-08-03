// The prerequisite of section N is always section N-1 (or the "#0" overview
// for N=1) — independent of which page the learner is currently browsing
// from or how far they've otherwise progressed.
function getPrerequisiteLabel(targetIndex) {
    if (targetIndex <= 1) return "#0: Ringkasan Tiap Materi";
    const prereq = MATERI_SECTIONS[targetIndex - 2];
    return `#${prereq.number}: ${prereq.title}`;
}

const MATERI_SECTIONS = [
    {
        number: 1,
        title: "Bukan Sekedar Baca Biasa",
        intro: "TKA Bahasa Indonesia menuntut kamu jadi analis aktif, bukan pembaca pasif kayak nonton film. Bedanya:",
        bullets: [
            { label: "Pembaca pasif", desc: "Menikmati cerita, ikut alur, cuma nangkep \"apa isi teks\"" },
            { label: "Analis aktif (sutradara)", desc: "Membedah kenapa penulis milih kata/struktur tertentu, gimana antarparagraf saling terhubung, dan seberapa kuat buktinya" },
        ],
        closing: "Teks TKA sengaja dibuat lebih kompleks (kalimat panjang/inversi, kosakata teknis, wacana padat) buat ngelatih kemampuan analisis kritis: skill yang kepake juga buat baca jurnal kuliah atau nyaring berita hoaks.",
    },
    {
        number: 2,
        title: "Dua Jenis Teks",
        intro: "TKA hadirkan dua jenis teks yang cara bacanya beda:",
        bullets: [
            { label: "Teks Informasi (artikel/berita)", desc: "Bahasa lugas & denotatif, isinya fakta/data/prosedur, tujuannya nambah wawasan → butuh mode Detektif: cari ide pokok, data, sebab-akibat" },
            { label: "Teks Fiksi (cerpen/puisi)", desc: "Bahasa konotatif & penuh majas, isinya cerita/karakter/konflik, tujuannya tersirat → butuh mode Empati: tangkap emosi, karakter, pesan tersembunyi" },
        ],
        closing: "Kunci utamanya adalah mengenali jenis teks lebih dulu, lalu \"ganti kacamata\" baca yang sesuai. Jangan pakai cara baca yang sama buat kedua jenis teks.",
    },
    {
        number: 3,
        title: "Tiga Kompetensi Utama",
        intro: "3 level kompetensi utama buat membedah teks di TKA:",
        bullets: [
            { label: "Pemahaman Tekstual", desc: "Cari info yang tersurat (jelas tertulis), tinggal ditemukan, nggak perlu ditafsirkan" },
            { label: "Pemahaman Inferensial", desc: "Simpulkan info yang tersirat (nggak tertulis langsung), lewat menghubungkan petunjuk; ide pokok, hubungan sebab-akibat, prediksi" },
            { label: "Evaluasi & Apresiasi", desc: "Menilai & menanggapi teks secara kritis; apakah argumennya logis, akurat, relevan, dan gimana pendapat/perasaanmu terhadapnya" },
        ],
        closing: "Urutannya bertingkat, dari sekadar menemukan (tersurat) → menyimpulkan (tersirat) → menilai (kritis/evaluatif). Ketiganya wajib dikuasai karena soal TKA bisa menguji salah satu atau kombinasi dari ketiganya.",
    },
    {
        number: 4,
        title: "Matriks Asesmen",
        intro: "Matriks Asesmen adalah blueprint resmi pembuat soal TKA yang memecah 3 kompetensi utama jadi subkompetensi spesifik:",
        bullets: [
            { label: "Pemahaman Tekstual", desc: "Identifikasi kata serapan, latar/karakter dari kosakata, susun kerangka teks" },
            { label: "Pemahaman Inferensial", desc: "Simpulkan ide pokok/konflik/nilai, jelaskan hubungan antarkalimat/paragraf, prediksi kelanjutan cerita" },
            { label: "Evaluasi & Apresiasi", desc: "Nilai relevansi, keakuratan, ketepatan bahasa, ketepatan penggambaran karakter/latar, emosional" },
        ],
        closing: "Nggak perlu hafal semua subkompetensi. Cukup baca soal dulu, tangkap kata kunci-nya (misal \"menyimpulkan\", \"makna kata\", \"menilai\"), lalu itu langsung nunjukkin kompetensi mana yang harus dipakai buat jawab soal.",
    },
];

// Full per-section lesson content, from the "Materi, Section N" Figma frames
// (distinct from the short MATERI_SECTIONS summaries used on the overview page).
//
// Each block/tip has a `lines` array mixing two line kinds, matching the bold
// lead-in + regular description pattern used throughout the Figma text:
//   { type: "p", text }                  -> plain paragraph
//   { type: "bullet", label?, text }     -> bullet list item, label bolded if present
// Consecutive "bullet" lines are grouped into one <ul> at render time.
const MATERI_LESSONS = [
    {
        number: 1,
        headline: "Jadi Sutradara, Bukan Cuma Penonton: Mindset Baru Taklukkan Soal TKA!",
        intro: [
            "Menurut riset, lebih dari 90% data yang ada di dunia saat ini diciptakan hanya dalam dua tahun terakhir! Coba bayangin, setiap hari kamu \"dihujani\" informasi dari TikTok, berita online, utas di X (Twitter), sampai chat grup keluarga. Banjir informasi ini nyata.",
            "Nah, pemerintah dan para pembuat soal TKA sadar betul soal ini. Mereka tahu, di masa depan, orang yang paling sukses bukanlah yang paling banyak hafal, tapi yang paling jago menyaring, memahami, dan menganalisis informasi dengan cepat dan tepat.",
            "Makanya, TKA Bahasa Indonesia sekarang didesain bukan lagi sekadar tes \"membaca\". Ini adalah simulasi pertarungan di tengah badai informasi. Inilah kenapa kamu mungkin merasa jago baca novel ratusan halaman, tapi pas ketemu soal TKA rasanya... kok beda, ya?",
            "Jadi, apa sih yang bikin beda?",
            "Anggap aja begini: membaca novel atau komik kesukaanmu itu seperti nonton film di bioskop. Kamu duduk manis, nikmatin ceritanya, ikut terhanyut sama emosi tokohnya. Kamu adalah penonton pasif. Asyik, kan? Tentu saja!",
        ],
        blocks: [
            {
                type: "quote",
                lines: [
                    { type: "p", text: "Tapi, mengerjakan soal TKA Bahasa Indonesia itu seperti kamu jadi sutradaranya. Sebagai sutradara, kamu nggak cuma nonton. Kamu harus mikirin:" },
                    { type: "bullet", text: "\"Kenapa penulis memilih kata 'boyongan' bukan 'pindah rumah'? Apa efeknya?\"" },
                    { type: "bullet", text: "\"Gimana cara paragraf 1 dan 2 ini saling nyambung?\"" },
                    { type: "bullet", text: "\"Pesan apa yang sebenarnya mau disampaikan di balik dialog tokoh ini?\"" },
                    { type: "bullet", text: "\"Apakah bukti yang disajikan di teks ini cukup kuat dan bisa dipercaya?\"" },
                ],
            },
            {
                type: "p",
                text: "Lihat bedanya? TKA melatih kamu untuk membongkar sebuah teks, bukan cuma menikmatinya. Kamu didorong untuk berpikir kritis, menganalisis struktur, dan menilai kualitas sebuah tulisan. Ini adalah skill yang bakal kepakai banget, baik saat kamu harus membedah jurnal kuliah yang rumit maupun saat harus menilai apakah sebuah berita itu fakta atau hoaks.",
            },
            {
                type: "quote",
                lines: [
                    { type: "p", text: "Teks yang disajikan pun sengaja dibuat lebih \"berdaging\". Kamu akan ketemu:" },
                    { type: "bullet", label: "Kalimat kompleks<br>", text: "Panjang, bercabang, kadang polanya dibolak-balik (inversi)." },
                    { type: "bullet", label: "Kosakata level lanjut<br>", text: "Istilah teknis dari berbagai bidang (ekonomi, sains, sosial) atau kata-kata sastra yang punya makna mendalam." },
                    { type: "bullet", label: "Wacana padat<br>", text: "Hubungan antarparagrafnya perlu dianalisis, nggak cuma dibaca lurus." },
                    { type: "p", text: "Tujuannya bukan buat bikin kamu pusing, tapi untuk melatih \"otot\" analisis kamu supaya siap menghadapi teks-teks level perguruan tinggi dan dunia kerja." },
                ],
            },
        ],
        tip: {
            title: "Mindset Shift: Dari Pembaca Pasif ke Analis Aktif!",
            lines: [
                { type: "p", text: "Untuk menaklukkan TKA Bahasa Indonesia, ubah cara pandangmu saat membaca soal:" },
                { type: "bullet", label: "JANGAN", text: "hanya bertanya: \"Apa isi teks ini?\"" },
                { type: "bullet", label: "TAPI", text: "tanyakan juga: \"Bagaimana cara penulis membangun argumennya?\" dan \"Kenapa penulis memilih cara ini?\"" },
            ],
        },
    },
    {
        number: 2,
        headline: "Kenali Lawanmu: Bedah Tuntas Teks Informasi dan Teks Fiksi di TKA",
        intro: [
            "Coba bayangkan kamu lagi scrolling HP. Satu menit kamu baca berita soal tren fashion terbaru, lengkap dengan data penjualan dan analisis pakar. Lima menit kemudian, kamu sudah tenggelam dalam sebuah cerita fiksi, ikut ngerasain galaunya si tokoh utama yang lagi patah hati.",
            "Cara otakmu memproses dua jenis bacaan itu—artikel berita dan cerita fiksi—ternyata beda banget. Satunya menuntut logika dan pencarian fakta, satunya lagi mengundang imajinasi dan perasaan. Nah, TKA Bahasa Indonesia sengaja dirancang untuk menguji kemampuanmu menaklukkan kedua dunia ini. Jadi, ayo kita kenali dua \"arena\" utama tempat kamu akan bertarung!",
            "Di dalam TKA, semua teks yang akan kamu hadapi bisa kita kelompokkan jadi dua tim besar: Tim Informasi dan Tim Fiksi. Memahami karakteristik masing-masing tim adalah langkah pertama buat menyusun strategi jitu.",
        ],
        blocks: [
            {
                type: "card",
                title: "Teks Informasi",
                lines: [
                    { type: "p", text: "Bayangkan teks ini sebagai seorang reporter berita atau penulis artikel di ensiklopedia. Misinya cuma satu: menyampaikan informasi sejelas dan seakurat mungkin. Dia nggak peduli kamu baper atau nggak, yang penting kamu jadi tahu." },
                    { type: "bullet", label: "Isinya Daging Semua<br>", text: "Teks ini berisi fakta, data, konsep, prosedur (langkah-langkah), atau penjelasan tentang suatu topik. Contohnya seperti teks tentang dampak ekonomi digital atau cara kerja fotosintesis." },
                    { type: "bullet", label: "Bahasa Lugas & To The Point<br>", text: "Kata-katanya cenderung denotatif, artinya maknanya ya cuma itu, nggak ada makna tersembunyi. Kalau tertulis \"inflasi naik 5%\", ya artinya memang begitu." },
                    { type: "bullet", label: "Tujuan Jelas<br>", text: "Ingin menambah wawasanmu. Setelah baca, kamu diharapkan jadi lebih paham tentang sesuatu." },
                    { type: "p", text: "Saat berhadapan dengan teks ini, otakmu harus masuk ke mode \"detektif\": fokus mencari gagasan utama, data pendukung, dan hubungan sebab-akibat." },
                ],
            },
            {
                type: "card",
                title: "Teks Fiksi",
                lines: [
                    { type: "p", text: "Nah, kalau yang ini beda lagi. Bayangkan teks ini sebagai seorang sutradara film atau novelis. Misinya bukan cuma bikin kamu tahu, tapi bikin kamu merasakan. Dia ingin menarikmu masuk ke dalam dunianya." },
                    { type: "bullet", label: "Isinya Dunia Imajinasi<br>", text: "Teks ini menyajikan cerita, lengkap dengan tokoh yang punya karakter, konflik yang bikin penasaran, dan latar (tempat/waktu) yang membangun suasana. Contohnya seperti cerpen atau puisi." },
                    { type: "bullet", label: "Bahasa Penuh Rasa<br>", text: "Sering menggunakan kata-kata konotatif (punya makna kiasan), majas, dan deskripsi yang hidup untuk bangkitkan emosi dan imajinasi pembaca." },
                    { type: "bullet", label: "Tujuan Tersirat<br>", text: "Mengajakmu untuk menafsirkan, berempati dengan tokoh, dan menangkap pesan atau nilai-nilai yang tersembunyi di balik cerita." },
                    { type: "p", text: "Saat ketemu teks fiksi, otakmu harus ganti ke mode \"psikolog\": fokus memahami karakter, merasakan suasana, dan menangkap makna di balik kata indah." },
                ],
            },
        ],
        tip: {
            title: "Tips Jitu Skuling: Ganti Mode Otakmu!",
            lines: [
                { type: "p", text: "Kunci menaklukkan TKA adalah tahu kapan harus ganti \"kacamata\" yang kamu pakai untuk membaca." },
                { type: "bullet", label: "Ketemu Teks INFORMASI (artikel, berita, editorial)?<br>", text: "Fokus cari FAKTA, DATA, & IDE POKOK." },
                { type: "bullet", label: "Ketemu Teks FIKSI (cerpen, puisi, drama)?<br>", text: "Fokus cari EMOSI, KARAKTER, & PESAN TERSIRAT." },
            ],
        },
    },
    {
        number: 3,
        headline: "Tersurat, Tersirat, Tervalidasi: Tiga Jurus Sakti Membedah Teks Apapun",
        intro: [
            "Bayangin kamu lagi baca chat dari gebetan. Dia cuma bales \"K.\" setelah kamu ngetik panjang lebar. Apa yang kamu lakukan? Kamu nggak cuma baca satu huruf itu, kan? Kamu langsung jadi analis dadakan. \"Ini dia marah, apa lagi sibuk? Atau emang orangnya singkat banget?\" Nah, proses menganalisis chat \"K.\" itu sebenarnya adalah versi mini dari apa yang diuji di TKA Bahasa Indonesia!",
            "Membaca teks di ujian itu bukan sekadar menyerap kata per kata. Ada level-level pemahaman yang perlu kamu kuasai, sama seperti kamu mencoba memahami makna di balik chat singkat tadi. Di TKA, ada tiga skill utama yang jadi kunci buat menaklukkan semua jenis teks. Yuk, kita bedah satu per satu!",
            "Kita bisa bayangin tiga skill ini kayak level-level saat nonton film. Ada yang cuma nonton buat tahu ceritanya, ada yang sampai merhatiin petunjuk-petunjuk tersembunyi, dan ada yang sampai bisa kasih review kayak kritikus film profesional.",
        ],
        blocks: [
            {
                type: "card",
                title: "Skill Level 1: Pemahaman Tekstual",
                lines: [
                    { type: "p", text: "Ini adalah level paling dasar tapi paling fundamental. Ibarat nonton film, skill ini adalah kemampuanmu untuk menceritakan ulang apa yang terjadi di layar. Siapa nama tokohnya? Mereka pergi ke mana? Apa yang mereka katakan? Jelas, terlihat, dan terdengar." },
                    { type: "p", text: "Dalam konteks TKA, Pemahaman Tekstual adalah kemampuanmu untuk menemukan informasi yang tertulis secara eksplisit (tersurat) di dalam teks. Kamu nggak perlu nebak-nebak. Jawabannya ada di sana, tinggal kamu cari dengan teliti." },
                    { type: "p", text: "Jadi, kalau ada soal yang bertanya \"Berdasarkan paragraf kedua, apa penyebab utama masalah X?\", kamu sedang menggunakan skill ini. Tugasmu adalah menjadi pencari fakta yang andal." },
                ],
            },
            {
                type: "card",
                title: "Skill Level 2: Pemahaman Inferensial",
                lines: [
                    { type: "p", text: "Nah, kita naik level. Kalau tadi cuma nonton sinopsis, sekarang kamu mulai mencoba membaca pikiran sutradara (atau penulis). Kamu mulai menghubungkan titik-titik. Kenapa sutradara memilih musik yang sedih di adegan itu? Kenapa tokoh utama tiba-tiba diam saat ditanya soal masa lalunya? Jawabannya nggak diucapkan langsung, tapi kamu bisa menyimpulkannya dari berbagai petunjuk." },
                    { type: "p", text: "Inilah Pemahaman Inferensial: kemampuan untuk memahami informasi yang tidak tertulis secara langsung (tersirat). Kamu harus bisa:" },
                    { type: "bullet", text: "Menyimpulkan ide pokok atau pesan tersembunyi." },
                    { type: "bullet", text: "Memprediksi apa yang akan terjadi selanjutnya." },
                    { type: "bullet", text: "Memahami hubungan sebab-akibat antar paragraf, meskipun tidak ada kata \"karena\" atau \"sehingga\"." },
                    { type: "p", text: "Skill ini butuh kejelian lebih. Kamu harus bisa melihat apa yang tidak dikatakan penulis, sama pentingnya dengan apa yang ia katakan." },
                ],
            },
            {
                type: "card",
                title: "Skill Level 3: Evaluasi & Apresiasi",
                lines: [
                    { type: "p", text: "Ini level tertinggi. Kamu nggak cuma nonton dan menganalisis, tapi kamu juga memberi penilaian. Kamu keluar dari bioskop dan temanmu bertanya, \"Gimana filmnya, bagus nggak?\". Kamu pun menjawab, \"Bagus, sih. Argumen ceritanya kuat, tapi akting tokoh antagonisnya kurang meyakinkan. Tapi aku suka banget cara mereka pakai sinematografinya buat gambarin perasaan si tokoh.\"" },
                    { type: "p", text: "Itulah Evaluasi dan Apresiasi. Kamu diminta untuk:" },
                    { type: "bullet", label: "Menilai isi teks<br>", text: "Apakah informasinya akurat? Apakah argumennya logis dan relevan dengan kehidupan nyata?" },
                    { type: "bullet", label: "Menanggapi teks<br>", text: "Apakah kamu setuju dengan pandangan penulis? Bagaimana perasaanmu setelah membaca puisi itu? Apakah cara penulis menggambarkan tokohnya sudah efektif?" },
                    { type: "p", text: "Di sini, kamu menggunakan nalar dan perasaanmu untuk berinteraksi dengan teks secara kritis. Kamu tidak lagi menjadi penonton pasif, tapi seorang pembaca aktif yang punya opini." },
                ],
            },
        ],
        tip: {
            title: "Tiga Skill Wajib Pembaca Pro:",
            lines: [
                { type: "p", text: "Gunakan kemampuan ini untuk bantu kamu di TKA!" },
                { type: "bullet", label: "Pemahaman Tekstual (Skill Nonton Sinopsis)<br>", text: "Fokus menemukan informasi yang tertulis jelas di dalam teks. Apa adanya, tanpa ditafsirkan." },
                { type: "bullet", label: "Pemahaman Inferensial (Skill Baca Pikiran)<br>", text: "Fokus menyimpulkan makna yang tersirat. Menghubungkan petunjuk untuk menemukan pesan tersembunyi." },
                { type: "bullet", label: "Evaluasi & Apresiasi (Skill Jadi Kritikus Film)<br>", text: "Fokus menilai dan menanggapi isi teks. Menentukan kualitas, relevansi, dan memberikan pendapatmu berdasarkan bukti dari teks." },
            ],
        },
    },
    {
        number: 4,
        headline: "Matriks Asesmen: 'Bocoran' Resmi untuk Membaca Pikiran Pembuat Soal",
        intro: [
            "Bayangin kamu lagi main game RPG yang super sulit. Kamu sampai di depan pintu bos terakhir, tapi nggak tahu sama sekali apa kelemahannya. Kamu coba serang pakai semua jurus, tapi nggak ada yang mempan. Frustrasi, kan? Nah, tiba-tiba temanmu datang bawa strategy guide yang isinya bocoran lengkap: \"Bos ini lemah terhadap elemen api, serang bagian kepalanya, dan hindari serangan cakarnya!\" Tiba-tiba, pertarungan mustahil jadi terasa lebih mudah.",
            "Di dunia TKA Bahasa Indonesia, \"bos\"-nya adalah soal-soal yang membingungkan itu. Dan strategy guide-nya? Namanya adalah Matriks Asesmen. Ini adalah dokumen rahasia yang sebenarnya nggak rahasia-rahasia amat, yang bisa bantu kita \"membaca pikiran\" pembuat soal.",
            "Oke, jadi apa sih Matriks Asesmen ini?",
            "Singkatnya, Matriks Asesmen adalah cetak biru (blueprint) resmi yang digunakan pemerintah untuk membuat setiap soal TKA Bahasa Indonesia. Betul, kamu nggak salah baca. Setiap soal yang kamu kerjakan itu nggak dibuat secara asal-asalan, tapi dirancang berdasarkan sebuah tabel berisi daftar kemampuan spesifik yang mau diuji.",
            "Ini bukan materi hafalan, tapi sebuah PETA. Peta yang menunjukkan \"harta karun\" apa yang harus kamu cari di dalam teks untuk menjawab soal dengan tepat.",
            "Matriks ini menghubungkan Tiga Jurus Sakti yang sudah kita bahas sebelumnya (Pemahaman Tekstual, Inferensial, Evaluasi & Apresiasi) dengan misi-misi yang lebih kecil dan spesifik, yang disebut subkompetensi.",
            "Nah, ini dia isi lengkap dari strategy guide kita. Mari kita bedah satu per satu!",
        ],
        blocks: [
            {
                type: "card",
                title: "Pemahaman Tekstual",
                lines: [
                    { type: "p", text: "Misi utama: Menemukan informasi yang tertulis jelas di dalam teks." },
                    { type: "bullet", text: "Mengidentifikasi penggunaan kata serapan dari bahasa daerah/asing dalam berbagai bidang." },
                    { type: "bullet", text: "Mengidentifikasi latar, karakter, dan/atau fenomena berdasarkan kosakata yang digunakan dalam teks fiksi atau nonfiksi." },
                    { type: "bullet", text: "Menyusun kerangka atau bagan berdasarkan bagian-bagian penting dalam teks." },
                ],
            },
            {
                type: "card",
                title: "Pemahaman Inferensial",
                lines: [
                    { type: "p", text: "Misi utama: Menyimpulkan informasi yang tidak tertulis secara langsung (tersirat)." },
                    { type: "bullet", text: "Menyimpulkan ide pokok, gagasan pendukung, tokoh, peristiwa, latar, konflik, atau nilai-nilai dalam teks." },
                    { type: "bullet", text: "Menjelaskan hubungan makna antarkalimat dan/atau antarparagraf dalam teks (misal: sebab-akibat, perbandingan)." },
                    { type: "bullet", text: "Memprediksi lanjutan atau akhir uraian/cerita berdasarkan bagian tertentu dalam teks." },
                ],
            },
            {
                type: "card",
                title: "Evaluasi & Apresiasi",
                lines: [
                    { type: "p", text: "Misi utama: Memberikan penilaian dan tanggapan terhadap isi dan cara penyajian teks." },
                    { type: "bullet", text: "Menilai relevansi peristiwa dalam teks dengan kehidupan sehari-hari." },
                    { type: "bullet", text: "Menilai keakuratan, kesesuaian, kecukupan, atau ketepatan informasi dalam teks." },
                    { type: "bullet", text: "Menilai ketepatan dan kesesuaian penggunaan bahasa dalam teks." },
                    { type: "bullet", text: "Menilai ketepatan bagian teks untuk gambarkan karakter, peristiwa, atau latar dalam teks fiksi." },
                    { type: "bullet", text: "Menyimpulkan respons emosional terhadap unsur puisi, prosa, dan drama." },
                ],
            },
            {
                type: "p",
                text: "Gimana? Kelihatannya banyak dan teknis, ya? Tenang, jangan panik! Kamu tidak perlu menghafal semua ini. Anggap saja daftar di atas itu seperti menu lengkap di sebuah restoran. Kamu nggak perlu hafal semua makanan, kan? Kamu hanya perlu tahu cara bacanya saat memesan.",
            },
            {
                type: "p",
                text: "Kuncinya adalah, saat kamu berhadapan dengan soal, kamu bisa dengan cepat mengenali, \"Aha! Soal ini minta aku menilai keakuratan informasi, berarti aku harus pakai Jurus Juri! Aku harus fokus cari bukti dan data di dalam teks.\"",
            },
        ],
        tip: {
            title: "Tips Jitu: Baca Pikiran Pembuat Soal dalam 3 Detik!",
            lines: [
                { type: "p", text: "Daripada bingung, gunakan Matriks Asesmen sebagai cheat code mental saat ujian:" },
                { type: "bullet", text: "Baca Soalnya DULU, bukan teksnya." },
                { type: "bullet", label: "Identifikasi Kata Kunci dalam Pertanyaan.", text: "Apakah soalnya mengandung kata \"makna kata\", \"menyimpulkan\", \"menilai\", atau \"hubungan antarparagraf\"?" },
                { type: "bullet", label: "Langsung Tahu Misimu!", text: "Kata kunci itu akan memberitahu kamu persis apa yang harus dicari di dalam teks. \"Menyimpulkan\" = aktifkan Jurus Analis. \"Makna kata\" = aktifkan Jurus Detektif. Kamu jadi tahu harus fokus ke mana!" },
            ],
        },
    },
];
