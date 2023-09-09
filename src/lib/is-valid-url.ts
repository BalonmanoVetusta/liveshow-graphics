export const isValidUrl = (url?: string) => {
  if (!url) return false;
  try {
    // eslint-disable-next-line compat/compat
    new URL(url!);
    return true;
  } catch (_) {
    return false;
  }
};
