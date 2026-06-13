/**
 * Блок відображення навичок, згрупованих за категоріями.
 */

import { Skills } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class SkillsBlock implements IBlock {
  constructor(private d: Skills) {}

  render(): HTMLElement {
    const sec = document.createElement("section");
    sec.className = "section skills";
    sec.innerHTML = "<h2>Skills</h2>";

    const ul = document.createElement("ul");
    ul.className = "skills-list";

    for (const [category, items] of Object.entries(this.d)) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${category}:</strong> ${items.join(", ")}`;
      ul.appendChild(li);
    }

    sec.appendChild(ul);
    return sec;
  }
}
