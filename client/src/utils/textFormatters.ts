/**
 * 格式化描述文本，處理段落和換行，並可選擇限制字數
 * @param text 要格式化的文本
 * @param maxLength 可選的最大字數限制
 * @returns 格式化後的 HTML 文本
 */
export function formatDescription(text: string, maxLength?: number): string {
  if (!text) return '';
  
  // 首先轉義不安全的 HTML 標籤，但保留基本格式標籤
  // 這個正則表達式會匹配所有不是 <br>, <p>, </p>, <strong>, </strong>, <em>, </em> 的標籤
  let processedText = text.replace(/<(?!br|\/br|p|\/p|strong|\/strong|em|\/em)([^>]*)>/g, '&lt;$1&gt;');
  
  // 如果指定了最大長度，則進行截斷
  if (maxLength && processedText.length > maxLength) {
    // 找到最後一個完整的單詞結束位置
    const truncated = processedText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const endPos = lastSpace > 0 ? lastSpace : maxLength;
    
    // 截斷文本並添加省略號
    processedText = processedText.substring(0, endPos) + '...';
  }
  
  // 首先將連續的換行符（表示段落分隔）替換為特殊標記
  const withParagraphs = processedText.replace(/\n\s*\n/g, '||PARAGRAPH||');
  
  // 然後將單個換行符替換為 <br>
  const withLineBreaks = withParagraphs.replace(/\n/g, '<br>');
  
  // 最後將段落標記替換為實際的 HTML 段落標籤
  return withLineBreaks.replace(/\|\|PARAGRAPH\|\|/g, '</p><p class="mt-4">');
}
