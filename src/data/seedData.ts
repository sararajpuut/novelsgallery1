import { Author, Novel, Episode, Ebook, ClassicalWork, SiteSettings } from '../types';

export const SEED_AUTHORS: Author[] = [
  {
    id: 'author-nemrah-ahmed',
    name: 'Nemrah Ahmed',
    urduName: 'نمرہ احمد',
    photoUrl: '/src/assets/images/author_nemrah_ahmed_1791359933182.jpg',
    bio: 'Nemrah Ahmed is a celebrated contemporary Pakistani novelist known for her gripping suspense, spiritual themes, intricate plots, and unforgettable characters.',
    urduBio: 'نمرہ احمد پاکستان کی ممتاز اور مقبول ترین ناول نگار ہیں، جن کے ناولز سسپنس، روحانیت اور معاشرتی اقدار کی عکاسی کے لیے جانے جاتے ہیں۔',
    novelsCount: 8,
    followersCount: 142000,
    isFeatured: true,
  },
  {
    id: 'author-umera-ahmed',
    name: 'Umera Ahmed',
    urduName: 'عمیرہ احمد',
    photoUrl: '/src/assets/images/hero_library_urdu_1791359887842.jpg',
    bio: 'Umera Ahmed is one of Urdu literature’s most prolific and renowned contemporary writers, acclaimed for masterpiece novels such as Peer-e-Kamil, Aab-e-Hayat, and Alif.',
    urduBio: 'عمیرہ احمد اردو ادب کی معروف ترین مصنفہ ہیں جن کے شاہکار ناول پیرِ کامل اور آبِ حیات کو دنیا بھر میں سراہا گیا ہے۔',
    novelsCount: 14,
    followersCount: 285000,
    isFeatured: true,
  },
  {
    id: 'author-bano-qudsia',
    name: 'Bano Qudsia',
    urduName: 'بانو قدسیہ',
    photoUrl: '/src/assets/images/hero_library_urdu_1791359887842.jpg',
    bio: 'Bano Qudsia was a legendary literary giant, dramatist, and philosopher best known for her immortal psychological and metaphysical novel Raja Gidh.',
    urduBio: 'بانو قدسیہ اردو کی لازوال افسانہ نگار، ڈراما نویس اور ناول نگار ہیں، جن کا شاہکار ناول "راجہ گدھ" ایک ادبی سنگ میل ہے۔',
    novelsCount: 12,
    followersCount: 195000,
    isFeatured: true,
  },
  {
    id: 'author-hashim-nadeem',
    name: 'Hashim Nadeem',
    urduName: 'ہاشم ندیم',
    photoUrl: '/src/assets/images/cover_peer_e_kamil_1791359911529.jpg',
    bio: 'Hashim Nadeem is a distinguished novelist, poet, and dramatist known for evocative emotional journeys including Khuda Aur Mohabbat and Parizaad.',
    urduBio: 'ہاشم ندیم مقبول ناول نگار، شاعر اور فلم ساز ہیں جنہوں نے خدا اور محبت، پری زاد اور عبداللہ جیسے تاریخی ناولز لکھے۔',
    novelsCount: 7,
    followersCount: 168000,
    isFeatured: false,
  },
  {
    id: 'author-farhat-ishtiaq',
    name: 'Farhat Ishtiaq',
    urduName: 'فرحت اشتیاق',
    photoUrl: '/src/assets/images/cover_aab_e_hayat_1791359922444.jpg',
    bio: 'Farhat Ishtiaq is a romantic fiction writer and screenwriter celebrated for Humsafar, Mata-e-Jaan Hai Tu, and Diyar-e-Dil.',
    urduBio: 'فرحت اشتیاق رومانوی ادب کی مقبول ترین مصنفہ ہیں جن کی کہانیوں کو ٹیلی ویژن کی دنیا میں بھی تاریخی پذیرائی حاصل ہوئی۔',
    novelsCount: 9,
    followersCount: 120000,
    isFeatured: false,
  }
];

