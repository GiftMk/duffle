import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/components/sidebar'

export const Route = createFileRoute('/_app')({
	component: AppLayout,
})

function AppLayout() {
	return (
		<main className='flex h-full w-full bg-surface-100'>
			<AppSidebar />
			<Outlet />
		</main>
	)
}
