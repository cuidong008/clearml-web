import { Breadcrumb } from "antd"
import { useStoreSelector } from "@/store"
import { useEffect, useState } from "react"
import { BreadcrumbItemType, ItemType } from "antd/es/breadcrumb/Breadcrumb"
import { Link } from "react-router-dom"

const Breadcrumbs = (props: { breadCrumbs: any[] }) => {
  const selectedProject = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const [breadCrumbList, setBreadCrumbList] = useState<BreadcrumbItemType[]>([])
  useEffect(() => {
    const part = selectedProject?.name.split("/")
    const routeCrumbs = props.breadCrumbs.map((b) => ({
      key: `/${b.name}`,
      title: b.name,
    }))
    if (part && part.length === 1) {
      routeCrumbs.push({ key: "", title: part[0] })
    }
    if (part && part.length > 1) {
      for (let i = 0; i < part.length - 1; i++) {
        routeCrumbs.push({ key: `/projects/123/projects`, title: part[i] })
      }
      routeCrumbs.push({ key: ``, title: part[part.length - 1] })
    }

    setBreadCrumbList(routeCrumbs)
  }, [selectedProject, props.breadCrumbs])

  function itemRender(
    item: ItemType,
    params: any,
    items: ItemType[],
    paths: string[],
  ) {
    const last = items.length > 1 && items.indexOf(item) === items.length - 1
    const crumb = item as BreadcrumbItemType
    return last ? (
      <span className="b-link">{crumb.title}</span>
    ) : (
      <Link className="b-link" to={crumb.key?.toString() ?? "/"}>
        {crumb.title}
      </Link>
    )
  }

  return <Breadcrumb items={breadCrumbList} itemRender={itemRender} />
}
export default Breadcrumbs
