export class ExtensionException {
  title: string;
  detail: string;
  parameters: Map<string, string>;

  constructor(title: string, detail: string) {
    this.title = title;
    this.detail = detail;
    this.parameters = new Map();
  }
}
