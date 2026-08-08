import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FadeIn, SpringPopIn } from '@/components/animations'
import { GithubLoginButton } from '@/components/github-login-button'
import { LoadingPage } from '@/components/loading-page'
import { Sidebar } from '@/components/sidebar'
import { UserAvatar } from '@/components/user-avatar'
import { useGithubAuth } from '@/hooks/use-github-auth'
import { useSession } from '@/lib/auth'

export const Route = createFileRoute('/login')({
	component: RouteComponent,
})

const AVATAR_SEED = 'xlelgneb'

function RouteComponent() {
	const navigate = useNavigate()
	const { data: session, isPending } = useSession()
	const { loading, error, signIn } = useGithubAuth()

	useEffect(() => {
		if (session) {
			navigate({ to: '/boards' })
		}
	}, [session, navigate])

	if (isPending || session) {
		return <LoadingPage />
	}

	return (
		<main className='flex h-full w-full'>
			<Sidebar />
			<div className='flex w-full flex-col items-center justify-center gap-8 text-center'>
				<FadeIn className='flex flex-col items-center gap-3'>
					<UserAvatar seed={AVATAR_SEED} size={64} />
					<h1 className='font-bold text-2xl tracking-tight'>Hey Stranger.</h1>
					<p className='text-pretty text-typography-600'>
						Login to get cross-device sync and more.
					</p>
				</FadeIn>
				<SpringPopIn className='flex flex-col items-center gap-3'>
					<GithubLoginButton loading={loading} onClick={signIn} />
					{error && <p className='text-red-600 text-sm'>{error}</p>}
				</SpringPopIn>
			</div>
		</main>
	)
}
