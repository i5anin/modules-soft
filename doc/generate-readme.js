import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Root } from "./paths.js";
import { scanDirectory } from "./treeBuilder.js";
import { generateFileStats, getTopFiles } from "./fileStats.js";
import {PROJECT_NAME, PROJECT_DESCRIPTION, WAKATIME_LINK, WAKATIME_BADGE} from "./projectConfig.js";

// 📌 Определяем корень Git-проекта
function getGitRoot() {
  try {
    return execSync("git rev-parse --show-toplevel").toString().trim();
  } catch (error) {
    console.error("🚨 Ошибка: Не удалось определить корень Git-проекта. Используется текущая директория.");
    return process.cwd();
  }
}

const gitRoot = getGitRoot();

// 📌 Функция получения относительного пути
function getRelativePath(absolutePath) {
  return path.relative(gitRoot, absolutePath).replace(/\\/g, "/");
}

// 📌 Данные статистики для всех директорий
const stats = Root.map(() => ({
  fileCount: {},
  fileLines: {},
  fileLineCounts: [],
  totalLines: 0
}));

// 📌 Генерация структуры директорий
const structures = Root.map((dir, index) => {
  const dirName = getRelativePath(dir);
  return fs.existsSync(dir)
      ? `\`\`\`\n📦 ${dirName}\n${scanDirectory(dir, dir, 1, stats[index])}\n\`\`\``
      : `🚨 Папка \`${dirName}\` не найдена!`;
});

// 📌 Итоговая статистика
const totalFiles = stats.reduce((sum, stat) => sum + Object.values(stat.fileCount).reduce((a, b) => a + b, 0), 0);
const totalLines = stats.reduce((sum, stat) => sum + stat.totalLines, 0);

// 📌 Генерация README.md
const readmeContent = `# 📌 ${PROJECT_NAME}

${PROJECT_DESCRIPTION}

---

## 📂 Структура проекта
${structures.join("\n\n")}

---

## 📊 Статистика проекта

- 📄 **Всего файлов**: ${totalFiles}
- 📜 **Всего строк кода**: ${totalLines}

${stats.map((stat, index) => {
  const dirName = getRelativePath(Root[index]);
  return `
### 📁 Количество файлов и строк (\`${dirName}\`):
${generateFileStats(stat)}

### 📊 Топ-5 длинных файлов (\`${dirName}\`):
${getTopFiles(stat)}
`;
}).join("\n")}

---

### ⏱️ Время разработки  
Следить за прогрессом: [WakaTime](${WAKATIME_BADGE})
`;

// 📌 Запись в файл README.md
const readmePath = path.join(gitRoot, "README.md");
fs.writeFileSync(readmePath, readmeContent, "utf8");

console.log(`✅ README.md обновлен! (${readmePath})`);
console.log(`📊 Всего файлов: ${totalFiles}`);
console.log(`📜 Всего строк кода: ${totalLines}`);
