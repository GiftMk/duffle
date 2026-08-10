import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FadeIn, SpringPopIn } from '@/components/animations'
import { GithubLoginButton } from '@/components/github-login-button'
import { LoadingPage } from '@/components/loading-page'
import { UserAvatar } from '@/components/user-avatar'
import { useGithubAuth } from '@/hooks/use-github-auth'
import { useSession } from '@/lib/auth'

export const Route = createFileRoute('/_app/login')({
	ssr: true,
	validateSearch: (search: Record<string, unknown>) => ({
		redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
	}),
	component: RouteComponent,
})

const AVATAR_SEED = 'sfdsc'

function RouteComponent() {
	const navigate = useNavigate()
	const { redirect } = Route.useSearch()
	const { data: session, isPending } = useSession()
	const { loading, error, signIn } = useGithubAuth()

	useEffect(() => {
		if (session) {
			navigate({ to: redirect ?? '/boards' })
		}
	}, [session, navigate, redirect])

	if (isPending || session) {
		return <LoadingPage />
	}

	const handleSignIn = () => {
		signIn({ successRoute: '/login', errorRoute: '/login' })
	}

	return (
		<div className='flex w-full flex-col items-center justify-center gap-8 text-center'>
			<FadeIn className='flex flex-col items-center gap-3'>
				<UserAvatar seed={AVATAR_SEED} size={64} />
				<h1 className='font-bold text-2xl tracking-tight'>Hey Stranger.</h1>
				<p className='text-pretty text-typography-600'>
					Login to get cross-device sync and more.
				</p>
			</FadeIn>
			<SpringPopIn className='flex flex-col items-center gap-3'>
				<GithubLoginButton loading={loading} onClick={handleSignIn} />
				{error && <p className='text-red-600 text-sm'>{error}</p>}
			</SpringPopIn>
		</div>
	)
}