export const SEED_NOVELS: Novel[] = [
  {
    id: 'novel-jannat-kay-pattay',
    title: 'Jannat Kay Pattay',
    urduTitle: 'جنت کے پتے',
    authorId: 'author-nemrah-ahmed',
    authorName: 'Nemrah Ahmed',
    genre: 'Romantic Suspense & Mystery',
    status: 'Completed',
    isPremium: false,
    isFeatured: true,
    isPublished: true,
    price: 0,
    coverUrl: '/src/assets/images/cover_jannat_kay_pattay_1791359901918.jpg',
    rating: 4.95,
    totalReviews: 3420,
    synopsis: 'A mesmerizing tale revolving around Haya Suleman, a law student who wins a scholarship to Turkey. What seems like an exciting academic adventure soon spirals into international intrigue, faith, secrets, and the quest for true inner peace.',
    urduSynopsis: 'ایک مسحور کن کہانی جو حیا سلیمان کے گرد گھومتی ہے جو ترکی میں اسکالرشپ حاصل کرتی ہے۔ یہ سفر اس کے عقیدے، خود اعتمادی اور زندگی کے حقیقی مقاصد کی تلاش کا امتحان بن جاتا ہے۔',
    publicationDate: '2013',
    episodesCount: 28,
    viewsCount: 540000,
    likesCount: 42000,
    tags: ['Mystery', 'Turkey', 'Faith', 'Suspense', 'Bestseller'],
    hasPdf: true,
    googleDriveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing',
    pdfFileName: 'Jannat_Kay_Pattay_Nemrah_Ahmed.pdf',
    pdfFileSize: '18.4 MB',
    pdfPages: 520,
    pdfAccessMode: 'both',
  },
  {
    id: 'novel-peer-e-kamil',
    title: 'Peer-e-Kamil (The Perfect Mentor)',
    urduTitle: 'پیرِ کامل (صلی اللہ علیہ وآلہ وسلم)',
    authorId: 'author-umera-ahmed',
    authorName: 'Umera Ahmed',
    genre: 'Spiritual & Social Drama',
    status: 'Completed',
    isPremium: false,
    isFeatured: true,
    isPublished: true,
    price: 0,
    coverUrl: '/src/assets/images/cover_peer_e_kamil_1791359911529.jpg',
    rating: 4.98,
    totalReviews: 8900,
    synopsis: 'An epoch-making masterpiece chronicling the intertwined spiritual evolution of Imama Hashim and Salar Sikandar—two souls on radically different trajectories seeking divine guidance and salvation.',
    urduSynopsis: 'اردو ادب کا ایک شاہکار جو امامہ ہاشم اور سالار سکندر کے روحانی اور فکری سفر کی داستان بیان کرتا ہے۔ حق و باطل کی کشمکش اور نورِ ہدایت کا بے مثال سفر۔',
    publicationDate: '2004',
    episodesCount: 32,
    viewsCount: 1250000,
    likesCount: 98000,
    tags: ['Spiritual', 'Classic', 'Masterpiece', 'Umera Ahmed'],
    hasPdf: true,
    googleDriveUrl: 'https://drive.google.com/file/d/1sB3iN_eM5fUqLpYJ8wK9_tV2xZ7A8mK/view?usp=sharing',
    pdfFileName: 'Peer_e_Kamil_Complete_Urdu.pdf',
    pdfFileSize: '22.1 MB',
    pdfPages: 480,
    pdfAccessMode: 'both',
  },
  {
    id: 'novel-aab-e-hayat',
    title: 'Aab-e-Hayat',
    urduTitle: 'آبِ حیات',
    authorId: 'author-umera-ahmed',
    authorName: 'Umera Ahmed',
    genre: 'Spiritual & Social Drama',
    status: 'Completed',
    isPremium: true,
    isFeatured: true,
    isPublished: true,
    price: 550,
    coverUrl: '/src/assets/images/cover_aab_e_hayat_1791359922444.jpg',
    rating: 4.91,
    totalReviews: 4120,
    synopsis: 'The highly anticipated sequel to Peer-e-Kamil. Follow Salar Sikandar and Imama as they navigate parenthood, global ethics, economic dilemmas, and enduring love anchored in absolute spiritual conviction.',
    urduSynopsis: 'پیرِ کامل کا یادگار تسلسل، جس میں سالار سکندر اور امامہ کی شادی شدہ زندگی، معاشرتی آزمائشیں اور حلال و حرام کے عمیق فلسفے کو اجاگر کیا گیا ہے۔',
    publicationDate: '2016',
    episodesCount: 24,
    viewsCount: 780000,
    likesCount: 65000,
    tags: ['Premium', 'Sequel', 'Spiritual', 'Bestseller'],
    hasPdf: true,
    googleDriveUrl: 'https://drive.google.com/file/d/1vA8xK7yW9zL2pM3m4n5b6v7c8x9z0/view?usp=sharing',
    pdfFileName: 'Aab_e_Hayat_Umera_Ahmed.pdf',
    pdfFileSize: '26.8 MB',
    pdfPages: 610,
    pdfAccessMode: 'both',
  },
  {
    id: 'novel-namal',
    title: 'Namal',
    urduTitle: 'نمل',
    authorId: 'author-nemrah-ahmed',
    authorName: 'Nemrah Ahmed',
    genre: 'Courtroom Thriller & Mystery',
    status: 'Completed',
    isPremium: true,
    isFeatured: false,
    isPublished: true,
    price: 650,
    coverUrl: '/src/assets/images/cover_jannat_kay_pattay_1791359901918.jpg',
    rating: 4.96,
    totalReviews: 5310,
    synopsis: 'A complex, multi-layered legal thriller woven around the Quranic narrative of Surah Namal. It explores blood feuds, judicial corruption, brotherly loyalty, and redemption through the lens of Faris Ghazi and Zumar Yousuf.',
    urduSynopsis: 'ایک زبردست عدالتی اور خاندانی سسپنس تھرلر جو فارس غازی اور زمر یوسف کے اردگرد گھومتی ہے۔ سچ، جھوٹ، انتقام اور قرآنی حکمت کا امتزاج۔',
    publicationDate: '2015',
    episodesCount: 30,
    viewsCount: 620000,
    likesCount: 51000,
    tags: ['Courtroom', 'Thriller', 'Quranic Themes', 'Suspense']
  },
  {
    id: 'novel-raja-gidh',
    title: 'Raja Gidh',
    urduTitle: 'راجہ گدھ',
    authorId: 'author-bano-qudsia',
    authorName: 'Bano Qudsia',
    genre: 'Psychological & Philosophical',
    status: 'Completed',
    isPremium: false,
    isFeatured: true,
    isPublished: true,
    price: 0,
    coverUrl: '/src/assets/images/hero_library_urdu_1791359887842.jpg',
    rating: 4.88,
    totalReviews: 2950,
    synopsis: 'A groundbreaking philosophical work analyzing the vulture metaphor in human desire—exploring how illicit cravings contaminate human genetics and soul.',
    urduSynopsis: 'اردو ادب کا فلسفیانہ شاہکار جس میں رزقِ حرام اور لاحاصل محبت کے انسانی روح اور جینیات پر تباہ کن اثرات کا تجسس انگیز تجزیہ کیا گیا ہے۔',
    publicationDate: '1981',
    episodesCount: 16,
    viewsCount: 410000,
    likesCount: 33000,
    tags: ['Philosophical', 'Classic', 'Psychology']
  },
  {
    id: 'novel-parizaad',
    title: 'Parizaad',
    urduTitle: 'پری زاد',
    authorId: 'author-hashim-nadeem',
    authorName: 'Hashim Nadeem',
    genre: 'Social & Emotional Drama',
    status: 'Completed',
    isPremium: false,
    isFeatured: false,
    isPublished: true,
    price: 0,
    coverUrl: '/src/assets/images/cover_peer_e_kamil_1791359911529.jpg',
    rating: 4.92,
    totalReviews: 3800,
    synopsis: 'The profound journey of a deeply sensitive, poetic youth with an unassuming appearance who endures societal rejection before life thrusts him into unexpected riches and deep dilemmas.',
    urduSynopsis: 'ایک بدصورت مگر بے انتہا حساس اور باصلاحیت نوجوان کی داستان، جو دنیا کے بے رحم روپ اور بعد ازاں دولت کی چکاچوند میں اپنی حقیقت تلاش کرتا ہے۔',
    publicationDate: '2014',
    episodesCount: 18,
    viewsCount: 890000,
    likesCount: 72000,
    tags: ['Social Drama', 'Emotional', 'Poetry']
  },
  {
    id: 'novel-haalim',
    title: 'Haalim',
    urduTitle: 'حالم',
    authorId: 'author-nemrah-ahmed',
    authorName: 'Nemrah Ahmed',
    genre: 'Time Travel & Political Drama',
    status: 'Completed',
    isPremium: true,
    isFeatured: false,
    isPublished: true,
    price: 600,
    coverUrl: '/src/assets/images/cover_aab_e_hayat_1791359922444.jpg',
    rating: 4.89,
    totalReviews: 2780,
    synopsis: 'A high-stakes narrative featuring Taliya Murad, a brilliant con-artist navigating Malaysian politics, time dilation, historical dynasties, and deep personal transformation.',
    urduSynopsis: 'وقت کا سفر، ملائیشیا کی سیاست، اور تالیہ مراد کی غیر معمولی ذہانت۔ ایک ایسا سنسنی خیز ناول جو قاری کو ابتدا سے آخر تک باندھ کر رکھتا ہے۔',
    publicationDate: '2019',
    episodesCount: 22,
    viewsCount: 470000,
    likesCount: 39000,
    tags: ['Time Travel', 'Mystery', 'International']
  },
  {
    id: 'novel-mushaf',
    title: 'Mushaf',
    urduTitle: 'مصحف',
    authorId: 'author-nemrah-ahmed',
    authorName: 'Nemrah Ahmed',
    genre: 'Spiritual Realism',
    status: 'Completed',
    isPremium: false,
    isFeatured: false,
    isPublished: true,
    price: 0,
    coverUrl: '/src/assets/images/cover_jannat_kay_pattay_1791359901918.jpg',
    rating: 4.87,
    totalReviews: 2100,
    synopsis: 'Mehmil Ibrahim is an orphan girl facing cold familial treatment, until she discovers an old Quran that begins directly addressing every dilemma she encounters.',
    urduSynopsis: 'محمل ابراہیم کی زندگی اور اس کے ہاتھ آنے والا وہ مصحف جو اس کی تنہائی، نا امیدی اور ہر پریشانی میں رہنما بن کر سامنے آتا ہے۔',
    publicationDate: '2011',
    episodesCount: 15,
    viewsCount: 340000,
    likesCount: 29000,
    tags: ['Spiritual', 'Inspirational', 'Quran']
  }
];

