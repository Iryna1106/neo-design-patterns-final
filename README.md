# neo-design-patterns-final — Генератор резюме з JSON

Фінальний проєкт: самодостатня HTML-сторінка-резюме, яка будується з єдиного джерела
даних — `resume.json`. Без сторонніх UI-бібліотек: лише TypeScript + Vite + фіксовані стилі
у `src/styles.css`. Проєкти з прапорцем `"isRecent": true` підсвічуються червоним.

Застосунок демонструє **п'ять патернів проєктування**: Facade, Template Method,
Factory Method, Composite, Decorator.

## Як реалізовано патерни

### 1. Facade — `src/facade/ResumePage.ts`
Єдина спрощена точка входу. Метод `init(jsonPath)` приховує всю складність:
завантаження JSON (`fetchData`), валідацію, мапінг і рендеринг. Зовнішній код (`main.ts`)
викликає лише `new ResumePage().init("/resume.json")`.

### 2. Template Method — `src/importer/AbstractImporter.ts` → `ResumeImporter.ts`
`AbstractImporter` визначає незмінний скелет алгоритму `import()`:
`validate() → map() → render()`. Конкретні кроки реалізує підклас `ResumeImporter`:
- `validate()` — перевіряє наявність обов'язкових блоків (`header`, `summary`, `experience`, `education`, `skills`);
- `map()` — трансформує «сирий» JSON у типи `ResumeModel`;
- `render()` — створює `BlockFactory`, генерує блоки і додає їх у `#resume-content`.

### 3. Factory Method — `src/blocks/BlockFactory.ts`
`createBlock(type, model)` інкапсулює створення блоків і повертає об'єкт, що реалізує
інтерфейс `IBlock { render(): HTMLElement }`, залежно від типу
(`header`, `summary`, `experience`, `education`, `skills`).

### 4. Composite — `src/blocks/ExperienceBlock.ts` → `ProjectBlock.ts`
`ExperienceBlock` — контейнер: для кожного запису досвіду рекурсивно рендерить дочірні
`ProjectBlock`-и (листові вузли). Завдяки спільному інтерфейсу `IBlock` контейнер і лист
обробляються однаково.

### 5. Decorator — `src/decorators/HighlightDecorator.ts`
Обгортає будь-який `IBlock` і динамічно додає клас `.highlight` до відрендереного елемента,
**не змінюючи** внутрішньої логіки блоку. Застосовується до проєктів з `isRecent: true`.

## Структура проєкту

```
/
├── index.html              # Макет (стилі бандлить Vite через import у main.ts)
├── resume.json             # Джерело даних
├── vite.config.js
├── tsconfig.json
└── src/
    ├── styles.css          # Базові стилі + .highlight
    ├── main.ts             # Точка входу
    ├── facade/ResumePage.ts
    ├── importer/           # AbstractImporter (Template Method) + ResumeImporter
    ├── blocks/             # BlockFactory + 6 блоків (Factory + Composite)
    ├── decorators/HighlightDecorator.ts
    └── models/ResumeModel.ts
```

## Встановлення та запуск

```bash
npm install
npm run dev      # режим розробки (http://localhost:3000)
```

Додаткові команди:

```bash
npm run build     # продакшн-збірка у dist/
npm run preview   # перегляд зібраної версії
npm run typecheck # перевірка типів (tsc --noEmit)
```

> **Дані у dev vs build.** У режимі `npm run dev` Vite автоматично віддає `resume.json` із
> кореня проєкту, тож сторінка працює одразу (основний сценарій запуску за завданням).
> Для перегляду **продакшн-збірки** (`npm run preview`) покладіть `resume.json` у директорію
> `public/` — Vite копіює вміст `public/` у `dist/`, і `fetch("/resume.json")` працюватиме й там.

> Директорію `node_modules/` додано до `.gitignore` — залежності не потрапляють у репозиторій.

Після `npm run dev` сторінка показує: заголовок з контактами, Summary, Досвід роботи
(нещодавні проєкти — червоним), Освіту та Навички. Усе генерується з `resume.json`.

## Як додати новий блок резюме (приклад: «Certificates»)

Архітектура розширюється **без зміни наявних блоків** — потрібні лише новий клас-блок і
**одна гілка** у фабриці. Наприклад, щоб додати секцію сертифікатів:

1. **Модель** — у `src/models/ResumeModel.ts` додайте тип і поле:
   ```ts
   export interface Certificate { name: string; issuer: string; year: string; }
   // у ResumeModel:  certificates: Certificate[];
   ```
2. **Клас-блок** — створіть `src/blocks/CertificatesBlock.ts`, що реалізує `IBlock`:
   ```ts
   export class CertificatesBlock implements IBlock {
     constructor(private d: Certificate[]) {}
     render(): HTMLElement { /* <section> зі списком сертифікатів */ }
   }
   ```
3. **Одна гілка у фабриці** — додайте `"certificates"` до типу `BlockType` і новий `case`
   у `BlockFactory.createBlock()`:
   ```ts
   case "certificates":
     return new CertificatesBlock(m.certificates);
   ```
4. **Порядок рендеру** — додайте `"certificates"` у масив `order` у `ResumeImporter.render()`
   (і, за потреби, у `REQUIRED_BLOCKS` для валідації).

Решта системи — `ResumePage` (Facade), `ResumeImporter` (Template Method), декоратори —
працює з новим блоком без змін завдяки спільному інтерфейсу `IBlock`. Якщо блок має дочірні
елементи — застосуйте підхід `ExperienceBlock` (Composite); для динамічного оформлення —
обгорніть його у `HighlightDecorator`.

## Технології

- TypeScript (strict)
- Vite
- Чистий DOM API + CSS (без UI-фреймворків)
