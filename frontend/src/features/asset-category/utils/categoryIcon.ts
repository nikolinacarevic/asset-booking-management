export const CATEGORY_ICON_DEFAULT_SRC = '/category-icons/default.png';

function trimEdgeHyphens(value: string): string {
  let start = 0;
  let end = value.length;
  while (start < end && value[start] === '-') start++;
  while (end > start && value[end - 1] === '-') end--;
  return start === 0 && end === value.length ? value : value.slice(start, end);
}

export function categoryNameToIconSlug(name: string): string {
  if (name.length > 200) throw new Error('Input too long');
  const slug = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    // strip diacritics (č ć ž š đ …) -> (c c z s d …)
    .replaceAll(/\p{Diacritic}/gu, '')
    .replaceAll('&', ' and ')
    .replaceAll(/[^a-z0-9]+/g, '-');
  return trimEdgeHyphens(slug);
}

export function getCategoryIconSrc(name: string): string {
  const slug = categoryNameToIconSlug(name);
  // public/ is served at /
  return slug ? `/category-icons/${slug}.png` : CATEGORY_ICON_DEFAULT_SRC;
}
