/// <reference types="vite/client" />
/// <reference types="node" />

declare module "*.svg" {
  import { FunctionComponent, SVGProps } from "react"
  export const ReactComponent: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string }
  >
}
