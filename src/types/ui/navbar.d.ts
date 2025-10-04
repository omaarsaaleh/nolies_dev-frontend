export interface BaseMenuItem {
  title: string
  active?: boolean
}

export interface LinkMenuItem extends BaseMenuItem {
  type: "link"
  to: string
}

export interface TriggerMenuItem extends BaseMenuItem {
  type: "trigger"
  prefixTo: string
  menu: {
    title: string
    to: string
    desc: string | null
  }[]
}

export type User = {
  firstName: string
  lastName: string
  email: string
  avatarUrl?: string | null
}


export type MenuItem = LinkMenuItem | TriggerMenuItem;