export const SEED_EPISODES: Episode[] = [
  // Jannat Kay Pattay Episodes
  {
    id: 'ep-jkp-1',
    novelId: 'novel-jannat-kay-pattay',
    episodeNumber: 1,
    title: 'Episode 1: The Golden Ticket to Istanbul',
    urduTitle: 'قسط ۱: استنبول کی پرواز اور نیا آغاز',
    publishedDate: '12 Jan 2024',
    isPremium: false,
    readTimeMinutes: 14,
    views: 45200,
    isPublished: true,
    contentUrdu: `بارش کی ہلکی ہلکی پھوار اب تیز بوندوں میں بدل چکی تھی۔ حیا سلیمان نے کھڑکی کا شیشہ کھولا اور سرد ہوا کا ایک پرسکون جھونکا اندر داخل ہو گیا۔ اس کے ہاتھ میں وہ خط تھا جس پر ترکی کی بین الاقوامی یونیورسٹی کی مہر ثبت تھی۔

"حیا! کیا تم واقعی تنہا جا رہی ہو؟" اس کی والدہ کے چہرے پر بیک وقت فخر اور اضطراب کے ملے جلے تاثرات نمایاں تھے۔

حیا نے مسکرا کر خط کو سینے سے لگایا۔ "امی، یہ صرف ایک اسکالرشپ نہیں ہے، یہ میری خود شناسی کا سفر ہے۔ میں جاننا چاہتی ہوں کہ دنیا کے اس پار میری تقدیر نے کیا لکھ رکھا ہے۔"

لیکن حیا کو یہ معلوم نہیں تھا کہ استنبول کے پرانے بازاروں، باسفورس کی گہری لہروں اور گلیات کے پراسرار موڑوں پر اس کا سامنا صرف کتابوں سے نہیں، بلکہ ان سوالات سے ہوگا جن کا جواب انسان صدیوں سے تلاش کر رہا ہے۔ کیا وہ اپنی شناخت پر قائم رہ سکے گی؟ کیا تقدیر کا کھیل اسے ایسے موڑ پر لا کھڑا کرے گا جہاں ہر راستہ ناممکن معلوم ہوتا ہے؟

جہاز نے جیسے ہی رن وے چھوڑا، حیا نے آنکھیں بند کر کے دعا مانگی۔ ایک نیا باب کھل رہا تھا، جس کی سیاہی ابھی تر تھی۔`
  },
  {
    id: 'ep-jkp-2',
    novelId: 'novel-jannat-kay-pattay',
    episodeNumber: 2,
    title: 'Episode 2: Shadows Across the Bosphorus',
    urduTitle: 'قسط ۲: باسفورس کے کنارے راز اور سائے',
    publishedDate: '19 Jan 2024',
    isPremium: false,
    readTimeMinutes: 16,
    views: 39800,
    isPublished: true,
    contentUrdu: `استنبول کی صبحیں پاکستان سے بالکل مختلف تھیں۔ یہاں تاریخ کی ہر اینٹ سے ایک قدیم کہانی پھوٹتی تھی۔ حیا کی یونیورسٹی کے احاطے میں قدم رکھتے ہی اس کا استقبال ایک غیر مانوس مگر مسحور کن خاموشی نے کیا۔

"آپ حیا سلیمان ہیں؟" ایک باوقار مگر غیر معمولی طور پر بارعب آواز نے اسے چونکا دیا۔

اس نے مڑ کر دیکھا۔ سیاہ کوٹ میں ملبوس شخص کی نظروں میں ایک ایسا تجسس تھا جو حیا کو اندر تک ہلا گیا۔ وہ جہان سکندر تھا؟ یا صرف ایک اجنبی؟

"جی، میں ہی ہوں۔ کیا ہم پہلے کبھی ملے ہیں؟" حیا نے اپنا لہجہ پراعتماد رکھنے کی کوشش کی۔

اجنبی نے ایک لمحے کے لیے ہلکی سی پراسرار مسکراہٹ دی اور کہا: "کچھ لوگ ملنے سے پہلے بھی ایک دوسرے کی تقدیر کا حصہ ہوتے ہیں، محترمہ۔ استنبول میں خوش آمدید، جہاں پتے جھڑتے ہیں تو جنت کی خوشبو لاتے ہیں۔"

اس ملاقات کے بعد حیا کے دل میں ایک ان دیکھی بے چینی گھر کر گئی۔ اس کے کمرے میں موجود بیگ پر ایک پراسرار نشان ثبت تھا—وہ نشان جو صرف خفیہ ایجنسیوں کے کاغذات پر دیکھا جاتا تھا۔`
  },
  {
    id: 'ep-jkp-3',
    novelId: 'novel-jannat-kay-pattay',
    episodeNumber: 3,
    title: 'Episode 3: The Masked Identity',
    urduTitle: 'قسط ۳: نقاب پوش کی سچی صدا',
    publishedDate: '26 Jan 2024',
    isPremium: false,
    readTimeMinutes: 18,
    views: 36400,
    isPublished: true,
    contentUrdu: `رات کا تیسرا پہر تھا اور ہاسٹل کی چھت سے پورا شہر ایک خوابیدہ تصویر کی طرح نظر آتا تھا۔ حیا نے اپنی ڈائری نکالی اور لکھنا شروع کیا:

'انسان جب خوف کے دائرے سے باہر نکلتا ہے، تو اسے احساس ہوتا ہے کہ اصل خطرہ دشمن نہیں، بلکہ خود اپنے اندر چھپی کمزوریاں ہیں۔'

اچانک دروازے پر دستک ہوئی۔ یہ وقت کسی مہمان کا نہیں تھا۔ حیا نے محتاط انداز میں دروازہ کھولا تو سامنے ایک لفافہ پڑا تھا جس میں ایک پرانی تصویر اور ایک چھوٹا سا چابی کا گچھا موجود تھا۔ تصویر میں وہ خود تھی، مگر اس مقام پر جہاں وہ اپنی یادداشت کے مطابق کبھی گئی ہی نہیں تھی۔

"یہ کون کر رہا ہے؟" اس کے لبوں سے بے ساختہ سرگوشی نکلی۔ اور تبھی فاصلے سے اذانِ فجر کی مترنم آواز گونج اٹھی۔ اس آواز میں ایک ایسا سکون تھا جس نے حیا کے منتشر اعصاب کو یکدم باندھ دیا۔ سچ اب زیادہ دور نہیں تھا۔`
  },
  {
    id: 'ep-jkp-4',
    novelId: 'novel-jannat-kay-pattay',
    episodeNumber: 4,
    title: 'Episode 4: The Web of Intelligence',
    urduTitle: 'قسط ۴: خفیہ معلومات اور پہلا امتحان',
    publishedDate: '02 Feb 2024',
    isPremium: false,
    readTimeMinutes: 15,
    views: 31200,
    isPublished: true,
    contentUrdu: `لائبریری کی قدیم الماریوں کے درمیان حیا نے ایک کتاب نکالی۔ اس کتاب کے حاشیے پر وہی علامت بنی ہوئی تھی جو اس کے پاس موجود نوٹ پر تھی۔ اس کا ہاتھ کانپنے لگا۔

وہ سمجھنے لگی تھی کہ اس کی ترکی آمد محض اتفاق نہیں تھی۔ اس کے پیچھے ایک پورا منصوبہ تھا، جس کی کڑیاں پاکستان سے لے کر یورپ کے سفارت خانوں تک پھیلی ہوئی تھیں۔

"جب آپ سچائی کو چھپانے کی کوشش کرتے ہیں، تو سچائی مزید طاقت کے ساتھ ابھرتی ہے،" ایک پرسکون آواز اس کے عقب سے ابھری۔

وہ پلٹی۔ وہی پروقار شخص پھر موجود تھا۔ "تم کون ہو؟ اور تم میرا پیچھا کیوں کر رہے ہو؟" حیا نے سختی سے پوچھا۔

"میں تمہارا محافظ ہوں، یا شاید تم میری محافظ بننے والی ہو، حیا۔ وقت بتائے گا۔"`
  },

  // Peer-e-Kamil Episodes
  {
    id: 'ep-pek-1',
    novelId: 'novel-peer-e-kamil',
    episodeNumber: 1,
    title: 'Episode 1: The High IQ Dilemma',
    urduTitle: 'قسط ۱: غیر معمولی ذہانت اور بے چین روح',
    publishedDate: '05 Jan 2024',
    isPremium: false,
    readTimeMinutes: 17,
    views: 89000,
    isPublished: true,
    contentUrdu: `سالار سکندر کو کسی چیز کی کمی نہ تھی۔ اس کا آئی کیو لیول 150 سے زیادہ تھا، اس کے پاس بے شمار دولت تھی، خاندان کی عزت تھی اور ہر وہ آسائش تھی جس کا ایک نوجوان خواب دیکھ سکتا ہے۔ لیکن اس کی روح خالی تھی۔

وہ اکثر اپنی کھڑکی کے پاس کھڑا ہو کر رات کے اندھیرے کو دیکھتا اور سوچتا: 'اگر زندگی صرف دولت، نام اور عیش کا نام ہے، تو مجھے اندر سے اتنا کھوکھلا پن کیوں محسوس ہوتا ہے؟'

دوسری طرف امامہ ہاشم تھی، جس کے خاندان کی بنیادیں ایک خاص عقیدے پر استوار تھیں، لیکن اس کے ذہن میں حق کی تڑپ نے تمام خاندانی روایات کو چیلنج کر دیا تھا۔ وہ راتوں کو رو رو کر دعا مانگتی تھی: "اے تمام جہانوں کے رب، مجھے وہ راستہ دکھا جو تیرے پیارے نبی صلی اللہ علیہ وآلہ وسلم کا راستہ ہے۔"

دو مختلف زندگیاں، دو انتہائیں، لیکن ان کا مقدر ایک ایسے نقطے پر ملنا تھا جو دونوں کے وجود کو جلا کر کندن بنانے والا تھا۔`
  },
  {
    id: 'ep-pek-2',
    novelId: 'novel-peer-e-kamil',
    episodeNumber: 2,
    title: 'Episode 2: The Midnight Call for Help',
    urduTitle: 'قسط ۲: آدھی رات کی پکار اور امتحان',
    publishedDate: '12 Jan 2024',
    isPremium: false,
    readTimeMinutes: 19,
    views: 76000,
    isPublished: true,
    contentUrdu: `فون کی گھنٹی نے سالار کو گہری نیند سے جگا دیا۔ اس نے سکرین پر نمبر دیکھا۔ ایک غیر مانوس نمبر۔

"سالار... مجھے تمہاری مدد کی ضرورت ہے۔ میرے پاس کوئی اور راستہ نہیں بچا۔" امامہ کی آواز میں بے بسی اور لرزش تھی۔

سالار نے طنزیہ انداز میں پوچھا: "تم؟ وہ متقی لڑکی جسے مجھ جیسے گنہگار کی شکل دیکھنا بھی گوارا نہ تھا؟ آج تمہیں میری مدد کی کیا ضرورت پڑ گئی؟"

"اگر تم نے مدد نہ کی تو وہ میری شادی زبردستی کر دیں گے، اور میں اپنے ایمان کا سودا نہیں کر سکتی،" امامہ نے سسکتے ہوئے کہا۔

سالار کے اندر کے مغرور انسان نے ایک شیطانی مسکراہٹ کے ساتھ سوچا کہ یہ امامہ کو جھکانے کا بہترین موقع ہے۔ لیکن اسے کیا خبر تھی کہ جس راستے پر وہ قدم رکھنے جا رہا تھا، وہ خود اس کی کایا پلٹ دینے والا تھا۔`
  },

  // Aab-e-Hayat Episodes (Premium)
  {
    id: 'ep-aeh-1',
    novelId: 'novel-aab-e-hayat',
    episodeNumber: 1,
    title: 'Episode 1: The Covenant of Eternity',
    urduTitle: 'قسط ۱: ابدی محبت کا عہد اور آزمائش',
    publishedDate: '15 Feb 2024',
    isPremium: true,
    price: 50,
    readTimeMinutes: 20,
    views: 28400,
    isPublished: true,
    contentUrdu: `سالار سکندر اب وہ پرانا سالار نہیں رہا تھا۔ عالمی مالیاتی اداروں کی چکاچوند میں اس نے ایک ایسا قدم اٹھانے کا فیصلہ کیا تھا جس نے روایتی بینکاری نظام کے ستون ہلا دیے تھے۔ وہ سود سے پاک معاشی نظام کی بنیاد رکھنا چاہتا تھا۔

"سالار، کیا تم جانتے ہو کہ تم کس طاقت کے خلاف کھڑے ہو رہے ہو؟" امامہ نے اس کی آنکھوں میں گہری محبت اور تشویش کے ساتھ دیکھا۔

سالار نے امامہ کا ہاتھ تھام کر دھیمے لہجے میں کہا: "امامہ! جب میں تاریکی میں تھا، تو اللہ نے مجھے تمہارے ذریعے ہدایت کی روشنی عطا کی۔ اب اگر میں دنیا کے لالچ میں آ کر حق کی بات نہ کروں، تو میں اپنے رب کا کیا سامنا کروں گا؟ آبِ حیات وہی ہے جو انسان کو حقیقی ابدی زندگی بخشے، اور وہ زندگی صرف سچائی میں ہے۔"

بچوں کی ہنسی نے کمرے میں خوشیوں کا رنگ بھر دیا، لیکن باہر ایک نیا طوفان جنم لے رہا تھا جس کا مقابلہ کرنے کے لیے دونوں کو اپنے صبر کی آخری حد تک جانا تھا۔`
  }
];

