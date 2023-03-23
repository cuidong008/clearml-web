import { Form, Input, message, Modal } from "antd"
import { projectCreate } from "@/api/project"
import { URI_REGEX } from "@/utils/constant"
import { useEffect, useRef } from "react"

export const ProjectNewDialog = (props: {
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

  function createNewProject() {
    form.validateFields().then((values) => {
      projectCreate({
        name: values.name,
        description: values.description,
        system_tags: values.system_tags,
        default_output_destination: values.default_output_destination,
      })
        .then(({ data }) => {
          data.id && onClose(true)
          message.success("create project success")
        })
        .catch(() => {
          message.error("create project success")
        })
    })
  }

  return (
    <Modal
      open={show}
      onOk={createNewProject}
      onCancel={() => onClose(false)}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <i
            className="al-ico-projects"
            style={{ color: "#8492c2", fontSize: 60 }}
          />
        </div>
        <span
          style={{
            fontSize: 24,
            fontWeight: 300,
            marginTop: 10,
            color: "#8492c2",
            display: "block",
            fontFamily: "Heebo,sans-serif",
          }}
        >
          New Project
        </span>
      </div>
      <Form layout={"vertical"} ref={formRef} form={form}>
        <Form.Item
          label="Project name"
          name={"name"}
          required={true}
          rules={[{ required: true, min: 3 }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name={"description"}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Default output destination"
          name={"default_output_destination"}
          rules={[
            {
              validator(_, value) {
                if (
                  value &&
                  !new RegExp(
                    `${URI_REGEX.S3_WITH_BUCKET}$|${URI_REGEX.S3_WITH_BUCKET_AND_HOST}$|${URI_REGEX.FILE}$|${URI_REGEX.NON_AWS_S3}$|${URI_REGEX.GS_WITH_BUCKET}$|${URI_REGEX.GS_WITH_BUCKET_AND_HOST}$`,
                  ).test(value)
                ) {
                  return Promise.reject(new Error("please enter right format"))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input placeholder="e.g. s3://bucket. gs://bucket" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
