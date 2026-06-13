/**
 * Блок відображення освіти (усі записи education).
 */

import { Education } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class EducationBlock implements IBlock {
  constructor(private d: Education[]) {}

  render(): HTMLElement {
    const el = document.createElement("section");
    el.className = "section education";
    el.innerHTML = "<h2>Education</h2>";

    for (const edu of this.d) {
      const item = document.createElement("div");
      item.className = "education-item";
      item.innerHTML = `<strong>${edu.degree}</strong>, ${edu.field} — ${edu.institution} (${edu.graduation})`;
      el.appendChild(item);
    }

    return el;
  }
}
