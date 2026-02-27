const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export function setWithExpiry(key: string, value: unknown): void {
  const item = {
    value,
    expiry: Date.now() + ONE_WEEK,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key: string): unknown {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

export function removeWithExpiry(key: string): void {
  localStorage.removeItem(key);
}