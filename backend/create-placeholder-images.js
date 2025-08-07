const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { SeederService } = require('./dist/modules/seeder/seeder.service');
const fs = require('fs');
const path = require('path');

async function createPlaceholderImages() {
  console.log('Creating placeholder images...');
  
  const uploadsDir = path.join(process.cwd(), 'uploads', 'products');
  
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

  // Create a simple SVG placeholder for each image
  const svgPlaceholder = `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f0f0f0"/>
  <rect x="50" y="50" width="300" height="200" fill="#e0e0e0" stroke="#ccc" stroke-width="2"/>
  <text x="200" y="160" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">Product Image</text>
  <text x="200" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="#999">400x300</text>
</svg>`;

  for (const filename of imageFiles) {
    const filepath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, svgPlaceholder);
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
