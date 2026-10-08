import { CustomPage } from '../types';

export const SEED_PAGES: CustomPage[] = [
  {
    id: 'page-about-gallery',
    title: 'About Novels Gallery',
    urduTitle: 'ناولز گیلری کے بارے میں',
    slug: 'about-novels-gallery',
    content: `Welcome to **Novels Gallery**, the premier digital sanctuary for Urdu literature, serialized contemporary masterpieces, classical treasures, and downloadable high-resolution PDF editions.

Our mission is to preserve and celebrate the richness of Urdu literature for readers across the globe. From timeless literary epics by Bano Qudsia and Ashfaq Ahmed to modern bestsellers by Nemrah Ahmed and Umera Ahmed, Novels Gallery bridges classical heritage with cutting-edge digital reading experiences.

### What We Offer:
- **Comprehensive Urdu Library:** Access thousands of chapters with authentic Urdu Nastaliq typography and customizable reading themes.
- **Official PDF System:** Read complete novels online in our built-in responsive PDF reader or download offline copies where permitted by authors.
- **Community of Writers & Readers:** Dedicated author profiles, serialized episode releases, discussion spaces, and instant bookmark syncing.
- **Fair Creator Royalties:** Direct support for contemporary novelists and content creators.`,
    urduContent: `ناولز گیلری اردو ادب کی ترویج اور فروغ کے لیے وقف کردہ ایک جدید ڈیجیٹل کتب خانہ ہے۔ یہاں آپ کو پاکستان کے ممتاز ناول نگاروں کے شاہکار ناولز، اقساط، ای بکس اور باقاعدہ پی ڈی ایف ایڈیشنز دستیاب ہیں۔`,
    featuredImage: '/src/assets/images/hero_library_urdu_1791359887842.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    links: [
      { label: 'Explore All Novels', url: '/novels' },
      { label: 'Featured Authors', url: '/authors' },
      { label: 'E-Books & PDFs', url: '/ebooks' }
    ],
    publishStatus: 'published',
    publicationDate: '2025-10-08',
    publicationTime: '10:00',
    isPublished: true,
    showInNav: true,
    showInFooter: true,
    metaTitle: 'About Novels Gallery | Premier Urdu Digital Library',
    metaDescription: 'Discover the vision behind Novels Gallery, the world’s leading digital reading sanctuary for Urdu novels, classical literature, and authorized PDF editions.',
    createdAt: '2025-10-08T10:00:00.000Z',
    updatedAt: '2026-10-08T00:00:00.000Z'
  },
  {
    id: 'page-author-guidelines',
    title: 'Author Submission & Publishing Guidelines',
    urduTitle: 'مصنفین کے لیے اشاعتی ہدایات اور شرائط',
    slug: 'submission-guidelines',
    content: `Are you an aspiring or established Urdu novelist looking to publish your stories to hundreds of thousands of passionate readers? Novels Gallery provides an open, supportive, and monetizable platform for Urdu writers worldwide.

### Submission Criteria:
1. **Originality:** Submissions must be 100% original works of fiction, serialized stories, or literary collections in Urdu. Plagiarism is strictly prohibited.
2. **Formatting:** Submit manuscripts in InPage, MS Word (Urdu Unicode), or high-quality clean PDF format.
3. **Serialization:** Novelists can publish full novels or serialized episodes on weekly or monthly schedules.
4. **Rights & Ownership:** Writers retain intellectual property rights to their creative work.

### How to Submit:
Send your novel synopsis and sample chapter to editorial@novelsgallery.com or reach out via our Admin Editorial desk.`,
    urduContent: `اگر آپ ناول نگار، افسانہ نگار یا شاعر ہیں اور اپنی تحریریں دنیا بھر کے لاکھوں قارئین تک پہنچانا چاہتے ہیں تو ناولز گیلری کا اشاعتی دروازہ آپ کے لیے کھلا ہے۔`,
    featuredImage: '/src/assets/images/author_nemrah_ahmed_1791359933182.jpg',
    links: [
      { label: 'Contact Editorial Desk', url: '/contact' },
      { label: 'View Published Authors', url: '/authors' }
    ],
    publishStatus: 'published',
    publicationDate: '2025-10-08',
    publicationTime: '12:00',
    isPublished: true,
    showInNav: true,
    showInFooter: true,
    metaTitle: 'Author Submission Guidelines | Novels Gallery',
    metaDescription: 'Complete submission and publishing guidelines for Urdu novel writers, essayists, and poets wanting to publish on Novels Gallery.',
    createdAt: '2025-10-08T12:00:00.000Z',
    updatedAt: '2026-10-08T00:00:00.000Z'
  },
  {
    id: 'page-pdf-policy',
    title: 'PDF Reading & Download Policy',
    urduTitle: 'پی ڈی ایف پالیسی اور ضوابط',
    slug: 'pdf-policy',
    content: `Novels Gallery integrates a comprehensive PDF system enabling online reading via our integrated PDF viewer and direct offline downloads where author authorization is granted.

### PDF Access Modes:
- **Read & Download (Both):** Public domain or author-permitted titles can be read directly in browser or downloaded.
- **Online Only:** Interactive reading is enabled through the secured in-browser reader, preserving author digital rights.
- **Download Only:** Titles configured for direct download to mobile or desktop storage.
- **Google Drive Integration:** High-speed cloud mirrors powered by verified Google Drive links ensuring persistent availability across all devices.`,
    urduContent: `ناولز گیلری کے پی ڈی ایف سسٹم کے تحت قارئین کو آن لائن ریڈنگ اور ڈاؤن لوڈ کی سہولیات مصنف کے حقوق کا احترام کرتے ہوئے فراہم کی جاتی ہیں۔`,
    featuredImage: '/src/assets/images/cover_jannat_kay_pattay_1791359901918.jpg',
    links: [
      { label: 'Browse PDF E-Books', url: '/ebooks' },
      { label: 'Terms of Service', url: '/page/terms-of-service' }
    ],
    publishStatus: 'published',
    publicationDate: '2025-10-08',
    publicationTime: '14:00',
    isPublished: true,
    showInNav: false,
    showInFooter: true,
    metaTitle: 'PDF Reading & Download Policy | Novels Gallery',
    metaDescription: 'Information regarding online PDF viewing, Google Drive integration, offline downloads, and author copyright compliance.',
    createdAt: '2025-10-08T14:00:00.000Z',
    updatedAt: '2026-10-08T00:00:00.000Z'
  },
  {
    id: 'page-privacy-policy',
    title: 'Privacy Policy',
    urduTitle: 'پرائیویسی پالیسی',
    slug: 'privacy-policy',
    content: `Your privacy is important to us. This Privacy Policy details how Novels Gallery collects, uses, and safeguards your information when you visit our website, read novels, download PDFs, or engage with our community.

### Information We Collect:
- Reading bookmarks, progress, and preferences stored locally on your device for fast performance.
- Analytics data to improve reader navigation, popular novel rankings, and performance across devices.
- No personal data is shared with third parties without your explicit consent.`,
    urduContent: `ہم آپ کی ذاتی معلومات اور رازداری کا مکمل احترام کرتے ہیں۔ ناولز گیلری آپ کے ڈیٹا کو محفوظ رکھنے کا پابند ہے۔`,
    publishStatus: 'published',
    publicationDate: '2025-10-08',
    publicationTime: '08:00',
    isPublished: true,
    showInNav: false,
    showInFooter: true,
    metaTitle: 'Privacy Policy | Novels Gallery',
    metaDescription: 'Read the official privacy policy of Novels Gallery regarding reader data, reading preferences, and security.',
    createdAt: '2025-10-08T08:00:00.000Z',
    updatedAt: '2026-10-08T00:00:00.000Z'
  }
];
