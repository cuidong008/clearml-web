import { Breadcrumb } from "antd"

const Breadcrumbs = (props: { breadCrumbs: any[] }) => {
  return (
    <Breadcrumb
      items={props.breadCrumbs.map((key: any, _: any) => {
        return (
          <Breadcrumb.Item key={key.name}>
            <span className="b-link">{key.name}</span>
          </Breadcrumb.Item>
        )
      })}
    ></Breadcrumb>
  )
}
export default Breadcrumbs
