const fs = require('fs')
const path = require('path')

// 📌 Функция для чтения пути из `dir.txt`
function getDirectoryPath(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8').trim()
  } catch (error) {
    console.error(`Ошибка чтения файла ${filePath}:`, error.message)
    process.exit(1)
  }
}

// 📌 Функция рекурсивного обхода файлов в директории
function getAllFiles(dirPath) {
  let filesList = []

  function traverseDirectory(currentPath) {
    const files = fs.readdirSync(currentPath)
    for (const file of files) {
      const fullPath = path.join(currentPath, file)
      const stats = fs.statSync(fullPath)

      if (stats.isDirectory()) {
        traverseDirectory(fullPath)
      } else if (stats.isFile()) {
        filesList.push(fullPath)
      }
    }
  }

  traverseDirectory(dirPath)
  return filesList
}

// 📌 Функция подсчёта строк в файле
function countFileLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return content.split(/\r?\n/).length
  } catch (error) {
    console.error(`Ошибка чтения файла ${filePath}:`, error.message)
    return 0
  }
}

// 📌 Основная логика
const directoryFilePath = 'dir.txt' // 📌 Файл с путём к директории
const directoryPath = getDirectoryPath(directoryFilePath)
const allFiles = getAllFiles(directoryPath)

// Подсчёт строк во всех файлах
const fileLineCounts = allFiles.map(file => ({
  path: file,
  lines: countFileLines(file),
}))

// 📌 Сортируем по убыванию строк и выводим топ-10 самых длинных файлов
const topFiles = fileLineCounts.sort((a, b) => b.lines - a.lines).slice(0, 10)

console.log('\n📌 Топ-10 самых длинных файлов:')
topFiles.forEach((file, index) => {
  console.log(`${index + 1}. ${file.path} - ${file.lines} строк`)
})
