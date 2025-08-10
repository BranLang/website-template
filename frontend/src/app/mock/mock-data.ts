import * as en from '../../assets/i18n/en.json';
import * as sk from '../../assets/i18n/sk.json';
// Simple mock datasets for development without backend
export const mockProducts = [
  {
    id: 1,
    slug: 'premium-window',
    name: { sk: 'Prémiové okno', en: 'Premium Window' },
    description: { sk: 'Energeticky úsporné plastové okno.', en: 'Energy-efficient PVC window.' },
    price: 350,
    featured: true,
    categoryId: 1
  },
  {
    id: 2,
    slug: 'classic-door',
    name: { sk: 'Klasické dvere', en: 'Classic Door' },
    description: { sk: 'Spoľahlivé vchodové dvere.', en: 'Reliable entrance door.' },
    price: 480,
    featured: true,
    categoryId: 2
  }
];

export const mockCategories = [
  { id: 1, slug: 'windows', type: 'window', name: { sk: 'Okná', en: 'Windows' } },
  { id: 2, slug: 'doors', type: 'door', name: { sk: 'Dvere', en: 'Doors' } },
  { id: 3, slug: 'realizations', type: 'realization', name: { sk: 'Realizácie', en: 'Realizations' } }
];

export const mockPages = [
  { id: 1, slug: 'about', type: 'info', title: { sk: 'O nás', en: 'About Us' }, content: { sk: 'Sme výrobca...', en: 'We are a producer...' } }
];

export const mockSite = {
  id: 1,
  slug: 'just-eurookna',
  name: 'Just EuroOkna',
  theme: 'deep-blue',
  settings: { themes: ['light', 'dark', 'modern', 'classic', 'deep-blue'] }
};

export const mockMediaFiles = [
  { filename: 'windows-hero.jpg', url: 'https://www.just-eurookna.sk/wp-content/uploads/2018/04/okna-uvod.jpg' },
  { filename: 'doors-hero.jpg', url: 'https://www.just-eurookna.sk/wp-content/uploads/2018/04/vchodove-dvere.jpg' },
  { filename: 'realization-hero.jpg', url: 'https://www.just-eurookna.sk/wp-content/uploads/2018/04/realizacie.jpg' }
];

export const mockTranslations: Record<string, any> = {
  sk: sk,
  en: en
};

// augment existing entities with image urls
mockProducts.forEach(p => {
  (p as any).imageUrl = 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=60';
});

mockCategories.forEach(c => {
  if (c.slug === 'windows') (c as any).imageUrl = mockMediaFiles[0].url;
  if (c.slug === 'doors') (c as any).imageUrl = mockMediaFiles[1].url;
  if (c.slug === 'realizations') (c as any).imageUrl = mockMediaFiles[2].url;
});

// categoryImages mapping for site settings
const categoryImages: Record<string, string> = {
  windows: mockMediaFiles[0].url,
  doors: mockMediaFiles[1].url,
  realizacie: mockMediaFiles[2].url
};

(mockSite as any).settings = {
  ...(mockSite as any).settings,
  images: mockMediaFiles.map(m => m.url),
  categoryImages,
  themes: ['light', 'dark', 'modern', 'classic', 'deep-blue']
};
