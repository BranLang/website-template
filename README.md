# CMS - Content Management System

A modern, full-stack Content Management System built with Angular, NestJS, and SQLite. This CMS is designed for window and door manufacturing companies like Just Eurookná, providing comprehensive content management capabilities.

## Features

### 🏠 Public Website
- **Homepage** with featured products and company information
- **Product Catalog** with categories (Windows, Doors, Accessories)
- **Product Details** with images, specifications, and descriptions
- **Contact Form** for customer inquiries
- **Static Pages** (About, FAQ, etc.)
- **Responsive Design** for all devices
- **Theme support** – choose between `classic` and `modern` styles per site

### 🔧 Admin Panel
- **Dashboard** with overview statistics
- **Product Management** - Create, edit, delete products with images
- **Category Management** - Organize products by type
- **Page Management** - Create and edit static pages and blog posts
- **Order Management** - Handle customer inquiries and orders
- **User Management** - Manage admin users and roles
- **Media Library** - Upload and manage images
- **Rich Text Editor** - WYSIWYG content editing
- **Site Settings** - select visual theme for each site

### 🔐 Authentication & Security
- **JWT Authentication** with role-based access control
- **User Roles** - Admin, Editor, Viewer
- **Protected Routes** for admin panel
- **Secure File Uploads**

## Technology Stack

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with TypeORM
- **Authentication**: JWT with Passport
- **File Upload**: Multer
- **Validation**: Class-validator
- **CORS**: Enabled for frontend communication

### Frontend (Angular)
- **Framework**: Angular 16 with TypeScript
- **UI Library**: Angular Material Design
- **State Management**: RxJS BehaviorSubject
- **HTTP Client**: Angular HttpClient with interceptors
- **Rich Text Editor**: ngx-quill
- **Notifications**: ngx-toastr
- **Dynamic theming** loaded from API

## Project Structure

```
website-template/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── entities/        # Database entities
│   │   ├── modules/         # Feature modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── products/    # Product management
│   │   │   ├── categories/  # Category management
│   │   │   ├── pages/       # Page management
│   │   │   ├── orders/      # Order management
│   │   │   ├── users/       # User management
│   │   │   └── media/       # File uploads
│   │   └── main.ts          # Application entry point
│   ├── database/            # SQLite database files
│   └── uploads/             # Uploaded files
├── frontend/                # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Angular components
│   │   │   ├── services/    # API services
│   │   │   ├── guards/      # Route guards
│   │   │   └── layouts/     # Layout components
│   │   └── environments/    # Environment configs
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3000`

4. **Seed the database with demo content and images**:
   ```bash
   node seed-database.js
   ```

   This downloads images from [just-eurookna.sk](https://www.just-eurookna.sk) and populates the SQLite database.

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:4200`

   The site data and theme are loaded using `defaultSiteSlug` from the environment configuration.

### Default Admin Account

When you first start the backend, a default admin account is automatically created:

- **Email**: admin@example.com
- **Password**: admin123

⚠️ **Important**: Change these credentials after first login!

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all active products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all active categories
- `GET /api/categories/type/:type` - Get categories by type
- `POST /api/categories` - Create category (admin)
- `PATCH /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Pages
- `GET /api/pages` - Get all published pages
- `GET /api/pages/type/:type` - Get pages by type
- `POST /api/pages` - Create page (admin)
- `PATCH /api/pages/:id` - Update page (admin)
- `DELETE /api/pages/:id` - Delete page (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create order (public)
- `PATCH /api/orders/:id` - Update order (admin)
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Media
- `POST /api/media/upload` - Upload file (admin)
- `GET /api/media` - Get all files (admin)
- `DELETE /api/media/:filename` - Delete file (admin)

### Sites
- `GET /api/sites/slug/:slug` - Get site by slug (includes theme and images)

### Image Storage
- Images are downloaded during seeding and stored on disk under `/uploads/sites/<siteId>/`
- Metadata is saved in the `site_images` table so each image is tagged to its site
- For production deployments consider using a cloud object store (e.g. Google Drive) and saving the public URLs instead of raw files

## Database Schema

### Users
- id, email, firstName, lastName, password, role, isActive, createdAt, updatedAt

### Categories
- id, name, slug, description, type, imageUrl, sortOrder, isActive, createdAt, updatedAt

### Products
- id, name, slug, description, specifications, material, price, sortOrder, isActive, isFeatured, mainImageUrl, categoryId, createdAt, updatedAt

### ProductImages
- id, imageUrl, altText, sortOrder, isMain, productId, createdAt

### Pages
- id, title, slug, content, excerpt, type, featuredImageUrl, isPublished, sortOrder, metaDescription, metaKeywords, createdAt, updatedAt

### SiteImages
- id, imageUrl, altText, siteId, createdAt

### Orders
- id, customerName, customerEmail, customerPhone, message, type, status, adminNotes, productDetails, estimatedPrice, createdAt, updatedAt

## Customization

### Adding New Product Types
1. Update the `ProductMaterial` enum in `backend/src/entities/product.entity.ts`
2. Add corresponding category types in `backend/src/entities/category.entity.ts`
3. Update frontend forms and displays

### Customizing the Theme
1. Modify `frontend/src/styles.scss` for global styles
2. Update Angular Material theme in `angular.json`
3. Customize component-specific styles

### Adding New Features
1. Create new entities in `backend/src/entities/`
2. Add corresponding modules in `backend/src/modules/`
3. Create Angular components in `frontend/src/app/components/`
4. Update routing in `frontend/src/app/app.routes.ts`

## Deployment

### Backend Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables:
   - `JWT_SECRET` - Secret key for JWT tokens
   - `PORT` - Server port (default: 3000)

3. Start production server:
   ```bash
   npm run start:prod
   ```

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/cms-frontend` folder to your web server

3. Update `environment.prod.ts` with your production API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Angular, NestJS, and SQLite**
