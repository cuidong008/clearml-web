import MdEditor from "react-markdown-editor-lite"
import MarkdownIt from "markdown-it"
import "react-markdown-editor-lite/lib/index.css"
import "./editor.dark.scss"

export const Overview = () => {
  const mdParser = new MarkdownIt(/* Markdown-it options */)

  function handleEditorChange({ text, html }: { html: string; text: string }) {
    console.log("handleEditorChange", html, text)
  }

  return (
    <div>
      <MdEditor
        style={{ height: "500px" }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={(e) => handleEditorChange(e)}
      />
    </div>
  )
}
