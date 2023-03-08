/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
  const browserLang = navigator.language
    ? navigator.language
    : navigator.browserLanguage;
  let defaultBrowserLang: string;
  if (
    browserLang.toLowerCase() === "cn" ||
    browserLang.toLowerCase() === "zh" ||
    browserLang.toLowerCase() === "zh-cn"
  ) {
    defaultBrowserLang = "zh";
  } else {
    defaultBrowserLang = "en";
  }
  return defaultBrowserLang;
};

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, "Function");
}
