import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Root } from "./paths.js";
import { scanDirectory } from "./treeBuilder.js";
import { generateFileStats, getTopFiles } from "./fileStats.js";

// 📌 Определяем корень Git-проекта
function getGitRoot() {
  try {
    return execSync("git rev-parse --show-toplevel").toString().trim(); // Получаем корневую папку Git
  } catch (error) {
    console.error("🚨 Ошибка: Не удалось определить корень Git-проекта. Используется текущая директория.");
    return process.cwd(); // Если Git не найден, используем текущую директорию
  }
}

const gitRoot = getGitRoot();

// 📌 Функция для получения относительного пути (без абсолютного пути к проекту)
function getRelativePath(absolutePath) {
  return path.relative(gitRoot, absolutePath).replace(/\\/g, "/"); // Заменяем `\` на `/`
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
const readmeContent = `# 📌 Система выдачи инструмента на производстве  

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
`;

// 📌 Запись в файл (в корень Git-проекта)
const readmePath = path.join(gitRoot, "README.md");
fs.writeFileSync(readmePath, readmeContent, "utf8");

console.log(`✅ README.md обновлен! (${readmePath})`);
console.log(`📊 Всего файлов: ${totalFiles}`);
console.log(`📜 Всего строк кода: ${totalLines}`);
