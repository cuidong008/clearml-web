import { Modal } from "antd"
import styles from "./dialog.module.scss"
import { ErrorMsg } from "@/types/common"

export const OperationFailedDialog = (props: {
  show: boolean
  onClose: (e: boolean, neverShowPopup?: boolean) => void
  failed: ErrorMsg[]
}) => {
  const { show, failed, onClose } = props

  return (
    <Modal
      getContainer={() => document.body}
      width={650}
      open={show}
      okButtonProps={{ style: { display: "none" } }}
      onCancel={() => onClose(false)}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }} className={styles.errorDialog}>
        <div>
          <i className="al-ico-error-circle al-icon icon mx-auto xxl" />
        </div>
        <span className="commonDialogTitle">EXPERIMENT OPERATION FAILED</span>
        {failed.length > 0 && (
          <div className={styles.errorsTitle}>
            The following {failed.length == 1 ? "" : 1} experiment{" "}
            {failed.length > 1 ? "s" : ""} failed to {failed[0].action}:
          </div>
        )}
        <ul className={styles.listContainer}>
          {failed.map((f) => (
            <li key={f.id}>
              <div>{f.name}</div>
              <div className={styles.errorReason}>{f.message} </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  )
}
