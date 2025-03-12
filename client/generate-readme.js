import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Получаем текущий путь модуля
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Функция для получения эмодзи по расширению файла
function getFileEmoji(fileName) {
  const ext = path.extname(fileName).toLowerCase()
  const icons = {
    '.vue': '📗',
    '.js': '📜',
    '.ts': '📜',
    '.css': '🎨',
    '.scss': '🎨',
    '.sass': '🎨',
    '.less': '🎨',
    '.html': '📄',
    '.md': '📄',
    '.json': '⚙',
    '.yaml': '⚙',
    '.yml': '⚙',
    '.env': '🔧',
    '.config.js': '🔧',
    '.gitignore': '🗂',
    '.editorconfig': '🗂',
  }
  return icons[ext] || '📃' // По умолчанию 📃 для остальных файлов
}

// Функция для сканирования структуры папок
function getDirectoryStructure(dir, depth = 0) {
  if (!fs.existsSync(dir)) return ''
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  return entries
    .map(entry => {
      const prefix = ' '.repeat(depth * 2) + '┣ '
      const filePath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        return `${prefix}📂 ${entry.name}/\n${getDirectoryStructure(filePath, depth + 1)}`
      } else {
        return `${prefix}${getFileEmoji(entry.name)} ${entry.name}`
      }
    })
    .join('\n')
}

// Получаем структуру `src/`
const projectRoot = path.resolve(__dirname, 'src')
const directoryStructure = fs.existsSync(projectRoot)
  ? `\`\`\`\n📦 src/\n${getDirectoryStructure(projectRoot)}\n\`\`\``
  : '🚨 Папка `src/` не найдена!'

// Содержимое README.md
const readmeContent = `# Vue.js Проект [![wakatime](https://wakatime.com/badge/user/a12eb6bb-966a-41dc-b67d-4ae0f101af55/project/f69366dd-9709-493c-bdd0-1681f774dd3b.svg)](https://wakatime.com/badge/user/a12eb6bb-966a-41dc-b67d-4ae0f101af55/project/f69366dd-9709-493c-bdd0-1681f774dd3b)

Модульный проект на Vue.js для управления клиентами, заказами и их данными. Проект предоставляет динамическую таблицу с
возможностью сортировки, поиска, и фильтрации, а также поддержку добавочных и международных телефонных номеров.

### 📌 Основные маршруты

- **📦 Заказы**
  - [📋 Главная страница заказов](http://localhost:5173/orders)
  - [📄 Детали заказа](http://localhost:5173/orders/9814)
  - [📌 Конкретный элемент в заказе](http://localhost:5173/orders/9814/53537)

- **👥 Клиенты и 📜 Номенклатуры**
  - [📋 Список клиентов](http://localhost:5173/clients)
  - [📄 Номенклатура для клиента](http://localhost:5173/noms/418)

---

## 🛠 Описание проекта

Проект предназначен для управления данными клиентов и заказов через удобный интерфейс. Приложение поддерживает
пагинацию, сортировку, и фильтрацию данных, а также позволяет легко добавлять и управлять контентом через единый
модульный интерфейс.

---

## ⚙️ Установка и настройка

1. **Клонирование репозитория:**
   \`\`\`bash
   git clone https://github.com/ваше_имя_пользователя/имя_проекта.git
   cd имя_проекта
   \`\`\`

---

## 📂 Структура проекта

${directoryStructure}
`

// Создаем README.md
fs.writeFileSync('README.md', readmeContent, 'utf8')
console.log('✅ README.md создан на основе реальной структуры `src/`!')
