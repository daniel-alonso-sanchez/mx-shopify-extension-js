import { ExtensionException } from './extensionException';

export class NotValidException extends ExtensionException {
  constructor(title: string, message: string) {
    super(title, message);
  }
}
