import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SitesModule } from './modules/sites/sites.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PagesModule } from './modules/pages/pages.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MediaModule } from './modules/media/media.module';
import { SeederModule } from './modules/seeder/seeder.module';

import { User } from './entities/user.entity';
import { Site } from './entities/site.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Page } from './entities/page.entity';
import { Order } from './entities/order.entity';
import { SiteImage } from './entities/site-image.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/cms.db',
      entities: [User, Site, Category, Product, ProductImage, Page, Order, SiteImage],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    SitesModule,
    ProductsModule,
    CategoriesModule,
    PagesModule,
    OrdersModule,
    MediaModule,
    SeederModule,
  ],
})
export class AppModule {}
