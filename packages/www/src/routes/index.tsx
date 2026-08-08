import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { FadeIn, SpringPopIn } from '@/components/animations'
import { GithubLoginButton } from '@/components/github-login-button'
import { useGithubAuth } from '@/hooks/use-github-auth'
import { createBoard } from '@/lib/actions'
import { useSession } from '@/lib/auth'
import { LoadingPage } from '@/components/loading-page'
import { useBoards } from '@/hooks/boards'

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
	const { loading, signIn, error } = useGithubAuth()
	const { data: session, isPending } = useSession()
	const boards = useBoards()
	const navigate = useNavigate()

	useEffect(() => {
		if (session && !isPending) {
			const board = boards[0] ?? createBoard('Getting Started')
			navigate({ to: '/boards/$boardId', params: { boardId: board.id } })
		}
	}, [session, navigate, isPending, boards])

	const handleClick = async () => {
		await signIn({ successRoute: '/', errorRoute: '/' })
	}

	if (session) {
		return <LoadingPage message='Signing you in...' />
	}

	if (isPending) {
		return <LoadingPage message='Hitting up GitHub...' />
	}

	return (
		<main className='flex h-full w-full flex-col items-center justify-center gap-12 text-center'>
			<Heading />
			<SubHeading />
			<SpringPopIn className='flex flex-col gap-3' initial={{ y: -300 }}>
				<GithubLoginButton loading={loading} onClick={handleClick} />
				{error && <p className='text-red-600 text-sm'>{error}</p>}
			</SpringPopIn>
		</main>
	)
}
