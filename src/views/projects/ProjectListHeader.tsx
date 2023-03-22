import { Select, Space } from "antd"
import { connect } from "react-redux"
import {
  changeScope,
  setProjectGroup,
  setProjectOrder,
  setProjectSort,
} from "@/store/project/project.actions"
import { ProjectConfState, StoreState } from "@/types/store"
import classNames from "classnames"
import styles from "./index.module.scss"
import { MouseEvent } from "react"

const ProjectListHeader = (
  props: ProjectConfState & {
    setProjectOrder: (order: string) => void
    changeScope: (scope: string) => void
    setProjectSort: (sort: string) => void
    setProjectGroup: (group: string) => void
  },
) => {
  const {
    showScope,
    sortOrder,
    orderBy,
    groups,
    groupId,
    changeScope,
    setProjectOrder,
    setProjectSort,
    setProjectGroup,
  } = props

  function reverseOrder(e: MouseEvent<HTMLElement>) {
    setProjectSort(sortOrder === "asc" ? "desc" : "asc")
    e.stopPropagation()
  }

  return (
    <div className={styles.projectHeader}>
      <Space size={10}>
        <Select
          bordered={false}
          value={orderBy}
          onChange={(e) => setProjectOrder(e)}
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
        <Select
          size="small"
          bordered={false}
          value={showScope}
          dropdownStyle={{ minWidth: 130 }}
          onChange={(e) => changeScope(e)}
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
            {
              label: (
                <div className={styles.filterItem}>
                  <i className={classNames("al-icon", "al-ico-publish")} />
                  Shared Work
                </div>
              ),
              value: "share",
            },
          ]}
        />
        {groups.length > 0 && showScope === "public" && (
          <Select
            size="small"
            dropdownStyle={{ minWidth: 130 }}
            bordered={false}
            onChange={(g) => setProjectGroup(g)}
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
const mapStateToProps = (state: StoreState) => state.project
const mapDispatchToProps = {
  changeScope,
  setProjectOrder,
  setProjectSort,
  setProjectGroup,
}
export const ProjectListHeaderCom = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectListHeader)
