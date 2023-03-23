import { Checkbox, message, Modal, Progress } from "antd"
import { ReadyForDeletion } from "@/types/project"
import { useEffect, useState } from "react"
import { projectDelete } from "@/api/project"
import { getUrlsPerProvider } from "@/utils/global"

export const ProjectDeleteDialog = (props: {
  show: boolean
  onClose: (e: boolean) => void
  readyForDeletion?: ReadyForDeletion
}) => {
  const { show, onClose, readyForDeletion } = props
  const [isDeletable, setIsDeletable] = useState<number>(0)
  const [deleteArtifacts, setDeleteArtifacts] = useState(true)
  const [inProgress, setInProgress] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!show) {
      setProgress(0)
      setInProgress(false)
      setDeleteArtifacts(true)
    }
  }, [show])

  useEffect(() => {
    if (!readyForDeletion) {
      setIsDeletable(0)
      return
    }
    setIsDeletable(
      readyForDeletion.experiments.unarchived +
        readyForDeletion.models.unarchived ===
        0
        ? 1
        : 2,
    )
  }, [readyForDeletion])

  function deleteProjectAction() {
    setProgress(0)
    if (readyForDeletion) {
      setInProgress(true)
      projectDelete({
        project: readyForDeletion?.project.id,
        delete_contents: deleteArtifacts,
      })
        .then(({ data, meta }) => {
          if (meta.result_code !== 200) {
            message.error(meta.result_msg)
            return
          }
          const result = {
            urlsToDelete: [
              ...(data.urls?.model_urls ?? []),
              ...(data.urls?.artifact_urls ?? []),
              ...(data.urls?.event_urls ?? []),
            ],
            failed: [],
          }
          if (deleteArtifacts) {
            const urlPerSource = getUrlsPerProvider(result.urlsToDelete)
            //todo delete files by urls s3/google
          }
          setProgress(100)
          message.success(
            `delete project ${readyForDeletion.project.name} success`,
          )
          setTimeout(() => {
            onClose(true)
          }, 200)
        })
        .catch(() => {
          message.error(
            `project ${readyForDeletion.project.name} delete failure`,
          )
        })
    }
  }

  const getDeleteProjectPopupStatsBreakdown = (
    readyForDeletion: ReadyForDeletion,
    statsSubset: "archived" | "unarchived" | "total",
    experimentCaption: string,
  ): string =>
    `${
      readyForDeletion.experiments[statsSubset] > 0
        ? `${readyForDeletion.experiments[statsSubset]} ${experimentCaption} `
        : ""
    }
          ${
            readyForDeletion.models[statsSubset] > 0
              ? readyForDeletion.models[statsSubset] + " models "
              : ""
          }`
  return (
    <Modal
      open={show}
      onOk={deleteProjectAction}
      onCancel={() => onClose(false)}
      title={<div></div>}
      okButtonProps={{ style: { display: isDeletable === 2 ? "none" : "" } }}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          {isDeletable === 1 && (
            <i
              className="al-ico-trash"
              style={{ color: "#ff2024", fontSize: 60 }}
            />
          )}
          {isDeletable === 2 && (
            <div className="i-alert" style={{ width: 60, height: 60 }}></div>
          )}
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
          {isDeletable === 0
            ? ""
            : isDeletable === 1
            ? "DELETE PROJECT"
            : "UNABLE TO DELETE PROJECT"}
        </span>
        {!inProgress ? (
          <>
            {isDeletable === 2 && readyForDeletion && (
              <div
                style={{
                  lineHeight: 1.5,
                  fontSize: 14,
                  textAlign: "left",
                  margin: "0 auto",
                  overflowWrap: "break-word",
                  padding: "30px 0",
                }}
                dangerouslySetInnerHTML={{
                  __html: `You cannot delete project &quot;<b>${readyForDeletion?.project.name
                    .split("/")
                    .pop()}</b>&quot; with un-archived experiments or models. <br/>
                   You have ${getDeleteProjectPopupStatsBreakdown(
                     readyForDeletion,
                     "unarchived",
                     `un-archived experiment`,
                   )} in this project. <br/>
                   If you wish to delete this project, you must first archive, delete, or move these items to another project.`,
                }}
              />
            )}
            {isDeletable === 1 && (
              <div style={{ padding: "30px 0" }}>
                <div className="text-center">
                  Are you sure you want to delete &quot;
                  <b>{readyForDeletion?.project.name}</b>&quot;?
                </div>
                <br />
                <Checkbox
                  checked={deleteArtifacts}
                  onChange={(e) => setDeleteArtifacts(e.target.checked)}
                />{" "}
                Remove all related artifacts and debug samples from ClearML file
                server
              </div>
            )}
          </>
        ) : (
          <div>
            Deleting <Progress percent={progress} />
          </div>
        )}
      </div>
    </Modal>
  )
}
