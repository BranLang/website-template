const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { SeederService } = require('./dist/modules/seeder/seeder.service');
const fs = require('fs');
const path = require('path');

async function createPlaceholderImages() {
  console.log('Creating placeholder images...');
  
  const uploadsRoot = path.join(process.cwd(), 'uploads');
  const uploadsDir = path.join(uploadsRoot, 'products');
  if (!fs.existsSync(uploadsRoot)) {
    fs.mkdirSync(uploadsRoot, { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Create placeholder images for products
  const imageFiles = [
    'wooden-window-1.jpg',
    'wooden-window-2.jpg',
    'wood-aluminum-window-1.jpg',
    'wood-aluminum-window-2.jpg',
    'aluminum-window-1.jpg',
    'aluminum-window-2.jpg',
    'historical-window-1.jpg',
    'historical-window-2.jpg',
    'wooden-door-1.jpg',
    'wooden-door-2.jpg',
    'aluminum-door-1.jpg',
    'aluminum-door-2.jpg',
    'sliding-door-1.jpg',
    'sliding-door-2.jpg',
    'historical-door-1.jpg',
    'historical-door-2.jpg'
  ];

  // Minimal 1x1 pixel JPEG (base64)
  const jpegBase64 = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEA8QEA8QDw8PDw8PDw8PDw8PDw8PFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICUuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIABQAFAAIBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBAwQCB//EADgQAAEDAgQDBQYHAAAAAAAAAAEAAhEDIQQSMUETIlFhcYGxBzKh0SNSgSMzQnLR4fAkQ3OC/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAEDBQEC/8QAGxEBAAMBAQEAAAAAAAAAAAAAAAECERIxIUH/2gAMAwEAAhEDEQA/APbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//2Q=='

  for (const filename of imageFiles) {
    const filepath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, Buffer.from(jpegBase64, 'base64'));
      console.log(`Created: ${filename}`);
    }
  }

  console.log('Placeholder images created successfully!');
}

async function updateDatabaseWithImages() {
  console.log('Updating database with image references...');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seederService = app.get(SeederService);
    
    // Get the image paths
    const imagePaths = [
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
      '/uploads/products/aluminum-door-1.jpg',
      '/uploads/products/aluminum-door-2.jpg',
      '/uploads/products/sliding-door-1.jpg',
      '/uploads/products/sliding-door-2.jpg',
      '/uploads/products/historical-door-1.jpg',
      '/uploads/products/historical-door-2.jpg'
    ];

    // Update the seeder service to use these images
    await seederService.seedProductImages(imagePaths);
    
    console.log('Database updated with image references!');
    await app.close();
  } catch (error) {
    console.error('Error updating database:', error);
  }
}

async function main() {
  await createPlaceholderImages();
  await updateDatabaseWithImages();
  console.log('All done!');
  process.exit(0);
}

main();
