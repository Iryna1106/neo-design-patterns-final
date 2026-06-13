import { ResumePage } from "./facade/ResumePage";
import "./styles.css";

/* ---- Запуск ---- */
new ResumePage().init("/resume.json").catch((err) => {
  console.error("Не вдалося згенерувати резюме:", err);
});
