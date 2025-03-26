import fs from "fs";
import path from "path";
import {
  IGNORED_FOLDERS,
  IGNORED_EXTENSIONS,
  FILE_ICONS,
  FOLDER_DESCRIPTIONS,
  FILE_DESCRIPTIONS
} from "./config.js";

/**
 * Возвращает эмодзи по расширению файла
 * @param {string} fileName
 * @returns {string}
 */
function getFileEmoji(fileName) {
  return FILE_ICONS[path.extname(fileName).toLowerCase()] || "📃";
}

/**
 * Подсчитывает количество строк в файле
 * @param {string} filePath
 * @returns {number}
 */
function countFileLines(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8").split("\n").length;
  } catch {
    return 0;
  }
}

/**
 * Возвращает описание файла или папки
 * @param {string} name
 * @param {string} filePath
 * @param {boolean} [isDir=false]
 * @returns {string}
 */
function getDescription(name, filePath, isDir = false) {
  if (isDir) {
    return FOLDER_DESCRIPTIONS[name] ? `⭐ ${FOLDER_DESCRIPTIONS[name]}` : "";
  }

  if (name === "index.js") {
    const parentFolder = path.basename(path.dirname(filePath));
    return `Точка входа модуля "${parentFolder}"`;
  }

  return FILE_DESCRIPTIONS[name] || "";
}

/**
 * Рекурсивно сканирует директорию и возвращает дерево файлов
 * @param {string} dir
 * @param {string} baseDir
 * @param {number} depth
 * @param {object} stats
 * @param {string} prefix
 * @returns {string}
 */
export function scanDirectory(dir, baseDir, depth = 1, stats, prefix = "") {
  if (!fs.existsSync(dir)) return "";

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => {
      if (IGNORED_FOLDERS.has(entry.name)) return false;
      if (!entry.isDirectory() && IGNORED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  if (entries.length === 0) return "";

  return entries
    .map((entry, index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      const filePath = path.join(dir, entry.name);
      const fileName = entry.name;

      if (entry.isDirectory()) {
        const description = getDescription(fileName, filePath, true);
        const subTree = scanDirectory(filePath, baseDir, depth + 1, stats, newPrefix);
        const entryLine = `${prefix}${connector}📂 ${fileName}${description ? ` — ${description}` : ""}`;

        // 📌 Отступ после директорий первого уровня
        const spacing = depth === 1 ? `\n│` : "";
        return `${entryLine}${spacing}${subTree ? `\n${subTree}` : ""}`;
      } else {
        const ext = path.extname(fileName).toLowerCase();
        stats.fileCount[ext] = (stats.fileCount[ext] || 0) + 1;
        const lines = countFileLines(filePath);
        stats.fileLines[ext] = (stats.fileLines[ext] || 0) + lines;
        stats.totalLines += lines;
        stats.fileLineCounts.push({ file: fileName, lines });

        const description = getDescription(fileName, filePath);
        return `${prefix}${connector}${getFileEmoji(fileName)} ${fileName} (${lines} строк)${description ? ` — ${description}` : ""}`;
      }
    })
    .filter(Boolean)
    .join("\n");
}
