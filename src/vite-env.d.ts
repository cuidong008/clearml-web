/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.svg" {
  import { FunctionComponent, SVGProps } from "react"
  export const ReactComponent: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string }
  >
}
