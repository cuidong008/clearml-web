import MdEditor from "react-markdown-editor-lite"
import { ins_plugin } from "./markdown-ins"
import MarkdownIt from "markdown-it"
import "react-markdown-editor-lite/lib/index.css"
import "./editor.dark.scss"
import React, { CSSProperties } from "react"
import { Button, Modal, Space } from "antd"

interface MarkdownEditorProps {
  className?: string
  style?: CSSProperties
  onChange?: (e: string) => void
  value?: string
  onCancel?: () => void
}

interface MarkdownEditorState {
  markdown: string
  mdParser: MarkdownIt
  showCheatSheet: boolean
  cheatSheet: string
}

export class Markdown extends React.Component<
  MarkdownEditorProps,
  MarkdownEditorState
> {
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
    }
    fetch("/markdown-cheatsheet.html").then((resp) => {
      resp.text().then((e) => {
        this.setState({ cheatSheet: e })
      })
    })
  }

  override componentDidMount() {
    this.setState({ markdown: this.props.value ?? "" })
  }

  handleEditorChange({ text, html }: { html: string; text: string }) {
    this.setState({ markdown: text })
  }

  override render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        <Modal
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
            <span className="cheatSheetTitle">MARKDOWN CHEAT SHEET</span>
          </div>
          <div
            className="cheatSheetWrap"
            dangerouslySetInnerHTML={{ __html: this.state.cheatSheet }}
          ></div>
        </Modal>
        <MdEditor
          allowPasteImage={false}
          value={this.state.markdown}
          style={{ height: "calc(100% - 70px)", minHeight: "300px" }}
          renderHTML={(text) => this.state.mdParser.render(text)}
          onChange={(e) => this.handleEditorChange(e)}
        />
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
              <i style={{ fontSize: 24 }} className="al-icon al-ico-markdown" />
            }
            onClick={() => this.setState({ showCheatSheet: true })}
          />
          <Space>
            <Button
              type="primary"
              disabled={
                (!this.state.markdown && !this.props.value) ||
                this.props.value == this.state.markdown
              }
            >
              SAVE
            </Button>
            <Button onClick={() => this.props.onCancel?.()}>CANCEL</Button>
          </Space>
        </Space>
      </div>
    )
  }
}
