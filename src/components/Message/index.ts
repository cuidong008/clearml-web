import { App } from "antd"
import type { MessageInstance } from "antd/es/message/interface"
import type { NotificationInstance } from "antd/es/notification/interface"

let message: MessageInstance
let notification: NotificationInstance

export default () => {
  const staticFunction = App.useApp()
  message = staticFunction.message
  notification = staticFunction.notification
  return null
}

export { message, notification }
