import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/theme')({
	component: RouteComponent,
})

type PaletteProps = {
	color: string
}

const COLOR_GRADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const Palette = ({ color }: PaletteProps) => {
	return (
		<div className='flex w-full flex-col gap-2'>
			<h1 className='font-bold text-xl capitalize'>{color}</h1>
			<ul className='flex flex-wrap gap-4'>
				{COLOR_GRADES.map((grade) => (
					<li
						className='flex h-28 w-40 items-end justify-end rounded-md p-2'
						key={grade}
						style={{
							background: `var(--color-${color}-${grade})`,
							color:
								grade < 700
									? `var(--color-${color}-950)`
									: `var(--color-${color}-300)`,
						}}
					>
						<p>
							{color}-{grade}
						</p>
					</li>
				))}
			</ul>
		</div>
	)
}

function RouteComponent() {
	return (
		<main className='h-fit w-full p-8'>
			<div className='flex h-full w-full flex-col gap-16 rounded-md bg-white p-12'>
				<Palette color='surface' />
				<Palette color='typography' />
				<Palette color='primary' />
			</div>
		</main>
	)
}
