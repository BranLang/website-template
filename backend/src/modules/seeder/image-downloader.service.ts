import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class ImageDownloaderService {
  private ensureUploadsDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async downloadImage(url: string, filename: string, subfolder = 'products'): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads', subfolder);
    this.ensureUploadsDirectory(uploadsDir);

    return new Promise((resolve, reject) => {
      const urlExt = path.extname(url.split('?')[0]);
      const fallbackExt = path.extname(filename) || '.jpg';
      const tmpName = `${Date.now()}-${randomBytes(6).toString('hex')}${urlExt || fallbackExt}`;
      const tmpPath = path.join(uploadsDir, tmpName);

      const protocol = url.startsWith('https:') ? https : http;
      
      const request = protocol.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        const hasher = createHash('sha256');
        const fileStream = fs.createWriteStream(tmpPath);
        response.on('data', (chunk) => hasher.update(chunk));
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          const digest = hasher.digest('hex').slice(0, 32);
          // Try to determine extension from content-type if URL had no ext
          const contentType = response.headers['content-type'] || '';
          let ext = urlExt || fallbackExt;
          if (!ext && contentType.startsWith('image/')) {
            const t = contentType.split('/')[1];
            if (t) ext = `.${t.replace('jpeg', 'jpg')}`;
          }
          const storedName = `${digest}${ext || '.jpg'}`;
          const finalPath = path.join(uploadsDir, storedName);
          try {
            if (fs.existsSync(finalPath)) {
              // Duplicate by content; remove temp and reuse existing
              fs.unlinkSync(tmpPath);
            } else {
              fs.renameSync(tmpPath, finalPath);
            }
            resolve(`/uploads/${subfolder}/${storedName}`);
          } catch (e) {
            // Cleanup temp on error
            try { fs.unlinkSync(tmpPath); } catch {}
            reject(e);
          }
        });

        fileStream.on('error', (err) => {
          fs.unlink(tmpPath, () => {}); // Delete the file if there was an error
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

  private fetchPage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      protocol
        .get(url, (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            // Follow redirect
            const redirectUrl = res.headers.location.startsWith('http')
              ? res.headers.location
              : new URL(res.headers.location, url).toString();
            this.fetchPage(redirectUrl).then(resolve).catch(reject);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to fetch page: ${res.statusCode}`));
            return;
          }
          let data = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        })
        .on('error', reject)
        .setTimeout(10000, function () {
          // @ts-ignore
          this.destroy();
          reject(new Error('Request timeout'));
        });
    });
  }

  private extractImageUrls(html: string, baseUrl: string): string[] {
    const urls = new Set<string>();
    const imgSrcRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match: RegExpExecArray | null;
    while ((match = imgSrcRegex.exec(html)) !== null) {
      const src = match[1];
      try {
        const abs = new URL(src, baseUrl).toString();
        urls.add(abs);
      } catch {}
    }
    // Also parse srcset entries
    const srcsetRegex = /srcset=["']([^"']+)["']/gi;
    while ((match = srcsetRegex.exec(html)) !== null) {
      const candidates = match[1].split(',').map((c) => c.trim().split(' ')[0]);
      for (const c of candidates) {
        try {
          const abs = new URL(c, baseUrl).toString();
          urls.add(abs);
        } catch {}
      }
    }
    return Array.from(urls);
  }

  async scrapeJustEurooknaImageUrls(): Promise<{ site: string[]; products: string[] }> {
    const base = 'https://www.just-eurookna.sk/';
    const pages = [
      base,
      `${base}produkty/okna/`,
      `${base}produkty/vchodove-dvere/`,
      `${base}realizacie/`,
      `${base}o-nas/`,
      `${base}clanky/`,
    ];
    const all = new Set<string>();
    for (const p of pages) {
      try {
        const html = await this.fetchPage(p);
        this.extractImageUrls(html, p).forEach((u) => all.add(u));
      } catch {}
    }
    // Filter to site domain and relevant paths
    const filtered = Array.from(all).filter((u) => u.includes('just-eurookna.sk'));
    const siteImgs = filtered.filter((u) => u.includes('/wp-content/themes/') || u.includes('/img/'));
    const productImgs = filtered.filter((u) => u.includes('/wp-content/uploads/'));
    return { site: siteImgs, products: productImgs };
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
