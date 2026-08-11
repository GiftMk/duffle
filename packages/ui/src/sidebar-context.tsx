import { createContext, use } from 'react'

export type SidebarNavigation = {
	navigate: (path: string) => void
	getCurrentPathname: () => string
}

export const SidebarContext = createContext<SidebarNavigation | undefined>(
	undefined,
)

export const useSidebarNavigation = (): SidebarNavigation => {
	const context = use(SidebarContext)

	if (!context) {
		throw new Error('useSidebarNavigation must be used within a SidebarContext')
	}

	return context
}
