import classNames from "classnames"
import { Button, Input, Modal, Space } from "antd"
import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import styles from "./index.module.scss"
import { SearchOutlined } from "@ant-design/icons"
import copy from "copy-to-clipboard"
import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/theme-dracula"
import "ace-builds/src-noconflict/ext-language_tools"

export const EditableTextView = (props: {
  label?: ReactNode
  customBtn?: ReactNode
  editable: boolean
  text?: string
  emptyText?: ReactNode
  onEdit?: (e: boolean) => void
  onSave?: (e?: string) => void
  style?: CSSProperties
}) => {
  const { editable, label, style, onEdit, onSave, text, emptyText, customBtn } =
    props

  const [edit, setEdit] = useState(false)
  const [lines, setLines] = useState<string[]>([])
  const [search, setSearch] = useState<string>()
  const [showSearch, setShowSearch] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const [copied, setCopied] = useState(false)
  const [index, setIndex] = useState(0)
  const [indexes, setIndexes] = useState<number[]>([])
  const [newText, setNewText] = useState<string>()

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLines(() =>
      text
        ? text
            .split("\n")
            .map((line) =>
              line.length > 800 ? line.substring(0, 800) + "..." : line,
            )
        : [],
    )
    setNewText(() => text)
  }, [text])

  function startEdit() {
    setEdit(true)
    onEdit?.(true)
  }

  function stopEdit() {
    setEdit(false)
    onEdit?.(false)
  }

  function confirmEdit() {
    onSave?.(newText)
    stopEdit()
  }

  function split(line: string, search: string) {
    const regex = new RegExp(search, "gi")
    const match = line.match(regex)
    return line.split(regex).map((part, i) => [part, match?.[i]])
  }

  function onSearch(value?: string) {
    setSearch(value)
    if (value && value !== search) {
      resetSearch()
      const res = lines.filter((line) =>
        line.toLowerCase().includes(value.toLowerCase()),
      )
      setIndexes(() =>
        res.map((searched) => lines.findIndex((s) => s === searched)),
      )
    } else {
      resetSearch()
    }
  }

  function resetSearch() {
    setIndexes([])
    setIndex(0)
  }

  function upClick() {
    setIndex(index - 1)
    if (ref.current) {
      ref.current.scrollTop = indexes[index - 1] * 22
    }
  }

  function downClick() {
    setIndex(index + 1)
    if (ref.current) {
      ref.current.scrollTop = indexes[index + 1] * 22
    }
  }

  return (
    <div
      onMouseEnter={() => setShowBtn(true)}
      onMouseLeave={() => {
        setShowBtn(false)
        resetSearch()
        setSearch("")
        setCopied(false)
        setShowSearch(false)
      }}
      style={style}
      className={classNames("editPanel", styles.editableTextView)}
      onDoubleClick={() => editable && startEdit()}
    >
      <Modal
        title={
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: 100 }}>
            EDIT{" "}
            {typeof label === "string"
              ? label
              : (label as ReactElement)?.props?.children}
          </div>
        }
        destroyOnClose
        width={"80vw"}
        open={edit}
        onCancel={() => stopEdit()}
        onOk={() => confirmEdit()}
      >
        <div style={{ padding: 20, background: "#282a36" }}>
          <AceEditor
            style={{ width: "100%" }}
            mode="python"
            theme="dracula"
            value={newText}
            onChange={(e) => setNewText(e)}
          />
        </div>
      </Modal>
      <Button
        style={{ display: showBtn && !text ? "block" : "none" }}
        className={classNames(styles.editBtn, "primaryBtn")}
        onClick={() => startEdit()}
      >
        EDIT
      </Button>
      <Space
        style={{ display: showBtn && text ? "flex" : "none" }}
        className={styles.btnBar}
      >
        <div
          onMouseLeave={() => {
            if (!search) {
              setShowSearch(false)
              resetSearch()
            }
          }}
        >
          {showSearch ? (
            <div className={styles.searchTool}>
              <Input
                placeholder="Type to search"
                allowClear
                bordered={false}
                addonAfter={<SearchOutlined />}
                value={search}
                onChange={(e) => onSearch(e.target.value)}
              />
              {indexes.length > 0 && (
                <div className={styles.count}>
                  {`${index + 1} of ${indexes.length}`}
                </div>
              )}
              <div
                className={classNames(styles.upDown, {
                  [styles.disabled]: !indexes.length || index === 0,
                })}
              >
                <i
                  className="icon-button al-icon al-ico-ico-chevron-up sm-xd"
                  onClick={upClick}
                />
              </div>
              <div
                className={classNames(styles.upDown, {
                  [styles.disabled]:
                    !indexes.length || index === indexes.length - 1,
                })}
              >
                <i
                  className="icon-button al-icon al-ico-ico-chevron-down sm-xd"
                  onClick={downClick}
                />
              </div>
            </div>
          ) : (
            <Button
              onMouseEnter={() => setShowSearch(true)}
              className={classNames(styles.panelBtn)}
              icon={<SearchOutlined />}
            />
          )}
        </div>
        <Button
          className={classNames(styles.panelBtn)}
          onClick={() => {
            text && copy(text) && setCopied(true)
          }}
          icon={
            <i
              className={`al-icon sm-md ${
                copied ? "al-ico-success" : "al-ico-copy-to-clipboard"
              }`}
            />
          }
        />
        {editable && (
          <>
            {customBtn}
            <Button
              className={classNames(styles.panelBtn)}
              onClick={() => startEdit()}
            >
              EDIT
            </Button>
          </>
        )}
      </Space>
      {typeof label === "string" ? <h4>{label}</h4> : label}
      {text ? (
        <div className={styles.textScrollView} ref={ref}>
          {lines.map((line, k) => (
            <div key={k} className={styles.line}>
              {(search ? split(line, search) : [[line, search]]).map(
                (part, i) => (
                  <span key={i}>
                    {part[0]}
                    {part[1] && (
                      <span
                        className={classNames(styles.found, {
                          [styles.current]: indexes[index] === k,
                        })}
                      >
                        {part[1]}
                      </span>
                    )}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyText}>{emptyText ?? "No data to show"}</div>
      )}
    </div>
  )
}