export const SEED_EBOOKS: Ebook[] = [
  {
    id: 'ebook-raja-gidh',
    title: 'Raja Gidh - Complete Digital Edition',
    urduTitle: 'راجہ گدھ - مکمل ڈیجیٹل ایڈیشن',
    author: 'Bano Qudsia',
    authorId: 'author-bano-qudsia',
    category: 'Philosophy',
    price: 0,
    isPremium: false,
    coverUrl: '/src/assets/images/hero_library_urdu_1791359887842.jpg',
    pages: 432,
    fileSize: '6.8 MB',
    description: 'The monumental philosophical novel investigating psychological trauma, forbidden love, and metaphysical boundaries in human society.',
    isPublished: true,
    sampleContent: 'گدھ صرف مردار کھاتا ہے، اور جب انسان کسی حرام شے یا حرام محبت پر تسکین پانے لگتا ہے تو اس کی روح گدھ بن جاتی ہے۔',
    hasPdf: true,
    googleDriveUrl: 'https://drive.google.com/file/d/1qW2eR3tY4uI5oP6a7sD8fG9h0jK1l/view?usp=sharing',
    pdfFileName: 'Raja_Gidh_Bano_Qudsia_Edition.pdf',
    pdfFileSize: '6.8 MB',
    pdfAccessMode: 'both',
  },
  {
    id: 'ebook-diwan-e-ghalib',
    title: 'Diwan-e-Ghalib (Annotated Masterpiece)',
    urduTitle: 'دیوانِ غالب (فرہنگ و تشریح کے ساتھ)',
    author: 'Mirza Asadullah Khan Ghalib',
    category: 'Poetry',
    price: 0,
    isPremium: false,
    coverUrl: '/src/assets/images/cover_peer_e_kamil_1791359911529.jpg',
    pages: 280,
    fileSize: '4.2 MB',
    description: 'The complete poetry collection of Mirza Ghalib with classical Urdu annotations, historical footnotes, and biographical preface.',
    isPublished: true,
    sampleContent: 'نقش فریادی ہے کس کی شوخیِ تحریر کا\nکاغذی ہے پیرہن ہر پیکرِ تصویر کا\n\nبس کہ دشوار ہے ہر کام کا آساں ہونا\nآدمی کو بھی میسر نہیں انساں ہونا',
    hasPdf: true,
    googleDriveUrl: 'https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6k7lM8nO9p0qR1s/view?usp=sharing',
    pdfFileName: 'Diwan_e_Ghalib_Complete.pdf',
    pdfFileSize: '4.2 MB',
    pdfAccessMode: 'both',
  },
  {
    id: 'ebook-shahab-nama',
    title: 'Shahab Nama',
    urduTitle: 'شہاب نامہ - سوانحِ حیات',
    author: 'Qudrat Ullah Shahab',
    category: 'Classical Books',
    price: 350,
    isPremium: true,
    coverUrl: '/src/assets/images/cover_aab_e_hayat_1791359922444.jpg',
    pages: 890,
    fileSize: '12.5 MB',
    description: 'The legendary autobiography and administrative memoir of Qudrat Ullah Shahab, spanning the partition of India, mystical encounters, and governance.',
    isPublished: true,
    sampleContent: 'زندگی ایک ایسا سفر ہے جس میں ہر موڑ پر انسان کو اپنی کم مائیگی کا اعتراف کرنا پڑتا ہے۔',
    hasPdf: true,
    googleDriveUrl: 'https://drive.google.com/file/d/1tU2vW3xY4zA5bC6d7eF8gH9i0jK1l/view?usp=sharing',
    pdfFileName: 'Shahab_Nama_Autobiography.pdf',
    pdfFileSize: '12.5 MB',
    pdfAccessMode: 'both',
  },
  {
    id: 'ebook-khuda-aur-mohabbat',
    title: 'Khuda Aur Mohabbat',
    urduTitle: 'خدا اور محبت',
    author: 'Hashim Nadeem',
    category: 'Urdu Literature',
    price: 250,
    isPremium: true,
    coverUrl: '/src/assets/images/cover_jannat_kay_pattay_1791359901918.jpg',
    pages: 310,
    fileSize: '5.1 MB',
    description: 'The immortal story of Hammad and Iman, tracing the bridge between mortal, worldly love and ultimate divine surrender.',
    isPublished: true,
    sampleContent: 'عشقِ مجازی جب حد سے گزر جائے تو وہ عشقِ حقیقی کی چوکھٹ پر سجدہ ریز ہو جاتا ہے۔',
    hasPdf: true,
    googleDriveUrl: 'https://drive.google.com/file/d/1mN2bV3cX4zL5kI6j7hG8fD9s0aQ1w/view?usp=sharing',
    pdfFileName: 'Khuda_Aur_Mohabbat_Urdu.pdf',
    pdfFileSize: '5.1 MB',
    pdfAccessMode: 'both',
  }
];

