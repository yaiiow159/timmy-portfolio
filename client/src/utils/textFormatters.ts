
export function formatDescription(text: string, maxLength?: number): string {
  if (!text) return '';
  
  let processedText = text;
  if (maxLength && text.length > maxLength) {
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const endPos = lastSpace > 0 ? lastSpace : maxLength;
    
    processedText = text.substring(0, endPos) + '...';
  }
  
  const withParagraphs = processedText.replace(/\n\s*\n/g, '||PARAGRAPH||');
  
  const withLineBreaks = withParagraphs.replace(/\n/g, '<br>');
  
  return withLineBreaks.replace(/\|\|PARAGRAPH\|\|/g, '</p><p class="mt-4">');
}
