const { AppDataSource } = require('./dist/data-source');

(async () => {
  try {
    console.log('Initializing data source...');
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log('Dropping and recreating schema...');
    await AppDataSource.synchronize(true);
    console.log('Schema reset complete.');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Failed to reset DB schema:', err);
    process.exit(1);
  }
})();
