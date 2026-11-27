import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar'
import { ThemeSwitch } from '@/components/theme-switch'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'

export function AppSidebar() {
  return (
    <Sidebar collapsible='icon' variant='inset'>
      <SidebarContent className='gap-1 px-1 pt-0.5 group-data-[collapsible=icon]:px-0'>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter className='border-t border-sidebar-border/80 px-2 py-1.5 group-data-[collapsible=icon]:px-0'>
        <ThemeSwitch variant='sidebar' />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
