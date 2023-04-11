import { Task } from "@/types/task"
import { Checkbox, Modal } from "antd"
import { useState } from "react"

export const WarnArchiveDialog = (props: {
  show: boolean
  task?: Task
  onClose: (e: boolean, neverShowPopup?: boolean) => void
}) => {
  const { show, task, onClose } = props
  const [neverShowPopup, setNeverShowPopup] = useState(false)

  return (
    <Modal
      getContainer={() => document.body}
      width={650}
      open={show}
      onOk={() => onClose(true, neverShowPopup)}
      onCancel={() => onClose(false)}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i className="al-ico-archive" style={{ fontSize: 60, height: 60 }} />
        </div>
        <span className="commonDialogTitle">
          ARCHIVE A PUBLICLY SHARED TASK
        </span>
        <p className="subDialogHeader" style={{ textAlign: "left" }}>
          This task is accessible through a public access link. Archiving will
          disable public access
        </p>
      </div>
      <Checkbox
        checked={neverShowPopup}
        onChange={(e) => setNeverShowPopup(e.target.checked)}
        style={{ margin: "0 10px" }}
      />
      Don&apos;t show this message again
    </Modal>
  )
}
