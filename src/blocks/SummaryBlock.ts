/**
 * Блок відображення короткого опису (Summary).
 */

import { ResumeModel } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class SummaryBlock implements IBlock {
  constructor(private d: ResumeModel["summary"]) {}

  render(): HTMLElement {
    const el = document.createElement("section");
    el.className = "section summary";
    el.innerHTML = `<h2>Summary</h2><p>${this.d.text}</p>`;
    return el;
  }
}
