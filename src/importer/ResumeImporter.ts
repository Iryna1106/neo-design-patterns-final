/**
 * Конкретна реалізація імпортера резюме.
 * Наслідується від AbstractImporter (Template Method) і реалізує кроки
 * validate → map → render.
 */

import { AbstractImporter } from "./AbstractImporter";
import { ResumeModel } from "../models/ResumeModel";
import { BlockFactory, BlockType } from "../blocks/BlockFactory";

const REQUIRED_BLOCKS = [
  "header",
  "summary",
  "experience",
  "education",
  "skills",
] as const;

export class ResumeImporter extends AbstractImporter<ResumeModel> {
  /** Перевіряє наявність усіх обов'язкових блоків. */
  protected validate(): void {
    const data = this.raw;
    if (!data || typeof data !== "object") {
      throw new Error("Неприпустимий формат JSON: очікується об'єкт");
    }
    const obj = data as Record<string, unknown>;
    for (const key of REQUIRED_BLOCKS) {
      if (obj[key] == null) {
        throw new Error(`Відсутній обов'язковий блок: ${key}`);
      }
    }
  }

  /** Перетворює «сирий» JSON на внутрішню модель. */
  protected map(): ResumeModel {
    return this.raw as ResumeModel;
  }

  /** Створює блоки через фабрику і додає їх у #resume-content. */
  protected render(model: ResumeModel): void {
    const root = document.getElementById("resume-content")!;
    root.innerHTML = "";

    const factory = new BlockFactory();
    const order: BlockType[] = [
      "header",
      "summary",
      "experience",
      "education",
      "skills",
    ];

    for (const type of order) {
      root.appendChild(factory.createBlock(type, model).render());
    }
  }
}
