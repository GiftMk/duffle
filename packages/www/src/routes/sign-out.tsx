import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FadeIn, SpringPopIn } from '@/components/animations'
import { LoadingPage } from '@/components/loading-page'
import { UserAvatar } from '@/components/user-avatar'
import { signOut, useSession } from '@/lib/auth'

export const Route = createFileRoute('/sign-out')({
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate()
	const { data: session, isPending } = useSession()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!isPending && !session) {
			navigate({ to: '/sign-up' })
		}
	}, [isPending, session, navigate])

	if (isPending || !session) {
		return <LoadingPage />
	}

	const handleSignOut = async () => {
		setLoading(true)
		await signOut()
		navigate({ to: '/' })
	}

	const handleCancel = () => {
		navigate({ to: '/boards' })
	}

	return (
		<main className='flex h-full w-full flex-col items-center justify-center gap-8 text-center text-typography-950'>
			<FadeIn className='flex flex-col items-center gap-3'>
				<UserAvatar seed={session.user.id} size={64} />
				<h1 className='font-bold text-2xl tracking-tight'>
					{session.user.name}
				</h1>
				<p className='text-pretty text-typography-600'>{session.user.email}</p>
			</FadeIn>

			<SpringPopIn className='flex flex-col items-center gap-3'>
				<button
					type='button'
					onClick={handleSignOut}
					disabled={loading}
					className='rounded-sm border border-primary-500 px-5 py-2 transition-all duration-200 hover:scale-110 hover:bg-primary-500/10 disabled:pointer-events-none disabled:opacity-50'
				>
					{loading ? 'Signing out…' : 'Sign out'}
				</button>
				<button
					type='button'
					onClick={handleCancel}
					className='text-sm text-typography-600 underline-offset-4 hover:underline'
				>
					Cancel
				</button>
			</SpringPopIn>
		</main>
	)
}
