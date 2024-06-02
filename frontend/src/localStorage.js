export const setLocalStorage = (key, value) => {
  const time = value ? Date.now() + 24 * 60 * 60 * 1000 : 0;
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
  if (!storedItem.value) {
    return null;
  }
  const time = Date.now();
  if (storedItem.expiresIn < time) {
    setLocalStorage("isLoggedIn", false);
    return null;
  }
  return storedItem.value;
};
