export function trimWhitespace(content: string): string {
  if (!content) return "";

  return content
    .replace(/[\r\n]{3,}/g, "\n\n")
    .replace(/[\t ]+/g, " ")
    .trim();
}

export function trimLines(content: string): string {
  if (!content) return "";

  return content?.replace(/[\r\n]{3,}/g, "\n\n").replace(/[\t ]+/g, " ");
}
