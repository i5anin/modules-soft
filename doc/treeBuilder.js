import fs from "fs";
import path from "path";
import {
    IGNORED_FOLDERS,
    IGNORED_EXTENSIONS,
    FILE_ICONS,
    FOLDER_DESCRIPTIONS,
    FILE_DESCRIPTIONS
} from "./config.js";

// 📌 Функция получения эмодзи по расширению файла
function getFileEmoji(fileName) {
    return FILE_ICONS[path.extname(fileName).toLowerCase()] || "📃";
}

// 📌 Функция подсчета строк в файле
function countFileLines(filePath) {
    try {
        return fs.readFileSync(filePath, "utf-8").split("\n").length;
    } catch {
        return 0;
    }
}

// 📌 Функция получения описания папки или файла
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

// 📌 Функция рекурсивного обхода директорий
export function scanDirectory(dir, baseDir, depth = 1, stats, prefix = "") {
    if (!fs.existsSync(dir)) return "";

    const entries = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) => {
            if (IGNORED_FOLDERS.has(entry.name)) return false; // Игнорируем папки
            if (!entry.isDirectory() && IGNORED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) return false; // Игнорируем файлы
            return true;
        })
        .sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) return -1;
            if (!a.isDirectory() && b.isDirectory()) return 1;
            return a.name.localeCompare(b.name);
        });

    if (entries.length === 0) return ""; // 📌 Фикс: Если папка пустая, не добавляем лишний `\n`

    return entries
        .map((entry, index) => {
            const isLast = index === entries.length - 1;
            const newPrefix = depth > 1 ? prefix + (isLast ? "  " : "┃ ") : "";
            const linePrefix = depth > 1 ? prefix + (isLast ? "┗ " : "┣ ") : "";
            const filePath = path.join(dir, entry.name);
            const fileName = entry.name;

            if (entry.isDirectory()) {
                const description = getDescription(fileName, filePath, true);
                const subTree = scanDirectory(filePath, baseDir, depth + 1, stats, newPrefix);
                return `${linePrefix}📂 ${fileName}${description ? ` — ${description}` : ""}${subTree ? `\n${subTree}` : ""}`;
            } else {
                const ext = path.extname(fileName).toLowerCase();
                stats.fileCount[ext] = (stats.fileCount[ext] || 0) + 1;
                const lines = countFileLines(filePath);
                stats.fileLines[ext] = (stats.fileLines[ext] || 0) + lines;
                stats.totalLines += lines;
                stats.fileLineCounts.push({ file: fileName, lines });

                const description = getDescription(fileName, filePath);
                return `${linePrefix}${getFileEmoji(fileName)} ${fileName} (${lines} строк)${description ? ` — ${description}` : ""}`;
            }
        })
        .filter(Boolean) // 📌 Фикс: Удаляем пустые строки в `.map()`
        .join("\n");
}
