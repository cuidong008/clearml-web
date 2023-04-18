import { Form, Modal, Select } from "antd"
import { ShareAltOutlined } from "@ant-design/icons"
import { useEffect, useRef } from "react"

export const ProjectShareDialog = (props: {
  show: boolean
  onClose: (e: boolean) => void
}) => {
  const { show, onClose } = props
  const [form] = Form.useForm()
  const formRef = useRef(null)

  useEffect(() => {
    if (formRef.current && show) {
      form.resetFields()
    }
  }, [show])

  function shareProject() {}

  return (
    <Modal
      open={show}
      onOk={shareProject}
      onCancel={() => onClose(false)}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <ShareAltOutlined style={{ color: "#8492c2", fontSize: 60 }} />
        </div>
        <span className="commonDialogTitle">Share Project</span>
      </div>
      <Form
        layout="vertical"
        style={{ marginTop: 30 }}
        form={form}
        ref={formRef}
      >
        <Form.Item label="Share To">
          <Select maxTagCount={3} mode="multiple" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
