import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { FadeIn, SpringPopIn } from '@/components/animations'
import { GithubLoginButton } from '@/components/github-login-button'
import { LoadingPage } from '@/components/loading-page'
import { useGithubAuth } from '@/hooks/use-github-auth'
import { createBoard, getLastUpdatedBoard } from '@/lib/actions'
import { useSession } from '@/lib/auth'

export const Route = createFileRoute('/')({
	component: RouteComponent,
})

const Heading = () => (
	<FadeIn>
		<h1 className='font-bold text-9xl tracking-tight'>Duffle.</h1>
	</FadeIn>
)

const SubHeading = () => (
	<TypeAnimation
		className='text-pretty text-2xl'
		sequence={[1000, 'A place to write and move sticky notes (˶ᵔ ᵕ ᵔ˶)']}
		speed={65}
	/>
)

function RouteComponent() {
	const { loading, signIn } = useGithubAuth()
	const { data: session, isPending } = useSession()
	const navigate = useNavigate()

	useEffect(() => {
		if (session) {
			const board = getLastUpdatedBoard() ?? createBoard('Getting Started')
			navigate({ to: '/boards/$boardId', params: { boardId: board.id } })
		}
	}, [session, navigate])

	if (isPending || session) {
		return <LoadingPage />
	}

	return (
		<main className='flex h-full w-full flex-col items-center justify-center gap-12 text-center'>
			<Heading />
			<SubHeading />
			<SpringPopIn className='flex gap-3' initial={{ y: -300 }}>
				<GithubLoginButton loading={loading} onClick={signIn} />
			</SpringPopIn>
		</main>
	)
}
