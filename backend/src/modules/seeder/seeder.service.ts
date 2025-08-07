import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../../entities/site.entity';
import { Category, CategoryType, Language } from '../../entities/category.entity';
import { Product, ProductMaterial, Language as ProductLanguage } from '../../entities/product.entity';
import { Page, PageType, Language as PageLanguage } from '../../entities/page.entity';
import { ProductImage } from '../../entities/product-image.entity';
import { ImageDownloaderService } from './image-downloader.service';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    private imageDownloaderService: ImageDownloaderService,
  ) {}

  async seed() {
    console.log('Starting database seeding...');
    const site = await this.seedSite();
    await this.seedCategories(site.id);
    await this.seedProducts(site.id);
    await this.seedPages(site.id);
    await this.downloadAndSeedImages();
    console.log('Database seeded successfully!');
  }

  private async seedSite(): Promise<Site> {
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
    };

    let site = await this.siteRepository.findOne({
      where: { slug: siteData.slug }
    });
    
    if (!site) {
      site = this.siteRepository.create(siteData);
      site = await this.siteRepository.save(site);
      console.log('Site created successfully');
    } else {
      console.log('Site already exists');
    }

    return site;
  }

  private async seedCategories(siteId: number) {
    const categories = [
      // Slovak categories
      {
        name: 'Drevené okná',
        slug: 'drevene-okna',
        description: 'Kvalitné drevené okná s výbornou tepelnou izoláciou',
        type: CategoryType.WINDOW,
        sortOrder: 1,
        language: Language.SK,
        siteId: siteId,
      },
      {
        name: 'Drevohliníkové okná',
        slug: 'drevohlinikove-okna',
        description: 'Kombinácia dreva a hliníka pre maximálnu odolnosť',
        type: CategoryType.WINDOW,
        sortOrder: 2,
        language: Language.SK,
        siteId: siteId,
      },
      {
        name: 'Hliníkové okná',
        slug: 'hlinikove-okna',
        description: 'Moderné hliníkové okná s elegantným dizajnom',
        type: CategoryType.WINDOW,
        sortOrder: 3,
        language: Language.SK,
        siteId: siteId,
      },
      {
        name: 'Historické okná',
        slug: 'historicke-okna',
        description: 'Okná v historickom štýle pre pamiatkové objekty',
        type: CategoryType.WINDOW,
        sortOrder: 4,
        language: Language.SK,
        siteId: siteId,
      },
      {
        name: 'Drevené dvere',
        slug: 'drevene-dvere',
        description: 'Kvalitné drevené vchodové dvere',
        type: CategoryType.DOOR,
        sortOrder: 5,
        language: Language.SK,
        siteId: siteId,
      },
      {
        name: 'Historické dvere',
        slug: 'historicke-dvere',
        description: 'Dvere v historickom štýle',
        type: CategoryType.DOOR,
        sortOrder: 6,
        language: Language.SK,
        siteId: siteId,
      },
      {
        name: 'Hliníkové dvere',
        slug: 'hlinikove-dvere',
        description: 'Moderné hliníkové vchodové dvere',
        type: CategoryType.DOOR,
        sortOrder: 7,
        language: Language.SK,
        siteId: siteId,
      },
      {
        name: 'Posuvné dvere',
        slug: 'posuvne-dvere',
        description: 'Funkčné posuvné dvere a steny',
        type: CategoryType.DOOR,
        sortOrder: 8,
        language: Language.SK,
        siteId: siteId,
      },
      // English categories
      {
        name: 'Wooden Windows',
        slug: 'wooden-windows',
        description: 'Quality wooden windows with excellent thermal insulation',
        type: CategoryType.WINDOW,
        sortOrder: 1,
        language: Language.EN,
        siteId: siteId,
      },
      {
        name: 'Wood-Aluminum Windows',
        slug: 'wood-aluminum-windows',
        description: 'Combination of wood and aluminum for maximum durability',
        type: CategoryType.WINDOW,
        sortOrder: 2,
        language: Language.EN,
        siteId: siteId,
      },
      {
        name: 'Aluminum Windows',
        slug: 'aluminum-windows',
        description: 'Modern aluminum windows with elegant design',
        type: CategoryType.WINDOW,
        sortOrder: 3,
        language: Language.EN,
        siteId: siteId,
      },
      {
        name: 'Historical Windows',
        slug: 'historical-windows',
        description: 'Windows in historical style for heritage buildings',
        type: CategoryType.WINDOW,
        sortOrder: 4,
        language: Language.EN,
        siteId: siteId,
      },
      {
        name: 'Wooden Doors',
        slug: 'wooden-doors',
        description: 'Quality wooden entrance doors',
        type: CategoryType.DOOR,
        sortOrder: 5,
        language: Language.EN,
        siteId: siteId,
      },
      {
        name: 'Historical Doors',
        slug: 'historical-doors',
        description: 'Doors in historical style',
        type: CategoryType.DOOR,
        sortOrder: 6,
        language: Language.EN,
        siteId: siteId,
      },
      {
        name: 'Aluminum Doors',
        slug: 'aluminum-doors',
        description: 'Modern aluminum entrance doors',
        type: CategoryType.DOOR,
        sortOrder: 7,
        language: Language.EN,
        siteId: siteId,
      },
      {
        name: 'Sliding Doors',
        slug: 'sliding-doors',
        description: 'Functional sliding doors and walls',
        type: CategoryType.DOOR,
        sortOrder: 8,
        language: Language.EN,
        siteId: siteId,
      },
    ];

    for (const categoryData of categories) {
      const existing = await this.categoryRepository.findOne({
        where: { slug: categoryData.slug, language: categoryData.language, siteId: categoryData.siteId }
      });
      
      if (!existing) {
        const category = this.categoryRepository.create(categoryData);
        await this.categoryRepository.save(category);
      }
    }
  }

  private async seedProducts(siteId: number) {
    const categories = await this.categoryRepository.find();
    
    const products = [
      // Slovak products
      {
        name: 'Drevené okno s dvojitým zasklením',
        slug: 'drevene-okno-dvojite-zasklenie',
        description: 'Kvalitné drevené okno s dvojitým zasklením a výbornou tepelnou izoláciou. Ideálne pre rodinné domy a byty.',
        specifications: 'Materiál: smrek, Zasklenie: dvojité, Tepelná izolácia: Uw = 1.1 W/m²K',
        material: ProductMaterial.WOOD,
        price: 450.00,
        sortOrder: 1,
        isFeatured: true,
        mainImageUrl: '/uploads/products/wooden-window-1.jpg',
        language: ProductLanguage.SK,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'drevene-okna' && c.language === Language.SK)?.id,
      },
      {
        name: 'Drevohliníkové okno s trojitým zasklením',
        slug: 'drevohlinikove-okno-trojite-zasklenie',
        description: 'Kombinácia dreva a hliníka s trojitým zasklením pre maximálnu odolnosť a tepelnú izoláciu.',
        specifications: 'Materiál: drevo + hliník, Zasklenie: trojité, Tepelná izolácia: Uw = 0.8 W/m²K',
        material: ProductMaterial.WOOD_ALUMINUM,
        price: 650.00,
        sortOrder: 2,
        isFeatured: true,
        mainImageUrl: '/uploads/products/wood-aluminum-window-1.jpg',
        language: ProductLanguage.SK,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'drevohlinikove-okna' && c.language === Language.SK)?.id,
      },
      {
        name: 'Hliníkové okno s termoizoláciou',
        slug: 'hlinikove-okno-termoizolacia',
        description: 'Moderné hliníkové okno s termoizoláciou a elegantným dizajnom. Vhodné pre moderné budovy.',
        specifications: 'Materiál: hliník, Zasklenie: dvojité, Tepelná izolácia: Uw = 1.3 W/m²K',
        material: ProductMaterial.ALUMINUM,
        price: 380.00,
        sortOrder: 3,
        isFeatured: false,
        mainImageUrl: '/uploads/products/aluminum-window-1.jpg',
        language: ProductLanguage.SK,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'hlinikove-okna' && c.language === Language.SK)?.id,
      },
      {
        name: 'Historické okno s jednoduchým zasklením',
        slug: 'historicke-okno-jednoduche-zasklenie',
        description: 'Okno v historickom štýle s jednoduchým zasklením. Ideálne pre pamiatkové objekty a historické budovy.',
        specifications: 'Materiál: drevo, Zasklenie: jednoduché, Štýl: historický',
        material: ProductMaterial.HISTORICAL,
        price: 280.00,
        sortOrder: 4,
        isFeatured: false,
        mainImageUrl: '/uploads/products/historical-window-1.jpg',
        language: ProductLanguage.SK,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'historicke-okna' && c.language === Language.SK)?.id,
      },
      {
        name: 'Drevené vchodové dvere',
        slug: 'drevene-vchodove-dvere',
        description: 'Kvalitné drevené vchodové dvere s tepelnou izoláciou a bezpečnostným zámkom.',
        specifications: 'Materiál: dub, Tepelná izolácia: Ud = 1.2 W/m²K, Bezpečnosť: trieda 2',
        material: ProductMaterial.WOOD,
        price: 1200.00,
        sortOrder: 5,
        isFeatured: true,
        mainImageUrl: '/uploads/products/wooden-door-1.jpg',
        language: ProductLanguage.SK,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'drevene-dvere' && c.language === Language.SK)?.id,
      },
      // English products
      {
        name: 'Wooden Window with Double Glazing',
        slug: 'wooden-window-double-glazing',
        description: 'Quality wooden window with double glazing and excellent thermal insulation. Ideal for family houses and apartments.',
        specifications: 'Material: spruce, Glazing: double, Thermal insulation: Uw = 1.1 W/m²K',
        material: ProductMaterial.WOOD,
        price: 450.00,
        sortOrder: 1,
        isFeatured: true,
        mainImageUrl: '/uploads/products/wooden-window-1.jpg',
        language: ProductLanguage.EN,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'wooden-windows' && c.language === Language.EN)?.id,
      },
      {
        name: 'Wood-Aluminum Window with Triple Glazing',
        slug: 'wood-aluminum-window-triple-glazing',
        description: 'Combination of wood and aluminum with triple glazing for maximum durability and thermal insulation.',
        specifications: 'Material: wood + aluminum, Glazing: triple, Thermal insulation: Uw = 0.8 W/m²K',
        material: ProductMaterial.WOOD_ALUMINUM,
        price: 650.00,
        sortOrder: 2,
        isFeatured: true,
        mainImageUrl: '/uploads/products/wood-aluminum-window-1.jpg',
        language: ProductLanguage.EN,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'wood-aluminum-windows' && c.language === Language.EN)?.id,
      },
      {
        name: 'Aluminum Window with Thermal Insulation',
        slug: 'aluminum-window-thermal-insulation',
        description: 'Modern aluminum window with thermal insulation and elegant design. Suitable for modern buildings.',
        specifications: 'Material: aluminum, Glazing: double, Thermal insulation: Uw = 1.3 W/m²K',
        material: ProductMaterial.ALUMINUM,
        price: 380.00,
        sortOrder: 3,
        isFeatured: false,
        mainImageUrl: '/uploads/products/aluminum-window-1.jpg',
        language: ProductLanguage.EN,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'aluminum-windows' && c.language === Language.EN)?.id,
      },
      {
        name: 'Historical Window with Single Glazing',
        slug: 'historical-window-single-glazing',
        description: 'Window in historical style with single glazing. Ideal for heritage buildings and historical structures.',
        specifications: 'Material: wood, Glazing: single, Style: historical',
        material: ProductMaterial.HISTORICAL,
        price: 280.00,
        sortOrder: 4,
        isFeatured: false,
        mainImageUrl: '/uploads/products/historical-window-1.jpg',
        language: ProductLanguage.EN,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'historical-windows' && c.language === Language.EN)?.id,
      },
      {
        name: 'Wooden Entrance Door',
        slug: 'wooden-entrance-door',
        description: 'Quality wooden entrance door with thermal insulation and security lock.',
        specifications: 'Material: oak, Thermal insulation: Ud = 1.2 W/m²K, Security: class 2',
        material: ProductMaterial.WOOD,
        price: 1200.00,
        sortOrder: 5,
        isFeatured: true,
        mainImageUrl: '/uploads/products/wooden-door-1.jpg',
        language: ProductLanguage.EN,
        siteId: siteId,
        categoryId: categories.find(c => c.slug === 'wooden-doors' && c.language === Language.EN)?.id,
      },
    ];

    for (const productData of products) {
      if (productData.categoryId) {
        const existing = await this.productRepository.findOne({
          where: { slug: productData.slug, language: productData.language, siteId: productData.siteId }
        });
        
        if (!existing) {
          const product = this.productRepository.create(productData);
          await this.productRepository.save(product);
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
        language: PageLanguage.SK,
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
        language: PageLanguage.SK,
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
        language: PageLanguage.EN,
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
        language: PageLanguage.EN,
        siteId: siteId,
        metaDescription: 'Frequently asked questions about windows and doors',
        metaKeywords: 'questions, windows, doors, warranty, installation',
      },
    ];

    for (const pageData of pages) {
      const existing = await this.pageRepository.findOne({
        where: { slug: pageData.slug, language: pageData.language, siteId: pageData.siteId }
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
      const downloadedImages = await this.imageDownloaderService.downloadJustEurooknaImages();
      console.log(`Downloaded ${downloadedImages.length} images`);
      
      await this.seedProductImages(downloadedImages);
    } catch (error) {
      console.error('Error downloading images:', error);
      // Fallback to placeholder images
      await this.seedProductImages([]);
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
            const productImage = this.productImageRepository.create({
              productId: product.id,
              imageUrl,
              altText: `${product.name} - obrázok ${i + 1}`,
              sortOrder: i + 1
            });
            await this.productImageRepository.save(productImage);
          }
        }
      }
    }
  }
}
