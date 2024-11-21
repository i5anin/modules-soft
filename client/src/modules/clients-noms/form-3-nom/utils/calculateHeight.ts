export function calculateHeight(text: string): number {
  const lineHeight = 21
  const padding = 10
  const lineCount = Math.ceil(text.length / 25)
  return lineCount * lineHeight + padding
}
