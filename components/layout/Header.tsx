// components/layout/Header.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const routesPage = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "About",
    href: "/About"
  },
  {
    label: "Marketplace",
    href: "/marketplace"
  },
]

export default function Header() {
  return (
    <header className="py-4 px-6 flex items-center justify-between w-full bg-transparent border-2 rounded-md border-slate-800 ">
      <div className="flex items-center ">
        <Link href="/" className="text-2xl font-bold text-red-600">
          🏪 DaTron
        </Link>
      </div>
      <NavigationMenu >
        <NavigationMenuList>
          {routesPage.map((route, index) => (
            <NavigationMenuItem className="">
            <Link href={`${route.href}`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} >
                {route.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center space-x-4">
        <Button variant="default" className="bg-red-500 hover:bg-red-600">
          Login
        </Button>
      </div>
    </header>
  )
}