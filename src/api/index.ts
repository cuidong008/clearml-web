import { AxiosCanceler } from "@/api/requestManage"

import { message } from "antd"
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios"

const axiosCanceler = new AxiosCanceler()

const config = {
  // 默认地址请求地址，可在 .env 开头文件中修改
  // @ts-ignore
  baseURL: "/api",
  // 设置超时时间（10s）
  timeout: 50000,
  // 跨域时候允许携带凭证
  withCredentials: true,
}

declare interface Result<T = any> {
  data: T
  meta: {
    id: string
    trx: string
    endpoint: {
      name: string
      requested_version: string
      actual_version: string
    }
    result_code: number
    result_subcode: number
    result_msg: string
    error_stack: string
    error_data: any
  }
}

class RequestHttp {
  service: AxiosInstance

  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config)

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到redux/本地储存当中
     */
    this.service.interceptors.request.use(
      (config) => {
        // * 将当前请求添加到 pending 中
        axiosCanceler.addPending(config)
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response
        // * 在请求结束后，移除本次请求(关闭loading)
        axiosCanceler.removePending(config)

        // * 登录失效（code == 599）
        if (data.status == 403 || data.status == 401) {
          message.error(data.message).then()
          localStorage.removeItem("authTk")
          window.location.href = "/login"
          return Promise.reject(data)
        }
        // * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.status && data.status !== 200) {
          message.error(data.message).then()
          return Promise.reject(data)
        }
        // * 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data
      },
      async (error: AxiosError) => {
        if (error.code == "ERR_CANCELED") {
          return new Promise(() => {})
        }
        const { response } = error
        // 请求超时单独判断，请求超时没有 response
        if (error.message.indexOf("timeout") !== -1)
          message.error("请求超时，请稍后再试")
        // 根据响应的错误状态码，做不同的处理
        if (response) {
          checkStatus(response.status)
          if (response.status == 403 || response.status == 401) {
            localStorage.removeItem("authTk")
            window.location.href = "/login"
            return new Promise(() => {})
          }
        }
        // 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) window.location.href = "/500"
        return Promise.reject(
          error.response?.data ? error.response?.data : error.message,
        )
      },
    )
  }

  // * 常用请求方法封装
  get<T = any, D = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig<D>,
  ): Promise<Result<T>> {
    return this.service.get(url, { params, ...config })
  }

  post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<Result<T>> {
    return this.service.post(url, data, config)
  }

  put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<Result<T>> {
    return this.service.put(url, data, config)
  }

  delete<T = any, D = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig<D>,
  ): Promise<Result<T>> {
    return this.service.delete(url, { params, ...config })
  }
}

const checkStatus = (status: number): void => {
  switch (status) {
    case 400:
      message.error("请求失败！请您检查请求参数")
      break
    case 401:
      message.error("登录失效！请您重新登录")
      break
    case 403:
      message.error("当前账号无权限访问！")
      break
    case 404:
      message.error("你所访问的资源不存在！")
      break
    case 405:
      message.error("请求方式错误！请您稍后重试")
      break
    case 408:
      message.error("请求超时！请您稍后重试")
      break
    case 500:
      message.error("服务异常！")
      break
    case 502:
      message.error("网关错误！")
      break
    case 503:
      message.error("服务不可用！")
      break
    case 504:
      message.error("网关超时！")
      break
    default:
      message.error("请求失败！")
  }
}

export default new RequestHttp(config)
