export const MIN_DESCRIPTION_LENGTH = 150;

export function getTrimmedDescriptionLength(description) {
  return Array.from(description.trim()).length;
}
