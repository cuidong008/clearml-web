import { CloudProviders } from "@/types/enums"
import { isNil, isUndefined } from "lodash"

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
  const browserLang = navigator.language
    ? navigator.language
    : navigator.browserLanguage
  let defaultBrowserLang: string
  if (
    browserLang.toLowerCase() === "cn" ||
    browserLang.toLowerCase() === "zh" ||
    browserLang.toLowerCase() === "zh-cn"
  ) {
    defaultBrowserLang = "zh"
  } else {
    defaultBrowserLang = "en"
  }
  return defaultBrowserLang
}

export function hasValue(value: any): boolean {
  return !isUndefined(value) && !isNil(value)
}

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, "Function")
}

export function getUrlsPerProvider(commutativeUrls: string[]): {
  [provider in CloudProviders]: string[]
} {
  return commutativeUrls.reduce(
    (acc: { [provider in CloudProviders]: string[] }, url) => {
      const sourceType = getSourceType(url)
      url && acc[sourceType].push(url)
      return acc
    },
    { fs: [], gc: [], s3: [], azure: [], misc: [] },
  )
}

export function getSourceType(src: string): CloudProviders {
  //TODO add file serer path
  if (src?.startsWith("fileServer")) {
    return "fs"
  } else if (src?.startsWith("s3://")) {
    return "s3"
  } else if (src?.startsWith("gs://")) {
    return "gc"
  } else if (src.startsWith("azure://")) {
    return "azure"
  } else {
    return "misc"
  }
}
