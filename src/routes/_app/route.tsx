import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from '@/components/sidebar/sidebar'

export const Route = createFileRoute('/_app')({
	component: AppLayout,
})

function AppLayout() {
	return (
		<main className='flex h-full w-full bg-surface-100'>
			<Sidebar />
			<Outlet />
		</main>
	)
}
