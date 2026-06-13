import { ResumeImporter } from "../importer/ResumeImporter";

/**
 * Патерн Facade (Фасад).
 *
 * Єдина спрощена точка входу, що приховує складність процесу:
 * завантаження JSON → валідація → мапінг → рендеринг у DOM.
 * Зовнішній код викликає лише `init(jsonPath)`.
 */
export class ResumePage {
  async init(jsonPath: string): Promise<void> {
    const raw = await this.fetchData(jsonPath);
    new ResumeImporter(raw).import();
  }

  private async fetchData(path: string): Promise<unknown> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Не вдалося завантажити ${path}: ${response.status}`);
    }
    return response.json();
  }
}
