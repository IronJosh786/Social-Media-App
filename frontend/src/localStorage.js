export const setLocalStorage = (key, value) => {
  const time = Date.now() + 24 * 60 * 60 * 1000;
  const item = {
    value: value,
    expiresIn: time,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getLocalStorage = (key) => {
  let storedItem = localStorage.getItem(key) || "";
  if (!storedItem) {
    return null;
  }
  storedItem = JSON.parse(storedItem);
  const time = Date.now();
  if (storedItem.expiresIn < time) {
    localStorage.removeItem(key);
    return null;
  }
  return storedItem.value;
};
