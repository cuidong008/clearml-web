import { Modal, Tabs } from "antd"
import { useState } from "react"
import styles from "./dialog.module.scss"
import classNames from "classnames"
import { CopyToClipboard } from "@/components/CopyToClipboard"
import YouTube from "react-youtube"
import { urls } from "@/utils/constant"

interface StepObject {
  header?: string
  title?: string
  code?: string
  subNote?: string
}

export const NewExperimentDialog = (props: {
  show: boolean
  onClose: (e: boolean) => void
}) => {
  const { show, onClose } = props
  const [activeTab, setActiveTab] = useState("setup")
  const [subActive, setSubActive] = useState("local")
  const [videoSrc, setVideoSrc] = useState("s3k9ntmQmD4")

  return (
    <Modal
      width={650}
      open={show}
      onOk={() => onClose(false)}
      onCancel={() => onClose(false)}
      cancelButtonProps={{ style: { display: "none" } }}
      title={<div></div>}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <div
            className="i-welcome-researcher"
            style={{ width: 60, height: 60 }}
          />
        </div>
        <span className="commonDialogTitle">CREATE NEW EXPERIMENT</span>
        <p className="subDialogHeader">
          To create a new experiment you can either run your ML code
          instrumented with the ClearML SDK, or Relaunch a previously run
          experiment by cloning it.
        </p>
        <Tabs
          activeKey={activeTab}
          centered
          onChange={(e) => setActiveTab(e)}
          items={[
            { label: "Setup ClearML", key: "setup" },
            { label: "Run your ML code", key: "run" },
            { label: "Relaunch previous experiments", key: "relaunch" },
            {
              label: (
                <div style={{ width: 44 }}>
                  <i className="al-icon al-ico-video sm-md" />
                </div>
              ),
              key: "video",
            },
          ]}
        />
        <div className={styles.stepsContent}>
          {activeTab === "setup" && (
            <>
              <div className="stepContainer">
                <div className={styles.step}>1. Install</div>
                <div className={classNames(styles.step, styles.subNote)}>
                  Run the ClearML setup script
                </div>
                <div className={styles.code}>
                  <CopyToClipboard className={styles.copy}>
                    <div className={styles.content}>pip install clearml</div>
                  </CopyToClipboard>
                </div>
              </div>
              <div className="stepContainer">
                <div className={styles.step}>2. Configure</div>
                <Tabs
                  centered
                  onChange={(e) => setSubActive(e)}
                  activeKey={subActive}
                  items={[
                    { label: "LOCAL PYTHON", key: "local" },
                    {
                      label: "JUPYTER NOTEBOOK",
                      key: "jupyter",
                    },
                  ]}
                />
                <div className={classNames(styles.step, styles.subNote)}>
                  Set the ClearML environment for your notebook
                </div>
                {subActive === "local" && (
                  <div className={styles.code}>
                    <CopyToClipboard className={styles.copy}>
                      <div className={styles.content}>clearml-init</div>
                    </CopyToClipboard>
                  </div>
                )}
                {subActive === "jupyter" && (
                  <div className={styles.code}>
                    <CopyToClipboard className={styles.copy}>
                      <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{
                          __html: `%env CLEARML_WEB_HOST=${urls.WEB_SERVER_URL}
%env CLEARML_API_HOST=${urls.API_BASE_URL}
%env CLEARML_FILES_HOST=${urls.FIlE_SERVER_URL}
%env CLEARML_API_ACCESS_KEY=${"< "}You’re API access key>
%env CLEARML_API_SECRET_KEY=${"< "}You’re API secret key>`,
                        }}
                      />
                    </CopyToClipboard>
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === "run" && (
            <div className="stepContainer">
              <div className={styles.code}>
                <CopyToClipboard className={styles.copy}>
                  <div className={styles.content}>
                    <span className={styles.variable}>import</span> numpy{" "}
                    <span className={styles.variable}>as</span> np
                    <br />
                    <span className={styles.variable}>import</span>{" "}
                    matplotlib.pyplot{" "}
                    <span className={styles.variable}>as</span> plt
                    <br />
                    <br />
                    # Add the following two lines to your code, to have ClearML
                    automatically log your experiment
                    <br />
                    <span className={styles.variable}>from</span> clearml{" "}
                    <span className={styles.variable}>import</span> Task
                    <br />
                    <br />
                    task = Task.init(project_name=
                    <span className={styles.string}>
                      &apos;My Project&apos;
                    </span>
                    , task_name=
                    <span className={styles.string}>
                      &apos;My Experiment&apos;
                    </span>
                    )
                    <br />
                    <br />
                    # Create a plot using matplotlib, or you can also use plotly
                    <br />
                    <code>
                      plt.scatter(np.random.rand(50), np.random.rand(50),
                      c=np.random.rand(50), alpha=0.5)
                    </code>
                    <br />
                    <br />
                    # Plot will be reported automatically to clearml
                    <br />
                    plt.show()
                    <br />
                    <br />
                    # Report some scalars
                    <br />
                    <span className={styles.variable}>for</span> i&nbsp;
                    <span className={styles.variable}>in</span> range(100):
                    <br />
                    &nbsp;&nbsp; task.get_logger().report_scalar(title=
                    <span className={styles.string}>
                      &quot;graph title&quot;
                    </span>
                    , series=
                    <span className={styles.string}>&quot;linear&quot;</span>,
                    value=i*2, iteration=i)
                  </div>
                </CopyToClipboard>
              </div>
            </div>
          )}
          {activeTab === "relaunch" && (
            <div className="step-container">
              <div className={styles.step}>
                1. Clone a previously run experiment
              </div>
              <div className={classNames(styles.step, styles.subNote)}>
                Use the <span className="bolder">“Clone”</span> action to create
                a new draft copy.
              </div>
              <div className={classNames(styles.step, styles.subNote)}>
                You can change any of the new experiments’ configurations.
              </div>
              <div className={classNames(styles.step, styles.subNote)}>
                Experiments table
              </div>
              <div className="new-experiment-table"></div>
              <div className={styles.step}>2. Run your experiment</div>
              <div className={classNames(styles.step, styles.subNote)}>
                Use the <span className="bolder">“Enqueue”</span> action to
                enqueue the new experiment on an available queue.
              </div>
              <div className={classNames(styles.step, styles.subNote)}>
                To have an agent service a queue, on your target machine run:
              </div>
              <div className={styles.code}>
                <CopyToClipboard className={styles.copy}>
                  <div className={styles.content}>
                    clearml-agent daemon —queue &lt;queue name&gt;
                  </div>
                </CopyToClipboard>
              </div>
            </div>
          )}
          {activeTab === "video" && (
            <div>
              <YouTube
                videoId={videoSrc}
                opts={{ width: 544, height: 306 }}
                style={{ width: 544, height: 306 }}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
