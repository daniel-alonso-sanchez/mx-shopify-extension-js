import { ExtensionException } from './extensionException';

export class NotAuthorizedException extends ExtensionException {
  constructor(title: string, message: string) {
    super(title, message);
  }
}
