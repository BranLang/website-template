import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Site } from './entities/site.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Page } from './entities/page.entity';
import { Order } from './entities/order.entity';
import { SiteImage } from './entities/site-image.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database/cms.db',
  entities: [
    User,
    Site,
    Category,
    Product,
    ProductImage,
    Page,
    Order,
    SiteImage,
  ],
  synchronize: true,
});
