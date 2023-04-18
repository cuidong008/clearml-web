import MdEditor from "react-markdown-editor-lite"
import Editor from "react-markdown-editor-lite"
import { ins_plugin } from "./markdown-ins"
import MarkdownIt from "markdown-it"
import "react-markdown-editor-lite/lib/index.css"
import "./editor.dark.scss"
import React, { CSSProperties } from "react"
import { Button, Modal, Space } from "antd"

interface MarkdownEditorProps {
  className?: string
  style?: CSSProperties
  onChange?: (e: string, callback: () => void) => void
  value?: string
  onCancel?: () => void
}

interface MarkdownEditorState {
  markdown: string
  mdParser: MarkdownIt
  showCheatSheet: boolean
  cheatSheet: string
  editMode: boolean
}

export class Markdown extends React.Component<
  MarkdownEditorProps,
  MarkdownEditorState
> {
  editorRef = React.createRef<Editor>()

  constructor(props: MarkdownEditorProps) {
    super(props)
    this.state = {
      markdown: props.value ?? "",
      mdParser: new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      }).use(ins_plugin),
      showCheatSheet: false,
      cheatSheet: "",
      editMode: true,
    }
  }

  override componentDidMount() {
    this.setState({
      markdown: this.props.value ?? "",
      editMode: !this.props.value,
    })
    fetch("/markdown-cheatsheet.html").then((resp) => {
      resp.text().then((e) => {
        this.setState({ cheatSheet: e })
      })
    })
  }

  componentDidUpdate(
    prevProps: Readonly<MarkdownEditorProps>,
    prevState: Readonly<MarkdownEditorState>,
    snapshot?: any,
  ) {
    if (prevState.editMode != this.state.editMode) {
      this.editorRef.current?.setView(
        this.state.editMode
          ? { html: true, menu: true, md: true }
          : {
              html: true,
              md: false,
              menu: false,
            },
      )
    }
  }

  handleEditorChange({ text, html }: { html: string; text: string }) {
    this.setState({ markdown: text })
  }

  startEdit() {
    this.setState({ editMode: true })
  }

  saveEdit() {
    this.props.onChange?.(this.state.markdown, () => {
      this.setState({ editMode: false })
    })
  }

  cancelEdit() {
    this.setState({ markdown: this.props.value ?? "" })
    this.props.value
      ? this.setState({ editMode: false })
      : this.props.onCancel?.()
  }

  override render() {
    return (
      <div
        className={this.props.className}
        style={{
          ...this.props.style,
          position: "relative",
          maxWidth: this.state.editMode ? "100%" : 960,
        }}
      >
        <Modal
          width={700}
          open={this.state.showCheatSheet}
          title={<div></div>}
          onOk={() => this.setState({ showCheatSheet: false })}
          cancelButtonProps={{ style: { display: "none" } }}
          onCancel={() => this.setState({ showCheatSheet: false })}
        >
          <div style={{ textAlign: "center" }}>
            <div>
              <i
                className="al-ico-markdown"
                style={{ color: "#8492c2", fontSize: 60 }}
              />
            </div>
            <span className="commonDialogTitle">MARKDOWN CHEAT SHEET</span>
          </div>
          <div
            className="cheatSheetWrap"
            dangerouslySetInnerHTML={{ __html: this.state.cheatSheet }}
          ></div>
        </Modal>
        {!this.state.editMode && (
          <Button
            onClick={() => this.startEdit()}
            style={{ position: "absolute", right: 10, zIndex: 100, top: 10 }}
          >
            Edit
          </Button>
        )}
        <MdEditor
          ref={this.editorRef}
          allowPasteImage={false}
          value={this.state.markdown}
          style={{ height: this.state.editMode ? "calc(100% - 70px)" : "auto" }}
          renderHTML={(text) => this.state.mdParser.render(text)}
          onChange={(e) => this.handleEditorChange(e)}
        />
        {this.state.editMode && (
          <Space
            style={{
              justifyContent: "space-between",
              width: "100%",
              marginTop: 15,
            }}
          >
            <Button
              type="text"
              icon={
                <i
                  style={{ fontSize: 24 }}
                  className="al-icon al-ico-markdown"
                />
              }
              onClick={() => this.setState({ showCheatSheet: true })}
            />
            <Space>
              <Button
                type="primary"
                disabled={this.props.value == this.state.markdown}
                onClick={() => this.saveEdit()}
              >
                SAVE
              </Button>
              <Button onClick={() => this.cancelEdit()}>CANCEL</Button>
            </Space>
          </Space>
        )}
      </div>
    )
  }
}
