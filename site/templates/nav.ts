import { CONFIG } from "../site.config"
import type { Link } from "../site.config"

const renderNavItem = ({ title, href }: Link, curPath: string) =>
  `<a href="${href}" aria-current=${href === curPath}>${title}</a>`

export const renderNavBar = (curPath: string) =>
  `<nav>${CONFIG.NAV.map((link) => renderNavItem(link, curPath)).join(" ")}</nav>`
