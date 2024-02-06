import { ExtensionException } from './extensionException';

export class NotFoundException extends ExtensionException {
  constructor(title: string, message: string) {
    super(title, message);
  }
}
