import fs from 'fs'
import path from 'path'

// 📌 Читаем путь к директории из `dir.txt`
const getDirectoryPath = async filePath => {
  try {
    return (await fs.promises.readFile(filePath, 'utf-8')).trim()
  } catch (error) {
    console.error(`Ошибка чтения файла ${filePath}:`, error.message)
    process.exit(1)
  }
}

// 📌 Рекурсивное получение всех файлов (пропускаем `.js`, `.mjs`, `.cjs`)
const getAllFiles = async dirPath => {
  let filesList = []

  const traverseDirectory = async currentPath => {
    const files = await fs.promises.readdir(currentPath, {
      withFileTypes: true,
    })

    for (const file of files) {
      const fullPath = path.join(currentPath, file.name)
      if (file.isDirectory()) {
        await traverseDirectory(fullPath)
      } else if (file.isFile() && !file.name.match(/\.(js|mjs|cjs)$/)) {
        filesList.push(fullPath)
      }
    }
  }

  await traverseDirectory(dirPath)
  return filesList
}

// 📌 Подсчёт строк в файле
const countFileLines = async filePath => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8')
    return content.split(/\r?\n/).length
  } catch (error) {
    console.error(`Ошибка чтения файла ${filePath}:`, error.message)
    return 0
  }
}

// 📌 Основная логика
const directoryFilePath = 'dir.txt'

const main = async () => {
  const directoryPath = await getDirectoryPath(directoryFilePath)
  const allFiles = await getAllFiles(directoryPath)

  // Подсчёт строк во всех файлах
  const fileLineCounts = await Promise.all(
    allFiles.map(async file => ({
      path: file,
      lines: await countFileLines(file),
    }))
  )

  // 📌 Сортируем по убыванию строк и выводим топ-10 самых длинных файлов
  const topFiles = fileLineCounts.sort((a, b) => b.lines - a.lines).slice(0, 15)

  console.log('\n📌 Топ-15 самых длинных файлов (без JS):')
  topFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path} - ${file.lines} строк`)
  })
}

main()
