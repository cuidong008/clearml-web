import classNames from "classnames"
import styles from "./index.module.scss"
import { Button } from "antd"
import { useDetailCtx } from "../../details/DetailContext"
import { ReactNode, useState } from "react"

export const EditableSection = (props: {
  children: JSX.Element
  label?: ReactNode
  editable: boolean
  onEdit?: (e: boolean) => void
  onSave?: () => Promise<boolean>
}) => {
  const ctx = useDetailCtx()
  const { children, editable, label, onEdit, onSave } = props
  const [edit, setEdit] = useState(false)

  function startEdit() {
    setEdit(true)
    ctx.setEditing(true)
    onEdit?.(true)
  }

  function stopEdit() {
    setEdit(false)
    ctx.setEditing(false)
    onEdit?.(false)
  }

  return (
    <div
      className={classNames("editPanel", styles.editableSection, {
        [styles.editMode]: edit,
        [styles.editable]: editable,
      })}
      onDoubleClick={() => editable && startEdit()}
    >
      {editable && !edit && (
        <Button
          className={classNames(styles.editBtn, "primaryBtn")}
          onClick={() => startEdit()}
        >
          EDIT
        </Button>
      )}
      {label}
      {children}
      {editable && edit && (
        <div className={styles.formBtn}>
          <Button onClick={() => stopEdit()}>CANCEL</Button>
          <Button
            className="primaryBtn"
            onClick={() => {
              onSave?.().then(() => stopEdit())
            }}
          >
            SAVE
          </Button>
        </div>
      )}
    </div>
  )
}
