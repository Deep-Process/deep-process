/**
 * Simple {{var}} template engine.
 * Replaces all {{variableName}} occurrences with values from the context object.
 */
export function renderTemplate(template: string, context: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    if (key in context) {
      return context[key];
    }
    return match; // Leave unresolved placeholders as-is
  });
}
