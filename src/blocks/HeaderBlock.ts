/**
 * Блок відображення заголовка резюме (ім'я, посада, контакти).
 */

import { ResumeModel } from "../models/ResumeModel";
import { IBlock } from "./BlockFactory";

export class HeaderBlock implements IBlock {
  constructor(private d: ResumeModel["header"]) {}

  render(): HTMLElement {
    const header = document.createElement("header");
    header.className = "section header";

    const { email, phone, location } = this.d.contacts;
    const contacts = [email, phone, location].filter(Boolean).join(" · ");

    header.innerHTML = `
      <h1>${this.d.fullName}</h1>
      <p>${this.d.title}</p>
      <p>${contacts}</p>
    `;

    return header;
  }
}
