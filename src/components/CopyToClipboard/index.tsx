import { CopyFilled } from "@ant-design/icons"
import { Button, message } from "antd"
import copy from "copy-to-clipboard"
import { useRef } from "react"

export const CopyToClipboard = (props: {
  children: JSX.Element
  className?: string
}) => {
  const { children, className } = props
  const ref = useRef<HTMLDivElement>(null)
  const [msg, msgContext] = message.useMessage()

  function handleCopy() {
    if (ref.current) {
      copy(ref.current.children?.[0].textContent ?? "")
      msg.success("code has been copied!")
    }
  }

  return (
    <>
      {msgContext}
      <div ref={ref}>{children}</div>
      <Button
        type="text"
        className={className}
        icon={<CopyFilled />}
        onClick={() => handleCopy()}
      />
    </>
  )
}
