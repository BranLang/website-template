import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Site } from './entities/site.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Page } from './entities/page.entity';
import { Order } from './entities/order.entity';
import { SiteImage } from './entities/site-image.entity';

describe('SQLite connection', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
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
    await dataSource.initialize();
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should initialize connection', () => {
    expect(dataSource.isInitialized).toBe(true);
  });

  it('should run a simple query', async () => {
    const result = await dataSource.query('SELECT 1 as result');
    expect(result[0].result).toBe(1);
  });
});
