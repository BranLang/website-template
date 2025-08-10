import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../../entities/site.entity';
import { Category, CategoryType, Language } from '../../entities/category.entity';
import { Product, ProductMaterial } from '../../entities/product.entity';
import { Page, PageType } from '../../entities/page.entity';
import { ProductImage } from '../../entities/product-image.entity';
import { SiteImage } from '../../entities/site-image.entity';
import { ImageDownloaderService } from './image-downloader.service';
import { createHash } from 'crypto';
import { CategoryTranslation } from '../../entities/category-translation.entity';
import { ProductTranslation } from '../../entities/product-translation.entity';
import { I18nString } from '../../entities/i18n-string.entity';
import { CarouselSlide } from '../../entities/carousel-slide.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private categoryTranslationRepository: Repository<CategoryTranslation>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductTranslation)
    private productTranslationRepository: Repository<ProductTranslation>,
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(SiteImage)
    private siteImageRepository: Repository<SiteImage>,
    @InjectRepository(I18nString)
    private i18nRepo: Repository<I18nString>,
    @InjectRepository(CarouselSlide)
    private carouselSlideRepository: Repository<CarouselSlide>,
    private imageDownloaderService: ImageDownloaderService,
  ) {}

  async seed() {
    console.log('Starting database seeding...');
    const site = await this.seedSite();
    await this.seedCategories(site.id);
    await this.seedProducts(site.id);
    await this.seedPages(site.id);
    await this.seedI18n(site.id);
    await this.seedCarousel(site.id);
    await this.downloadAndSeedImages();
    console.log('Database seeded successfully!');
  }

  private async seedSite(): Promise<Site> {
    const siteFolder = 'sites/just-eurookna';
    const logoUrl = await this.imageDownloaderService.downloadImage(
      'https://www.just-eurookna.sk/wp-content/themes/just/img/logo-just.png',
      'logo-just.png',
      siteFolder
    );
    const faviconUrl = await this.imageDownloaderService.downloadImage(
      'https://www.just-eurookna.sk/wp-content/themes/just/favicon.png',
      'favicon.png',
      siteFolder
    );
    const imageSources = [
      'homepage_1-2.jpg',
      'homepage_2-2.jpg',
      'homepage_3-2.jpg',
      'homepage_4-2.jpg',
      'homepage_5-2.jpg',
      'homepage_7-2.jpg',
      'homepage_8-2.jpg',
    ];
    const homeblockSources = {
      'drevene-okna': 'homeblock-drevene-okna.jpg',
      'drevohlinikove-okna': 'homeblock-drevo-hlinik.jpg',
      'hlinikove-okna': 'homeblock-hlinikove-systemy.jpg',
      'realizacie': 'homepage_8-2.jpg',
    } as const;

    const images: string[] = [];
    for (const img of imageSources) {
      const url = `https://www.just-eurookna.sk/wp-content/themes/just/img/${img}`;
      const saved = await this.imageDownloaderService.downloadImage(url, img, siteFolder);
      images.push(saved);
    }

    // Download category hero images and build mapping to saved hashed paths
    const categoryImages: Record<string, string> = {};
    for (const [slug, filename] of Object.entries(homeblockSources)) {
      const url = `https://www.just-eurookna.sk/wp-content/themes/just/img/${filename}`;
      const saved = await this.imageDownloaderService.downloadImage(url, filename, siteFolder);
      categoryImages[slug] = saved;
    }

    const siteData = {
      slug: 'just-eurookna',
      name: 'Just Eurookná',
      description: 'Slovenská výrobná spoločnosť zameraná na výrobu drevených, drevohliníkových a hliníkových okien a dverí',
      domain: 'www.just-eurookna.sk',
      contactEmail: 'info@just-eurookna.sk',
      contactPhone: '0905 431 240',
      contactAddress: 'Viničná 609, 951 71 Sľažany, Slovensko',
      metaDescription: 'Just Eurookná - kvalitné okná a dvere',
      metaKeywords: 'okná, dvere, drevené, hliníkové, výroba',
      isActive: true,
      theme: 'light',
      logoUrl,
      faviconUrl,
      settings: {
        images,
        categoryImages,
        themes: {
          light: {
            name: 'Light',
            primary: '#0091a7',
            background: '#ffffff',
            surface: '#f7f9fb',
            text: '#0f1720',
            link: '#0091a7'
          },
          dark: {
            name: 'Dark',
            primary: '#0091a7',
            background: '#0f1214',
            surface: '#141a1f',
            text: '#e6eef2',
            link: '#2bd3e6'
          }
        }
      }
    };

    let site = await this.siteRepository.findOne({
      where: { slug: siteData.slug }
    });
    
    if (!site) {
      site = this.siteRepository.create(siteData);
      site = await this.siteRepository.save(site);
      console.log('Site created successfully');
    } else {
      // Ensure themes exist on existing site
      const needsThemes = !site.settings || !site.settings.themes;
      if (needsThemes) {
        site.settings = siteData.settings;
        site.theme = siteData.theme;
        await this.siteRepository.save(site);
        console.log('Site themes initialized');
      } else {
        console.log('Site already exists');
      }

      // Ensure categoryImages mapping exists
      const needsCategoryImages = !site.settings || !site.settings.categoryImages;
      if (needsCategoryImages) {
        site.settings = {
          ...(site.settings || {}),
          categoryImages,
          images: site.settings?.images || images,
        };
        await this.siteRepository.save(site);
        console.log('Site categoryImages initialized');
      }
    }

    const allImages = [logoUrl, faviconUrl, ...images];
    for (const imageUrl of allImages) {
      const exists = await this.siteImageRepository.findOne({ where: { imageUrl, siteId: site.id } });
      if (!exists) {
        await this.siteImageRepository.save({ imageUrl, siteId: site.id });
      }
    }

    return site;
  }

  private async seedI18n(siteId: number) {
    const entries: Array<{ key: string; value: string; languageCode: string; namespace?: string | null }> = [
      // Common
      { key: 'COMMON.HOME', value: 'Úvod', languageCode: 'sk' },
      { key: 'COMMON.HOME', value: 'Home', languageCode: 'en' },
      { key: 'COMMON.ABOUT', value: 'O nás', languageCode: 'sk' },
      { key: 'COMMON.ABOUT', value: 'About', languageCode: 'en' },
      { key: 'COMMON.PRODUCTS', value: 'Produkty', languageCode: 'sk' },
      { key: 'COMMON.PRODUCTS', value: 'Products', languageCode: 'en' },
      { key: 'COMMON.CONTACT', value: 'Kontakt', languageCode: 'sk' },
      { key: 'COMMON.CONTACT', value: 'Contact', languageCode: 'en' },
      { key: 'COMMON.FAQ', value: 'Časté otázky', languageCode: 'sk' },
      { key: 'COMMON.FAQ', value: 'FAQ', languageCode: 'en' },

      // Home hero defaults
      { key: 'HOME.HERO_TITLE', value: 'Kvalitné okná a dvere', languageCode: 'sk' },
      { key: 'HOME.HERO_TITLE', value: 'Quality windows and doors', languageCode: 'en' },
      { key: 'HOME.HERO_SUBTITLE', value: 'Slovenská výroba, moderný dizajn', languageCode: 'sk' },
      { key: 'HOME.HERO_SUBTITLE', value: 'Slovak craft, modern design', languageCode: 'en' },
      { key: 'HOME.VIEW_ALL_PRODUCTS', value: 'Zobraziť všetky produkty', languageCode: 'sk' },
      { key: 'HOME.VIEW_ALL_PRODUCTS', value: 'View all products', languageCode: 'en' },

      // Products
      { key: 'PRODUCTS.VIEW_DETAILS', value: 'Zobraziť detaily', languageCode: 'sk' },
      { key: 'PRODUCTS.VIEW_DETAILS', value: 'View details', languageCode: 'en' },
      { key: 'PRODUCTS.CATEGORIES.TITLE', value: 'Kategórie', languageCode: 'sk' },
      { key: 'PRODUCTS.CATEGORIES.TITLE', value: 'Categories', languageCode: 'en' },

      // Group titles for home page cards
      { key: 'CATEGORIES.GROUP.WINDOWS', value: 'Okná', languageCode: 'sk' },
      { key: 'CATEGORIES.GROUP.WINDOWS', value: 'Windows', languageCode: 'en' },
      { key: 'CATEGORIES.GROUP.DOORS', value: 'Vchodové dvere', languageCode: 'sk' },
      { key: 'CATEGORIES.GROUP.DOORS', value: 'Entrance doors', languageCode: 'en' },
      { key: 'CATEGORIES.GROUP.REALIZATIONS', value: 'Realizácie', languageCode: 'sk' },
      { key: 'CATEGORIES.GROUP.REALIZATIONS', value: 'Showcase', languageCode: 'en' },
    ];

    for (const e of entries) {
      const existing = await this.i18nRepo.findOne({ where: { key: e.key, languageCode: e.languageCode, siteId } });
      if (!existing) {
        await this.i18nRepo.save({
          key: e.key,
          languageCode: e.languageCode,
          value: e.value,
          namespace: null,
          siteId,
        });
      }
    }
  }

  private async seedCategories(siteId: number) {
    // Create base categories once
    const base: Array<{ type: CategoryType; sortOrder: number; imageUrl?: string }> = [
      // Windows subcategories
      { type: CategoryType.WINDOW, sortOrder: 1 },
      { type: CategoryType.WINDOW, sortOrder: 2 },
      { type: CategoryType.WINDOW, sortOrder: 3 },
      { type: CategoryType.WINDOW, sortOrder: 4 },
      // Doors subcategories
      { type: CategoryType.DOOR, sortOrder: 5 },
      { type: CategoryType.DOOR, sortOrder: 6 },
      { type: CategoryType.DOOR, sortOrder: 7 },
      { type: CategoryType.DOOR, sortOrder: 8 },
      // Realizations main group (we use it as a separate top-level block in UI)
      { type: CategoryType.REALIZATION, sortOrder: 9 },
    ];

    const created: Category[] = [];
    for (const item of base) {
      let cat = await this.categoryRepository.findOne({ where: { sortOrder: item.sortOrder, siteId } });
      if (!cat) {
        cat = this.categoryRepository.create({ ...item, siteId, isActive: true });
        cat = await this.categoryRepository.save(cat);
      }
      created.push(cat);
    }

    // Attach translations
    const translations: Array<{ categoryIndex: number; language: Language; name: string; slug: string; description?: string }> = [
      { categoryIndex: 0, language: Language.SK, name: 'Drevené okná', slug: 'drevene-okna', description: 'Kvalitné drevené okná s výbornou tepelnou izoláciou' },
      { categoryIndex: 1, language: Language.SK, name: 'Drevohliníkové okná', slug: 'drevohlinikove-okna', description: 'Kombinácia dreva a hliníka pre maximálnu odolnosť' },
      { categoryIndex: 2, language: Language.SK, name: 'Hliníkové okná', slug: 'hlinikove-okna', description: 'Moderné hliníkové okná s elegantným dizajnom' },
      { categoryIndex: 3, language: Language.SK, name: 'Historické okná', slug: 'historicke-okna', description: 'Okná v historickom štýle pre pamiatkové objekty' },
      { categoryIndex: 4, language: Language.SK, name: 'Drevené dvere', slug: 'drevene-dvere', description: 'Kvalitné drevené vchodové dvere' },
      { categoryIndex: 5, language: Language.SK, name: 'Historické dvere', slug: 'historicke-dvere', description: 'Dvere v historickom štýle' },
      { categoryIndex: 6, language: Language.SK, name: 'Hliníkové dvere', slug: 'hlinikove-dvere', description: 'Moderné hliníkové vchodové dvere' },
      { categoryIndex: 7, language: Language.SK, name: 'Posuvné dvere', slug: 'posuvne-dvere', description: 'Funkčné posuvné dvere a steny' },
      { categoryIndex: 0, language: Language.EN, name: 'Wooden Windows', slug: 'wooden-windows', description: 'Quality wooden windows with excellent thermal insulation' },
      { categoryIndex: 1, language: Language.EN, name: 'Wood-Aluminum Windows', slug: 'wood-aluminum-windows', description: 'Combination of wood and aluminum for maximum durability' },
      { categoryIndex: 2, language: Language.EN, name: 'Aluminum Windows', slug: 'aluminum-windows', description: 'Modern aluminum windows with elegant design' },
      { categoryIndex: 3, language: Language.EN, name: 'Historical Windows', slug: 'historical-windows', description: 'Windows in historical style for heritage buildings' },
      { categoryIndex: 4, language: Language.EN, name: 'Wooden Doors', slug: 'wooden-doors', description: 'Quality wooden entrance doors' },
      { categoryIndex: 5, language: Language.EN, name: 'Historical Doors', slug: 'historical-doors', description: 'Doors in historical style' },
      { categoryIndex: 6, language: Language.EN, name: 'Aluminum Doors', slug: 'aluminum-doors', description: 'Modern aluminum entrance doors' },
      { categoryIndex: 7, language: Language.EN, name: 'Sliding Doors', slug: 'sliding-doors', description: 'Functional sliding doors and walls' },
      // Realizations
      { categoryIndex: 8, language: Language.SK, name: 'Realizácie', slug: 'realizacie', description: 'Ukážky hotových diel' },
      { categoryIndex: 8, language: Language.EN, name: 'Showcase', slug: 'showcase', description: 'Portfolio of completed work' },
    ];

    for (const t of translations) {
      const cat = created[t.categoryIndex];
      const exists = await this.categoryTranslationRepository.findOne({ where: { categoryId: cat.id, languageCode: t.language } });
      if (!exists) {
        await this.categoryTranslationRepository.save({
          categoryId: cat.id,
          languageCode: t.language,
          name: t.name,
          slug: t.slug,
          description: t.description || null,
        });
      }
    }
  }

  private async seedProducts(siteId: number) {
    // Helper to resolve categoryId via SK slug
    const getCategoryId = async (slugSk: string): Promise<number | undefined> => {
      const tr = await this.categoryTranslationRepository.findOne({ where: { slug: slugSk, languageCode: 'sk' } });
      return tr?.categoryId;
    };

    // Base products (language-agnostic)
    const baseProducts: Array<{ key: string; categorySlugSk: string; material: ProductMaterial; price: number; sortOrder: number; isFeatured: boolean; mainImageUrl: string }> = [
      { key: 'wood-double', categorySlugSk: 'drevene-okna', material: ProductMaterial.WOOD, price: 450, sortOrder: 1, isFeatured: true, mainImageUrl: '/uploads/products/wooden-window-1.jpg' },
      { key: 'woodal-triple', categorySlugSk: 'drevohlinikove-okna', material: ProductMaterial.WOOD_ALUMINUM, price: 650, sortOrder: 2, isFeatured: true, mainImageUrl: '/uploads/products/wood-aluminum-window-1.jpg' },
      { key: 'aluminum-insulated', categorySlugSk: 'hlinikove-okna', material: ProductMaterial.ALUMINUM, price: 380, sortOrder: 3, isFeatured: false, mainImageUrl: '/uploads/products/aluminum-window-1.jpg' },
      { key: 'historical-single', categorySlugSk: 'historicke-okna', material: ProductMaterial.HISTORICAL, price: 280, sortOrder: 4, isFeatured: false, mainImageUrl: '/uploads/products/historical-window-1.jpg' },
      { key: 'wood-door', categorySlugSk: 'drevene-dvere', material: ProductMaterial.WOOD, price: 1200, sortOrder: 5, isFeatured: true, mainImageUrl: '/uploads/products/wooden-door-1.jpg' },
    ];

    for (const bp of baseProducts) {
      const categoryId = await getCategoryId(bp.categorySlugSk);
      if (!categoryId) continue;
      let product = await this.productRepository.findOne({ where: { siteId, categoryId, sortOrder: bp.sortOrder } });
      if (!product) {
        product = this.productRepository.create({
          material: bp.material,
          price: bp.price,
          sortOrder: bp.sortOrder,
          isActive: true,
          isFeatured: bp.isFeatured,
          mainImageUrl: bp.mainImageUrl,
          siteId,
          categoryId,
        });
        product = await this.productRepository.save(product);
      }

      // Translations for this product
      const translations = [
        {
          languageCode: 'sk',
          name: bp.key === 'wood-double' ? 'Drevené okno s dvojitým zasklením' : bp.key === 'woodal-triple' ? 'Drevohliníkové okno s trojitým zasklením' : bp.key === 'aluminum-insulated' ? 'Hliníkové okno s termoizoláciou' : bp.key === 'historical-single' ? 'Historické okno s jednoduchým zasklením' : 'Drevené vchodové dvere',
          slug: bp.key === 'wood-double' ? 'drevene-okno-dvojite-zasklenie' : bp.key === 'woodal-triple' ? 'drevohlinikove-okno-trojite-zasklenie' : bp.key === 'aluminum-insulated' ? 'hlinikove-okno-termoizolacia' : bp.key === 'historical-single' ? 'historicke-okno-jednoduche-zasklenie' : 'drevene-vchodove-dvere',
          description: bp.key === 'wood-double' ? 'Kvalitné drevené okno s dvojitým zasklením a výbornou tepelnou izoláciou.' : bp.key === 'woodal-triple' ? 'Kombinácia dreva a hliníka s trojitým zasklením pre maximálnu odolnosť.' : bp.key === 'aluminum-insulated' ? 'Moderné hliníkové okno s termoizoláciou a elegantným dizajnom.' : bp.key === 'historical-single' ? 'Okno v historickom štýle s jednoduchým zasklením.' : 'Kvalitné drevené vchodové dvere s tepelnou izoláciou.',
        },
        {
          languageCode: 'en',
          name: bp.key === 'wood-double' ? 'Wooden Window with Double Glazing' : bp.key === 'woodal-triple' ? 'Wood-Aluminum Window with Triple Glazing' : bp.key === 'aluminum-insulated' ? 'Aluminum Window with Thermal Insulation' : bp.key === 'historical-single' ? 'Historical Window with Single Glazing' : 'Wooden Entrance Door',
          slug: bp.key === 'wood-double' ? 'wooden-window-double-glazing' : bp.key === 'woodal-triple' ? 'wood-aluminum-window-triple-glazing' : bp.key === 'aluminum-insulated' ? 'aluminum-window-thermal-insulation' : bp.key === 'historical-single' ? 'historical-window-single-glazing' : 'wooden-entrance-door',
          description: bp.key === 'wood-double' ? 'Quality wooden window with double glazing and excellent thermal insulation.' : bp.key === 'woodal-triple' ? 'Combination of wood and aluminum with triple glazing for maximum durability.' : bp.key === 'aluminum-insulated' ? 'Modern aluminum window with thermal insulation and elegant design.' : bp.key === 'historical-single' ? 'Window in historical style with single glazing.' : 'Quality wooden entrance door with thermal insulation and security lock.',
        },
      ];

      for (const t of translations) {
        const exists = await this.productTranslationRepository.findOne({ where: { productId: product.id, languageCode: t.languageCode } });
        if (!exists) {
          await this.productTranslationRepository.save({
            productId: product.id,
            languageCode: t.languageCode,
            name: t.name,
            slug: t.slug,
            description: t.description,
            specifications: null,
          });
        }
      }
    }
  }

  private async seedPages(siteId: number) {
    const pages = [
      // Slovak pages
      {
        title: 'O nás',
        slug: 'o-nas',
        content: `
          <h2>O spoločnosti JUST SK</h2>
          <p>Spoločnosť JUST SK je slovenská výrobná spoločnosť zameraná na výrobu drevených, drevohliníkových a hliníkových okien a dverí ako výplň stavebných otvorov pre rodinné domy a ostatné spoločenské budovy.</p>
          
          <h3>Naše hodnoty</h3>
          <ul>
            <li>Kvalita a spoľahlivosť</li>
            <li>Inovatívne riešenia</li>
            <li>Zákaznícka spokojnosť</li>
            <li>Responzívny prístup</li>
          </ul>
          
          <h3>Kontaktné údaje</h3>
          <p><strong>JUST SK, s.r.o.</strong><br>
          Viničná 609<br>
          951 71 Sľažany<br>
          Slovensko</p>
          
          <p><strong>IČO:</strong> 36736449<br>
          <strong>DIČ:</strong> SK2022323160<br>
          <strong>Pavol Just, konateľ:</strong> 0905 431 240</p>
        `,
        excerpt: 'Spoločnosť JUST SK je slovenská výrobná spoločnosť zameraná na výrobu drevených, drevohliníkových a hliníkových okien a dverí.',
        type: PageType.STATIC,
        sortOrder: 1,
        language: 'sk' as any,
        siteId: siteId,
        metaDescription: 'O spoločnosti JUST SK - výroba okien a dverí',
        metaKeywords: 'okná, dvere, výroba, drevené, hliníkové',
      },
      {
        title: 'Časté otázky',
        slug: 'caste-otazky',
        content: `
          <h2>Často kladené otázky</h2>
          
          <h3>Ako vybrať správne okná?</h3>
          <p>Pri výbere okien je dôležité zvážiť materiál, tepelnú izoláciu, zasklenie a dizajn. Naši odborníci vám poradia s výberom.</p>
          
          <h3>Aká je životnosť okien?</h3>
          <p>Životnosť okien závisí od materiálu a údržby. Drevené okná môžu slúžiť 20-30 rokov, hliníkové až 50 rokov.</p>
          
          <h3>Ako dlho trvá montáž?</h3>
          <p>Montáž okien trvá zvyčajne 1-3 dni v závislosti od počtu a typu okien.</p>
          
          <h3>Poskytujete záruku?</h3>
          <p>Áno, poskytujeme záruku 5 rokov na výrobky a 2 roky na montáž.</p>
        `,
        excerpt: 'Odpovede na najčastejšie otázky o oknách a dverách',
        type: PageType.FAQ,
        sortOrder: 2,
        language: 'sk' as any,
        siteId: siteId,
        metaDescription: 'Často kladené otázky o oknách a dverách',
        metaKeywords: 'otázky, okná, dvere, záruka, montáž',
      },
      // English pages
      {
        title: 'About Us',
        slug: 'about-us',
        content: `
          <h2>About JUST SK Company</h2>
          <p>JUST SK is a Slovak manufacturing company focused on the production of wooden, wood-aluminum and aluminum windows and doors as building openings for family houses and other public buildings.</p>
          
          <h3>Our Values</h3>
          <ul>
            <li>Quality and reliability</li>
            <li>Innovative solutions</li>
            <li>Customer satisfaction</li>
            <li>Responsive approach</li>
          </ul>
          
          <h3>Contact Information</h3>
          <p><strong>JUST SK, s.r.o.</strong><br>
          Viničná 609<br>
          951 71 Sľažany<br>
          Slovakia</p>
          
          <p><strong>VAT ID:</strong> 36736449<br>
          <strong>Tax ID:</strong> SK2022323160<br>
          <strong>Pavol Just, director:</strong> 0905 431 240</p>
        `,
        excerpt: 'JUST SK is a Slovak manufacturing company focused on the production of wooden, wood-aluminum and aluminum windows and doors.',
        type: PageType.STATIC,
        sortOrder: 1,
        language: 'en' as any,
        siteId: siteId,
        metaDescription: 'About JUST SK company - window and door manufacturing',
        metaKeywords: 'windows, doors, manufacturing, wooden, aluminum',
      },
      {
        title: 'Frequently Asked Questions',
        slug: 'frequently-asked-questions',
        content: `
          <h2>Frequently Asked Questions</h2>
          
          <h3>How to choose the right windows?</h3>
          <p>When choosing windows, it's important to consider material, thermal insulation, glazing and design. Our experts will advise you on the selection.</p>
          
          <h3>What is the lifespan of windows?</h3>
          <p>The lifespan of windows depends on the material and maintenance. Wooden windows can last 20-30 years, aluminum up to 50 years.</p>
          
          <h3>How long does installation take?</h3>
          <p>Window installation usually takes 1-3 days depending on the number and type of windows.</p>
          
          <h3>Do you provide warranty?</h3>
          <p>Yes, we provide 5-year warranty on products and 2-year warranty on installation.</p>
        `,
        excerpt: 'Answers to the most frequently asked questions about windows and doors',
        type: PageType.FAQ,
        sortOrder: 2,
        language: 'en' as any,
        siteId: siteId,
        metaDescription: 'Frequently asked questions about windows and doors',
        metaKeywords: 'questions, windows, doors, warranty, installation',
      },
    ];

    for (const pageData of pages) {
      const existing = await this.pageRepository.findOne({
        where: { siteId: pageData.siteId },
      });
      
      if (!existing) {
        const page = this.pageRepository.create(pageData);
        await this.pageRepository.save(page);
      }
    }
  }

  private async downloadAndSeedImages() {
    console.log('Downloading images from Just Eurookná website...');
    
    try {
      const scraped = await this.imageDownloaderService.scrapeJustEurooknaImageUrls();
      const seen = new Set<string>();
      const siteSaved: string[] = [];
      for (const url of scraped.site.slice(0, 20)) {
        if (seen.has(url)) continue;
        seen.add(url);
        try {
          const saved = await this.imageDownloaderService.downloadImage(url, url.split('/').pop() || 'site.jpg', 'sites/just-eurookna');
          if (!siteSaved.includes(saved)) siteSaved.push(saved);
        } catch (error) {
          console.error(`Error downloading site image: ${url}`, error);
        }
      }
      const productSaved: string[] = [];
      for (const url of scraped.products.slice(0, 60)) {
        if (seen.has(url)) continue;
        seen.add(url);
        try {
          const saved = await this.imageDownloaderService.downloadImage(url, url.split('/').pop() || 'product.jpg', 'products');
          if (!productSaved.includes(saved)) productSaved.push(saved);
        } catch (error) {
          console.error(`Error downloading product image: ${url}`, error);
        }
      }
      console.log(`Downloaded site images: ${siteSaved.length}, product images: ${productSaved.length}`);
      await this.seedProductImages(productSaved);
      await this.assignCategoryImagesFromProducts();
    } catch (error) {
      console.error('Error downloading images:', error);
      // Fallback to placeholder images
      await this.seedProductImages([]);
      await this.assignCategoryImagesFromProducts();
    }
  }

  private async seedProductImages(downloadedImages: string[] = []) {
    const products = await this.productRepository.find();
    
    // Use downloaded images or fallback to placeholder paths
    const imageUrls = downloadedImages.length > 0 ? downloadedImages : [
      '/uploads/products/wooden-window-1.jpg',
      '/uploads/products/wooden-window-2.jpg',
      '/uploads/products/wood-aluminum-window-1.jpg',
      '/uploads/products/wood-aluminum-window-2.jpg',
      '/uploads/products/aluminum-window-1.jpg',
      '/uploads/products/aluminum-window-2.jpg',
      '/uploads/products/historical-window-1.jpg',
      '/uploads/products/historical-window-2.jpg',
      '/uploads/products/wooden-door-1.jpg',
      '/uploads/products/wooden-door-2.jpg',
    ];

    for (const product of products) {
      // Add 1-2 images per product
      const numImages = Math.floor(Math.random() * 2) + 1;
      const startIndex = (product.id % 5) * 2;
      
      for (let i = 0; i < numImages; i++) {
        const imageUrl = imageUrls[startIndex + i];
        if (imageUrl) {
          const existing = await this.productImageRepository.findOne({
            where: { productId: product.id, imageUrl }
          });
          
          if (!existing) {
            const hash = createHash('sha256')
              .update(`${product.id}-${imageUrl}-${i}`)
              .digest('hex')
              .slice(0, 32);
            const productImage = this.productImageRepository.create({
              productId: product.id,
              imageUrl,
              altText: `Produkt ${product.id} - obrázok ${i + 1}`,
              sortOrder: i + 1,
              hash,
            });
            await this.productImageRepository.save(productImage);
            if (i === 0) {
              product.mainImageUrl = imageUrl;
              await this.productRepository.save(product);
            }
          }
        }
      }
    }
  }

  private async assignCategoryImagesFromProducts() {
    const categories = await this.categoryRepository.find({ relations: ['translations'] });
    const site = await this.siteRepository.findOne({ where: { slug: 'just-eurookna' } });
    const categoryImagesMap: Record<string, string> = (site?.settings?.categoryImages || {}) as any;
    const slugOf = (cat: any, lang = 'sk') => cat.translations?.find((t: any) => t.languageCode === lang)?.slug || cat.translations?.[0]?.slug;
    for (const cat of categories) {
      const slug = slugOf(cat) || '';
      const mapped = categoryImagesMap[slug];
      if (mapped) {
        cat.imageUrl = mapped;
        await this.categoryRepository.save(cat);
        continue;
      }
      if (!cat.imageUrl) {
        const product = await this.productRepository.findOne({ where: { categoryId: cat.id }, order: { sortOrder: 'ASC' } });
        if (product?.mainImageUrl) {
          cat.imageUrl = product.mainImageUrl;
          await this.categoryRepository.save(cat);
        }
      }
    }
  }

  private async seedCarousel(siteId: number) {
    console.log('Seeding carousel slides...');
    
    // Clear existing carousel slides
    await this.carouselSlideRepository.clear();
    
    // Define carousel slides with actual images from Just Eurookna website
    const carouselSlides = [
      {
        imageUrl: '/uploads/sites/just-eurookna/homepage_1-2.jpg',
        imageAlt: 'Dokonalá svetelná pohoda hliníkových okien s prepojením so záhradou',
        titleTranslationId: 'HOME.HERO_SLIDES.ALUMINUM_WINDOWS.TITLE',
        subtitleTranslationId: 'HOME.HERO_SLIDES.ALUMINUM_WINDOWS.SUBTITLE',
        category: 'windows',
        productType: 'aluminum',
        sortOrder: 1,
        siteId: siteId
      },
      {
        imageUrl: '/uploads/sites/just-eurookna/homepage_2-2.jpg',
        imageAlt: 'Energeticky úsporný domov s funkčnými oknami',
        titleTranslationId: 'HOME.HERO_SLIDES.ENERGY_EFFICIENT.TITLE',
        subtitleTranslationId: 'HOME.HERO_SLIDES.ENERGY_EFFICIENT.SUBTITLE',
        category: 'windows',
        productType: 'energy-saving',
        sortOrder: 2,
        siteId: siteId
      },
      {
        imageUrl: '/uploads/sites/just-eurookna/homepage_3-2.jpg',
        imageAlt: 'Veľkorysý výhľad spája interiér s exteriérom',
        titleTranslationId: 'HOME.HERO_SLIDES.PANORAMIC_VIEW.TITLE',
        subtitleTranslationId: 'HOME.HERO_SLIDES.PANORAMIC_VIEW.SUBTITLE',
        category: 'windows',
        productType: 'panoramic',
        sortOrder: 3,
        siteId: siteId
      },
      {
        imageUrl: '/uploads/sites/just-eurookna/homepage_4-2.jpg',
        imageAlt: 'Okná Vášho domova – kvalita, estetika, funkčný dizajn',
        titleTranslationId: 'HOME.HERO_SLIDES.QUALITY_DESIGN.TITLE',
        subtitleTranslationId: 'HOME.HERO_SLIDES.QUALITY_DESIGN.SUBTITLE',
        category: 'windows',
        productType: 'premium',
        sortOrder: 4,
        siteId: siteId
      },
      {
        imageUrl: '/uploads/sites/just-eurookna/homepage_5-2.jpg',
        imageAlt: 'Nezameniteľný, dokonalý domov s vôňou dreva',
        titleTranslationId: 'HOME.HERO_SLIDES.WOODEN_TRADITION.TITLE',
        subtitleTranslationId: 'HOME.HERO_SLIDES.WOODEN_TRADITION.SUBTITLE',
        category: 'windows',
        productType: 'wooden',
        sortOrder: 5,
        siteId: siteId
      },
      {
        imageUrl: '/uploads/sites/just-eurookna/homepage_7-2.jpg',
        imageAlt: 'Komfortné a bezpečné bývanie s osobitým akcentom',
        titleTranslationId: 'HOME.HERO_SLIDES.SECURITY_COMFORT.TITLE',
        subtitleTranslationId: 'HOME.HERO_SLIDES.SECURITY_COMFORT.SUBTITLE',
        category: 'doors',
        productType: 'security',
        sortOrder: 6,
        siteId: siteId
      },
      {
        imageUrl: '/uploads/sites/just-eurookna/homepage_8-2.jpg',
        imageAlt: 'Dialóg moderných materiálov v modernej stavbe',
        titleTranslationId: 'HOME.HERO_SLIDES.MODERN_MATERIALS.TITLE',
        subtitleTranslationId: 'HOME.HERO_SLIDES.MODERN_MATERIALS.SUBTITLE',
        category: 'doors',
        productType: 'modern',
        sortOrder: 7,
        siteId: siteId
      }
    ];

    for (const slideData of carouselSlides) {
      const carouselSlide = this.carouselSlideRepository.create(slideData);
      await this.carouselSlideRepository.save(carouselSlide);
    }

    console.log(`Seeded ${carouselSlides.length} carousel slides`);
  }
}
