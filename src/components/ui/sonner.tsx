import { useContext } from "react"
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"
import { ThemeProviderContext } from "@/context/theme/ThemeContext"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useContext(ThemeProviderContext)

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
