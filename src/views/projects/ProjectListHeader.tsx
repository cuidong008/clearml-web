import { Select, Space } from "antd"
import { useDispatch } from "react-redux"
import { StoreState } from "@/types/store"
import classNames from "classnames"
import styles from "./index.module.scss"
import { MouseEvent } from "react"
import { useStoreSelector } from "@/store"
import {
  changeScope,
  setProjectGroup,
  setProjectOrder,
  setProjectSort,
} from "@/store/project/project.actions"
import { ThunkActionDispatch } from "redux-thunk"
import { useParams } from "react-router-dom"

export const ProjectListHeader = () => {
  const params = useParams()
  const { showScope, sortOrder, orderBy, groups, groupId } = useStoreSelector(
    (state: StoreState) => state.project,
  )

  const dispatch = useDispatch<ThunkActionDispatch<any>>()

  function reverseOrder(e: MouseEvent<HTMLElement>) {
    dispatch(setProjectSort(sortOrder === "asc" ? "desc" : "asc"))
    e.stopPropagation()
  }

  return (
    <div className={styles.projectHeader}>
      <Space size={10}>
        <Select
          bordered={false}
          value={orderBy}
          onChange={(e) => dispatch(setProjectOrder(e))}
          dropdownStyle={{ width: "auto" }}
          options={[
            {
              label: (
                <div className={styles.filterItem}>
                  {orderBy === "basename" && (
                    <i
                      onClick={(e) => reverseOrder(e)}
                      className={classNames("al-icon", {
                        "al-ico-sort-asc": sortOrder === "asc",
                        "al-ico-sort-desc": sortOrder === "desc",
                      })}
                    />
                  )}
                  Name
                </div>
              ),
              value: "basename",
            },
            {
              label: (
                <div className={styles.filterItem}>
                  {orderBy === "last_update" && (
                    <i
                      onClick={(e) => reverseOrder(e)}
                      className={classNames("al-icon", {
                        "al-ico-sort-asc": sortOrder === "asc",
                        "al-ico-sort-desc": sortOrder === "desc",
                      })}
                    />
                  )}
                  Recent
                </div>
              ),
              value: "last_update",
            },
          ]}
        />
        {!params["projId"] && (
          <Select
            size="small"
            bordered={false}
            value={showScope}
            dropdownStyle={{ minWidth: 130 }}
            onChange={(e) => dispatch(changeScope(e))}
            options={[
              {
                label: (
                  <div className={styles.filterItem}>
                    <i className={classNames("al-icon", "al-ico-me")} />
                    My Work
                  </div>
                ),
                value: "my",
              },
              {
                label: (
                  <div className={styles.filterItem}>
                    <i className={classNames("al-icon", "al-ico-team")} />
                    Public Work
                  </div>
                ),
                value: "public",
              },
              // {
              //   label: (
              //     <div className={styles.filterItem}>
              //       <i className={classNames("al-icon", "al-ico-publish")} />
              //       Shared Work
              //     </div>
              //   ),
              //   value: "share",
              // },
            ]}
          />
        )}
        {!params["projId"] && groups.length > 0 && showScope === "public" && (
          <Select
            size="small"
            dropdownStyle={{ minWidth: 130 }}
            bordered={false}
            onChange={(g) => dispatch(setProjectGroup(g))}
            options={groups.map((g) => ({
              label: <div className={styles.filterItem}>{g.name}</div>,
              value: g.id,
            }))}
            value={groupId}
          />
        )}
      </Space>
    </div>
  )
}
