import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
@Injectable()
export class SchematicService {
  getSchematic(): StreamableFile {
    const filePath = join(__dirname, '../public/product.schema.json');
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}
