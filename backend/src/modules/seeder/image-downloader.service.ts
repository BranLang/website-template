import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

@Injectable()
export class ImageDownloaderService {
  private uploadsDir = path.join(process.cwd(), 'uploads', 'products');

  constructor() {
    this.ensureUploadsDirectory();
  }

  private ensureUploadsDirectory() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async downloadImage(url: string, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filepath = path.join(this.uploadsDir, filename);
      
      // Check if file already exists
      if (fs.existsSync(filepath)) {
        resolve(`/uploads/products/${filename}`);
        return;
      }

      const protocol = url.startsWith('https:') ? https : http;
      
      const request = protocol.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve(`/uploads/products/${filename}`);
        });

        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete the file if there was an error
          reject(err);
        });
      });

      request.on('error', (err) => {
        reject(err);
      });

      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Download timeout'));
      });
    });
  }

  async downloadJustEurooknaImages(): Promise<string[]> {
    const imageUrls = [
      // These are sample URLs - in a real scenario, you'd scrape the actual website
      'https://www.just-eurookna.sk/images/okna/drevene-okno-1.jpg',
      'https://www.just-eurookna.sk/images/okna/drevene-okno-2.jpg',
      'https://www.just-eurookna.sk/images/okna/drevohlinikove-okno-1.jpg',
      'https://www.just-eurookna.sk/images/okna/drevohlinikove-okno-2.jpg',
      'https://www.just-eurookna.sk/images/okna/hlinikove-okno-1.jpg',
      'https://www.just-eurookna.sk/images/okna/hlinikove-okno-2.jpg',
      'https://www.just-eurookna.sk/images/okna/historicke-okno-1.jpg',
      'https://www.just-eurookna.sk/images/okna/historicke-okno-2.jpg',
      'https://www.just-eurookna.sk/images/dvere/drevene-dvere-1.jpg',
      'https://www.just-eurookna.sk/images/dvere/drevene-dvere-2.jpg',
    ];

    const downloadedFiles: string[] = [];

    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const filename = `product-${i + 1}.jpg`;
        const filepath = await this.downloadImage(imageUrls[i], filename);
        downloadedFiles.push(filepath);
        console.log(`Downloaded: ${filename}`);
      } catch (error) {
        console.error(`Failed to download image ${i + 1}:`, error.message);
        // Create a placeholder image path
        downloadedFiles.push(`/uploads/products/product-${i + 1}.jpg`);
      }
    }

    return downloadedFiles;
  }
}
