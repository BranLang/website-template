const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { SeederService } = require('./dist/modules/seeder/seeder.service');

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seederService = app.get(SeederService);
    
    await seederService.seed();
    
    console.log('Database seeded successfully!');
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
