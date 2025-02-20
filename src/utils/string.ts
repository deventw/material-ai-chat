export function mergeContent(existingContent: string | undefined, newContent: string | undefined): string {
    return (existingContent || '') + (newContent || '');
  }