export const SEED_CLASSICAL: ClassicalWork[] = [
  {
    id: 'classical-ghalib',
    title: 'Ghazals of Mirza Ghalib',
    urduTitle: 'غزلیاتِ مرزا اسد اللہ خان غالب',
    author: 'Mirza Asadullah Khan Ghalib',
    urduAuthor: 'مرزا غالب',
    category: 'Ghazals',
    era: '19th Century (Mughal Era)',
    coverUrl: '/src/assets/images/hero_library_urdu_1791359887842.jpg',
    description: 'Immortal ghazals exploring philosophical introspection, love, human destiny, and existential depth.',
    isPublicDomain: true,
    contentUrdu: `دلِ ناداں تجھے ہوا کیا ہے؟\nآخر اس درد کی دوا کیا ہے؟\n\nہم ہیں مشتاق اور وہ بیزار\nیا الٰہی یہ ماجرا کیا ہے؟\n\nمیں بھی منہ میں زبان رکھتا ہوں\nکاش پوچھو کہ مدعا کیا ہے؟\n\nجب کہ تجھ بن نہیں کوئی موجود\nپھر یہ ہنگامہ اے خدا کیا ہے؟\n\nسبزہ و گل کہاں سے آئے ہیں؟\nابر کیا چیز ہے، ہوا کیا ہے؟`
  },
  {
    id: 'classical-iqbal',
    title: 'Shikwa & Jawab-e-Shikwa',
    urduTitle: 'شکوہ و جوابِ شکوہ - علامہ محمد اقبال',
    author: 'Allama Muhammad Iqbal',
    urduAuthor: 'علامہ محمد اقبال',
    category: 'Urdu Poetry',
    era: '20th Century (1909-1913)',
    coverUrl: '/src/assets/images/cover_peer_e_kamil_1791359911529.jpg',
    description: 'The poetic masterpiece addressing civilization, divine justice, awakening, and timeless spiritual regeneration.',
    isPublicDomain: true,
    contentUrdu: `کیوں زیاں کار بنوں، سود فراموش رہوں؟\nفکرِ فردا نہ کروں، محوِ غمِ دوش رہوں؟\n\nنالہ بلبل کا سنوں اور ہمہ تن گوش رہوں؟\nہم نوا! میں بھی کوئی گل ہوں کہ خاموش رہوں؟\n\nجرأت آموز مری تابِ سخن ہے مجھ کو\nشکوہ اللہ سے، خاکم بدہن، ہے مجھ کو!\n\n---\nجوابِ شکوہ:\nدل سے جو بات نکلتی ہے، اثر رکھتی ہے\nپر نہیں، طاقتِ پرواز مگر رکھتی ہے!`
  },
  {
    id: 'classical-manto',
    title: 'Toba Tek Singh (Afsana)',
    urduTitle: 'ٹوبہ ٹیک سنگھ - افسانہ',
    author: 'Saadat Hasan Manto',
    urduAuthor: 'سعادت حسن منٹو',
    category: 'Afsanay',
    era: '20th Century (1955)',
    coverUrl: '/src/assets/images/cover_jannat_kay_pattay_1791359901918.jpg',
    description: 'Manto’s searing satirical masterpiece on the Partition of 1947 through the tragic, moving eyes of Bishan Singh.',
    isPublicDomain: true,
    contentUrdu: `بٹوارے کے دو تین سال بعد پاکستان اور ہندوستان کی حکومتوں کو خیال آیا کہ اخلاقی قیدیوں کی طرح پاگلوں کا بھی تبادلہ ہونا چاہیے۔ یعنی جو مسلمان پاگل ہندوستان کے پاگل خانوں میں ہیں انہیں پاکستان پہنچا دیا جائے اور جو ہندو اور سکھ پاگل پاکستان کے پاگل خانوں میں ہیں وہ ہندوستان کے حوالے کر دیے جائیں۔\n\nبشن سنگھ، جس کا تعلق ٹوبہ ٹیک سنگھ سے تھا، پندرہ سال سے لاہور کے پاگل خانے میں تھا۔ وہ دن رات ایک ہی سوال دہراتا تھا:\n"اوپڑ دی گڑ گڑ دی اینکس دی بے دھیانا دی منگ دی دال آف دی لالٹین... ٹوبہ ٹیک سنگھ کہاں ہے؟ پاکستان میں یا ہندوستان میں؟"`
  },
  {
    id: 'classical-mir',
    title: 'Selected Ghazals of Mir Taqi Mir',
    urduTitle: 'انتخابِ کلامِ میر تقی میر (خدائے سخن)',
    author: 'Mir Taqi Mir',
    urduAuthor: 'میر تقی میر',
    category: 'Ghazals',
    era: '18th Century',
    coverUrl: '/src/assets/images/cover_aab_e_hayat_1791359922444.jpg',
    description: 'Sublime poetry by the master of grief, lyrical purity, and poignant aesthetic sentiment in Urdu literature.',
    isPublicDomain: true,
    contentUrdu: `پتا پتا بوٹا بوٹا حال ہمارا جانے ہے\nجانے نہ جانے گل ہی نہ جانے، باغ تو سارا جانے ہے\n\nنازکی اس کے لب کی کیا کہیے\nپنکھڑی اک گلاب کی سی ہے\n\nمیر ان نیم باز آنکھوں میں\nساری مستی شراب کی سی ہے`
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Novels Gallery',
  tagline: 'Discover Stories. Read. Explore. Imagine.',
  urduTagline: 'کہانیاں تلاش کریں، پڑھیں، دریافت کریں اور تخیل میں کھو جائیں',
  heroNovelId: 'novel-jannat-kay-pattay',
  announcement: '✨ Welcome to Novels Gallery! Enjoy free access to classical Urdu literature and popular series.',
  contactEmail: 'contact@novelsgallery.com',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  twitterUrl: 'https://twitter.com',
  whatsappUrl: 'https://whatsapp.com'
};
