import { Injectable } from '@nestjs/common';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MediaService {
  async uploadFile(file: Express.Multer.File) {
    return {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    };
  }

  async getAllFiles() {
    const uploadsDir = join(process.cwd(), 'uploads');
    try {
      const files = await readdir(uploadsDir);
      return files.map(filename => ({
        filename,
        url: `/uploads/${filename}`,
      }));
    } catch (error) {
      return [];
    }
  }

  async deleteFile(filename: string) {
    const filePath = join(process.cwd(), 'uploads', filename);
    try {
      await unlink(filePath);
      return { success: true, message: 'File deleted successfully' };
    } catch (error) {
      throw new Error('File not found or could not be deleted');
    }
  }
}
