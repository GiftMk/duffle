export const defaultBoardConfig = {
	title: 'My Board',
	columns: [
		{
			title: 'Todo',
			tasks: ['Sketch out the board layout', 'Pick a name for v2'],
		},
		{
			title: 'In Progress',
			tasks: ['Port drag and drop from v0'],
		},
		{
			title: 'Done',
			tasks: ['Ship the markdown editor'],
		},
	],
} satisfies {
	title: string
	columns: { title: string; tasks: string[] }[]
}
