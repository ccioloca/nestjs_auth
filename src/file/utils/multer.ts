import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = diskStorage({
  destination: '../uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${name}-${randomName}${extension}`);
  },
});

export function FileFilter(req: any, file: any, callback: any) {
  if (!file.originalname.match(/\.(pdf|doc|docx|ppt|pptx)$/)) {
    return callback(
      new BadRequestException('only accept file png,jpeg,jpg'),
      false,
    );
  }
  callback(null, true);
}