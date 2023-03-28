import { Breadcrumb } from "antd"
import { useStoreSelector } from "@/store"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

const Breadcrumbs = (props: { breadCrumbs: any[] }) => {
  const selectedProject = useStoreSelector(
    (state) => state.project.selectedProject,
  )
  const [breadCrumbList, setBreadCrumbList] = useState<any[]>([])
  useEffect(() => {
    const part = selectedProject?.name.split("/")
    setBreadCrumbList(
      props.breadCrumbs.concat(
        part?.map((l, i) => ({
          name: l,
          leaf: i === part.length - 1,
        })) ?? [],
      ),
    )
  }, [selectedProject, props.breadCrumbs])

  return (
    <Breadcrumb>
      {" "}
      {breadCrumbList.map((key: any, _: any) => {
        return (
          <Breadcrumb.Item key={key.name}>
            {key.leaf ? (
              <span className="b-link">{key.name}</span>
            ) : (
              <Link to={`/${key.name}`} className="b-link">
                {key.name}
              </Link>
            )}
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}
export default Breadcrumbs
