export function globalValue() {
  const level = JSON.parse(localStorage.getItem("level"));
  const olympic = JSON.parse(localStorage.getItem("olympic"));
  const system = JSON.parse(localStorage.getItem("system"));

  const globalSystemValue = {};

  globalSystemValue.level = level === null ? "" : level.value;
  globalSystemValue.olympic = olympic === null ? "" : olympic.value;
  globalSystemValue.system = system === null ? "" : system.value;

  return { globalSystemValue };
}
