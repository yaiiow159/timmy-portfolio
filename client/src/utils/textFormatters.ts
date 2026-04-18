
// 先將不可信字元跳脫再補回必要格式，避免內容區渲染時成為注入入口
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatDescription(text: string, maxLength?: number): string {
  if (!text) return '';

  let processedText = text;

  if (maxLength && processedText.length > maxLength) {
    const truncated = processedText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const endPos = lastSpace > 0 ? lastSpace : maxLength;
    processedText = processedText.substring(0, endPos) + '...';
  }

  const safeText = escapeHtml(processedText);
  const withParagraphs = safeText.replace(/\n\s*\n/g, '||PARAGRAPH||');
  const withLineBreaks = withParagraphs.replace(/\n/g, '<br>');

  return withLineBreaks.replace(/\|\|PARAGRAPH\|\|/g, '</p><p class="mt-4">');
}
