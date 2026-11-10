import { ReactNode } from 'react'
import Link from 'next/link'

export const navbarButtonClasses =
  'rounded-full p-2 text-white hover:text-white focus:text-white focus:outline-hidden focus:ring-2 focus:ring-white'

interface NavbarButtonProps {
  href: string
  children: ReactNode
}

export default function NavbarButton({ href, children }: NavbarButtonProps) {
  return (
    <Link href={href} className={navbarButtonClasses}>
      {children}
    </Link>
  )
}
