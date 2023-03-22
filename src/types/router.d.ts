import React from "react"

export interface MetaProps {
  affix?: boolean
  requiresAuth?: boolean
  title: string
  icon?: string
}

export interface RouteObject {
  caseSensitive?: boolean
  children?: RouteObject[]
  element?: React.ReactNode
  index?: boolean
  path?: string
  name?: string
  meta?: MetaProps
  iframe?: string
  hidden?: boolean
}
