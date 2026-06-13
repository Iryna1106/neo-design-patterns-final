/**
 * Патерн Composite (Компонувальник).
 *
 * ExperienceBlock — контейнер: для кожного запису досвіду рекурсивно
 * рендерить дочірні ProjectBlock-и. Нещодавні проєкти (isRecent) обгортаються
 * у HighlightDecorator (патерн Decorator).
 */

import { Experience } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";
import { ProjectBlock } from "./ProjectBlock";
import { HighlightDecorator } from "../decorators/HighlightDecorator";

export class ExperienceBlock implements IBlock {
  constructor(private d: Experience[]) {}

  render(): HTMLElement {
    const container = document.createElement("section");
    container.className = "section experience";
    container.innerHTML = "<h2>Experience</h2>";

    for (const exp of this.d) {
      const item = document.createElement("div");
      item.className = "experience-item";
      item.innerHTML = `<strong>${exp.position}</strong> — ${exp.company} (${exp.start} – ${exp.end})`;

      for (const project of exp.projects) {
        let block: IBlock = new ProjectBlock(project);
        if (project.isRecent) {
          block = new HighlightDecorator(block);
        }
        item.appendChild(block.render());
      }

      container.appendChild(item);
    }

    return container;
  }
}
