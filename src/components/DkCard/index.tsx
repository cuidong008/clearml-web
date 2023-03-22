import { ReactNode, useState } from "react"
import styles from "./index.module.scss"
import classNames from "classnames"

export const DkCard = (props: {
  showFolder: boolean
  showAdd?: boolean
  cardHeader?: ReactNode
  cardBody?: ReactNode
  cardFooter?: ReactNode
  subCard?: ReactNode
  subFolderTitle?: string
  oneTabMode?: boolean
  height?: number
}) => {
  const {
    showFolder,
    showAdd,
    cardHeader,
    cardBody,
    cardFooter,
    oneTabMode,
    subFolderTitle,
    subCard,
    height,
  } = props
  const [mainHovered, setMainHovered] = useState(false)
  const [secHovered, setSecHovered] = useState(false)
  const [showSec, setShowSec] = useState(false)
  return (
    <div className={styles.dkCard}>
      {showFolder && (
        <div className={styles.folderTab}>
          <div
            className={styles.firstTab}
            onClick={(e) => {
              e.stopPropagation()
              setShowSec(false)
            }}
          >
            {!showSec ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="20"
                viewBox="0 0 64 20"
              >
                {!oneTabMode && secHovered && (
                  <path
                    d="M30.06,0H64V20H30.06C29.93,19.78,30.06,11.93,30.06,0Z"
                    fill="#5a658e"
                  />
                )}
                {!oneTabMode && !secHovered && (
                  <path
                    d="M30.06,0H64V20H30.06C29.93,19.78,30.06,11.93,30.06,0Z"
                    fill="#2c3246"
                  />
                )}
                {mainHovered ? (
                  <path
                    d="M35.61,0H6A6,6,0,0,0,0,6V20H60C44.82,12.36,49.37,0,35.61,0Z"
                    fill="#5a658e"
                    onMouseEnter={() => setMainHovered(true)}
                    onMouseLeave={() => setMainHovered(false)}
                  />
                ) : (
                  <path
                    d="M35.61,0H6A6,6,0,0,0,0,6V20H60C44.82,12.36,49.37,0,35.61,0Z"
                    fill="#384161"
                    onMouseEnter={() => setMainHovered(true)}
                    onMouseLeave={() => setMainHovered(false)}
                  />
                )}
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="20"
                viewBox="0 0 64 20"
              >
                {mainHovered ? (
                  <path
                    d="M35.61,0H6A6,6,0,0,0,0,6V20H60C44.82,12.36,49.37,0,35.61,0Z"
                    fill="#5a658e"
                    onMouseEnter={() => setMainHovered(true)}
                    onMouseLeave={() => setMainHovered(false)}
                  />
                ) : (
                  <path
                    d="M35.61,0H6A6,6,0,0,0,0,6V20H60C44.82,12.36,49.37,0,35.61,0Z"
                    fill="#384161"
                    onMouseEnter={() => setMainHovered(true)}
                    onMouseLeave={() => setMainHovered(false)}
                  />
                )}
                <path
                  d="M64,0V20H30C45.18,12.36,40.63,0,54.39,0Z"
                  fill="#2c3246"
                />
              </svg>
            )}
          </div>
          {!oneTabMode && (
            <>
              <div
                className={classNames(styles.middleTab, {
                  [styles.tabHovered]: secHovered,
                  [styles.showSecTab]: showSec,
                  [styles.secTabActive]: showSec,
                })}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSec(true)
                }}
                onMouseEnter={() => setSecHovered(true)}
                onMouseLeave={() => setSecHovered(false)}
              >
                {subFolderTitle}
              </div>
              <div
                className={classNames(styles.secondTab, {
                  [styles.tabHovered]: secHovered,
                  [styles.showSecTab]: showSec,
                })}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSec(true)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                >
                  {(showSec || !secHovered) && (
                    <path
                      d="M3.61,0C17.37,0,12.82,12.36,28,20H0V0Z"
                      fill="#2c3246"
                    />
                  )}
                  {!showSec && secHovered && (
                    <path
                      d="M3.61,0C17.37,0,12.82,12.36,28,20H0V0Z"
                      fill="#5a658e"
                    />
                  )}
                </svg>
              </div>
            </>
          )}
        </div>
      )}
      <div
        className={styles.cardContainer}
        style={{
          borderTopLeftRadius: showFolder ? "0" : "6px",
          height: height,
        }}
      >
        {!showAdd && (
          <>
            {!showSec ? (
              <div
                className={classNames(styles.firstTabContainer, {
                  [styles.firstTabHover]: mainHovered,
                })}
                onMouseEnter={() => setMainHovered(true)}
                onMouseLeave={() => setMainHovered(false)}
              >
                <header>{cardHeader}</header>
                {cardBody && <div className={styles.line}></div>}
                <div className={styles.cardBody}>{cardBody}</div>
                <footer>{cardFooter}</footer>
              </div>
            ) : (
              <div className={styles.secondTabContainer}>{subCard}</div>
            )}
          </>
        )}
        {showAdd && (
          <div
            className={classNames(styles.plusCard, {
              [styles.plusCardHover]: mainHovered,
            })}
            onMouseEnter={() => setMainHovered(true)}
            onMouseLeave={() => setMainHovered(false)}
          >
            <div
              className={classNames(
                "al-icon al-ico-plus al-color",
                styles.plusIcon,
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
}
