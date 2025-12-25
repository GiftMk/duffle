import { eq, useLiveQuery } from '@tanstack/react-db'
import type { FC } from 'react'
import { columnCollection } from '@/state/collections'
import { TaskList } from './task-list'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

type ColumnCardProps = {
	id: string
}

export const ColumnCard: FC<ColumnCardProps> = ({ id }) => {
	const { data: column } = useLiveQuery((q) =>
		q
			.from({ column: columnCollection })
			.where(({ column }) => eq(column.id, id))
			.findOne(),
	)

	if (!column) {
		// TODO: handle this better, return some form of skeleton component that shows column not found
		return null
	}

	return (
		<Card className='h-full w-[384px] shrink-0 border-dashed bg-background ring-0'>
			<CardHeader>
				<CardTitle className='text-muted-foreground font-semibold'>
					{column.title}
				</CardTitle>
			</CardHeader>
			<CardContent className='h-full'>
				<TaskList columnId={id} taskIds={column.tasks} />
			</CardContent>
		</Card>
	)
}
