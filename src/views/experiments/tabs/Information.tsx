import { EditableSection } from "@/views/experiments/shared/EditableSection"
import { useDetailCtx } from "@/views/experiments/details/DetailContext"
import React, { useEffect, useState } from "react"
import { Task } from "@/types/task"
import { selectionDisabledEditable } from "@/views/experiments/menu/items.utils"
import { Form, Input } from "antd"
import dayjs from "dayjs"
import { tasksUpdate } from "@/api/task"
import { transformDateToPeriod } from "@/utils/transformer"
import { map } from "lodash"
import { Link } from "react-router-dom"

export const Information = () => {
  const ctx = useDetailCtx()
  const [curData, setCurData] = useState<Task>()
  const [editComment, setEditComment] = useState(false)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    setCurData(() => ctx.current)
    setNewComment(ctx.current?.comment ?? "")
  }, [ctx.current])

  function updateComment() {
    return new Promise<boolean>((resolve, reject) => {
      if (!curData) {
        reject(false)
        return
      }
      tasksUpdate({
        task: curData.id,
        comment: newComment,
      })
        .then(({ data }) => {
          setCurData({ ...curData, ...data.fields })
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      <EditableSection
        editable={selectionDisabledEditable(curData)}
        label={<h4>DESCRIPTION:</h4>}
        onEdit={(e) => setEditComment(e)}
        onSave={() => updateComment()}
      >
        <Input.TextArea
          className="commentEdit"
          value={newComment}
          onChange={(e) => {
            editComment && setNewComment(e.target.value)
          }}
          style={{ minHeight: 120, maxHeight: 300 }}
        />
      </EditableSection>
      <EditableSection editable={false}>
        <Form labelAlign="left" labelCol={{ span: 3 }}>
          <Form.Item label="ARCHIVED">
            <div>
              {curData?.system_tags?.includes("archived") ? "Yes" : "No"}
            </div>
          </Form.Item>
          <Form.Item label="CHANGED AT">
            <div>
              {curData?.status_changed
                ? dayjs(curData.status_changed).format("MMM d YYYY H:mm")
                : "N/A"}
            </div>
          </Form.Item>
          <Form.Item label="LAST ITERATION">
            <div>
              {curData?.last_iteration ? curData.last_iteration : "N/A"}
            </div>
          </Form.Item>
          <Form.Item label="STATUS MESSAGE">
            <div>
              {curData?.status_message ? curData.status_message : "N/A"}
            </div>
          </Form.Item>
          <Form.Item label="STATUS REASON">
            <div>{curData?.status_reason ? curData.status_reason : "N/A"}</div>
          </Form.Item>
          <Form.Item label="CREATED AT">
            <div>
              {curData?.created
                ? dayjs(curData.created).format("MMM d YYYY H:mm")
                : "N/A"}
            </div>
          </Form.Item>
          <Form.Item label="STARTED AT">
            <div>
              {curData?.started
                ? dayjs(curData.started).format("MMM d YYYY H:mm")
                : "N/A"}
            </div>
          </Form.Item>
          <Form.Item label="LAST UPDATED AT">
            <div>
              {curData?.last_update
                ? dayjs(curData.last_update).format("MMM d YYYY H:mm")
                : "N/A"}
            </div>
          </Form.Item>
          <Form.Item label="COMPLETED AT">
            <div>
              {curData?.completed
                ? dayjs(curData.completed).format("MMM d YYYY H:mm")
                : "N/A"}
            </div>
          </Form.Item>
          <Form.Item label="RUN TIME">
            <div>
              {curData?.active_duration
                ? transformDateToPeriod(curData.active_duration)
                : "N/A"}
            </div>
          </Form.Item>
          <Form.Item label="QUEUE">
            <div>
              {curData?.execution?.queue?.id ? (
                <Link
                  to={`/workers-and-queues/queues?id=${curData?.execution.queue.id}`}
                >
                  {curData.execution.queue.name ?? "default"}
                </Link>
              ) : (
                "N/A"
              )}
            </div>
          </Form.Item>
          <Form.Item label="WORKER">
            <div>
              {curData?.last_worker ? (
                <Link
                  to={`/workers-and-queues/workers?id=${curData.last_worker}`}
                >
                  {curData.last_worker}
                </Link>
              ) : (
                "N/A"
              )}
            </div>
          </Form.Item>
          <Form.Item label="CREATED BY">
            <div>{curData?.user?.name ? curData.user.name : "N/A"}</div>
          </Form.Item>
          <Form.Item label="PARENT TASK">
            <div>{curData?.parent?.name ? curData.parent.name : "N/A"}</div>
          </Form.Item>
          <Form.Item label="PROJECT">
            <div>{curData?.project?.name ? curData.project.name : "N/A"}</div>
          </Form.Item>
          <Form.Item label="ID">
            <div>{curData?.id ? curData.id : "N/A"}</div>
          </Form.Item>
          {map(curData?.runtime, (v, k) => (
            <Form.Item key={k} label={k}>
              <div>{v ? v : "N/A"}</div>
            </Form.Item>
          ))}
        </Form>
      </EditableSection>
    </div>
  )
}
