/**
 * Патерн Factory Method (Фабричний метод).
 *
 * BlockFactory інкапсулює створення різних типів блоків резюме:
 * за переданим типом повертає відповідний об'єкт, що реалізує IBlock.
 */

import { ResumeModel } from "../models/ResumeModel";
import { HeaderBlock } from "./HeaderBlock";
import { SummaryBlock } from "./SummaryBlock";
import { ExperienceBlock } from "./ExperienceBlock";
import { EducationBlock } from "./EducationBlock";
import { SkillsBlock } from "./SkillsBlock";

export interface IBlock {
  render(): HTMLElement;
}

export type BlockType =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills";

export class BlockFactory {
  createBlock(type: BlockType, m: ResumeModel): IBlock {
    switch (type) {
      case "header":
        return new HeaderBlock(m.header);
      case "summary":
        return new SummaryBlock(m.summary);
      case "experience":
        return new ExperienceBlock(m.experience);
      case "education":
        return new EducationBlock(m.education);
      case "skills":
        return new SkillsBlock(m.skills);
      default:
        throw new Error(`Unknown block type: ${type}`);
    }
  }
}
