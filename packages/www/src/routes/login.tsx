import { GithubLogoIcon } from '@phosphor-icons/react/dist/ssr'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FadeIn, SpringPopIn } from '@/components/animations'
import { LoadingPage } from '@/components/loading-page'
import { UserAvatar } from '@/components/user-avatar'
import { signIn, useSession } from '@/lib/auth'
import { ICON_SIZE_MD } from '@/lib/constants'
import { Sidebar } from '@/components/sidebar'

export const Route = createFileRoute('/login')({
	component: RouteComponent,
})

const getCallbackUrl = (): string => {
	return document.referrer?.startsWith(window.location.origin)
		? document.referrer
		: `${window.location.origin}/boards`
}

const AVATAR_SEED = 'xlelgneb'

function RouteComponent() {
	const navigate = useNavigate()
	const { data: session, isPending } = useSession()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (session) {
			navigate({ to: '/boards' })
		}
	}, [session, navigate])

	if (isPending || session) {
		return <LoadingPage />
	}

	const handleGithubSignIn = async () => {
		setLoading(true)
		setError(null)

		const { error: signInError } = await signIn.social({
			provider: 'github',
			callbackURL: getCallbackUrl(),
			errorCallbackURL: `${window.location.origin}/logout`,
		})

		if (signInError) {
			setError(signInError.message ?? 'Something went wrong. Please try again.')
			setLoading(false)
		}
	}

	return (
		<main className='h-full w-full'>
			<Sidebar />
			<div className='flex w-full flex-col items-center justify-center gap-8 text-center'>
				<FadeIn className='flex flex-col items-center gap-3'>
					<UserAvatar seed={AVATAR_SEED} size={64} />
					<h1 className='font-bold text-2xl tracking-tight'>Hey Stranger.</h1>
					<p className='text-pretty text-typography-600'>
						Sign up to get cross-device sync and more.
					</p>
				</FadeIn>
				<SpringPopIn className='flex flex-col items-center gap-3'>
					<button
						type='button'
						onClick={handleGithubSignIn}
						disabled={loading}
						className='flex items-center gap-2 rounded-sm border border-primary-500 px-5 py-2 transition-all duration-200 hover:scale-110 hover:bg-primary-500/10 disabled:pointer-events-none disabled:opacity-50'
					>
						<GithubLogoIcon
							size={ICON_SIZE_MD}
							className='fill-primary-500'
							weight='duotone'
						/>
						{loading ? 'Redirecting…' : 'Continue with GitHub'}
					</button>
					{error && <p className='text-red-600 text-sm'>{error}</p>}
				</SpringPopIn>
			</div>
		</main>
	)
}
