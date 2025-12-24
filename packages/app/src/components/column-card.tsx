import { Droppable } from '@hello-pangea/dnd'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { FC } from 'react'
import { cn } from '@/lib/utils'
import { columnCollection } from '@/state/collections'
import { TaskCard } from './task-card'
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
		<Card className='w-full max-w-1/6 h-full bg-transparent ring-0 border-dashed'>
			<CardHeader>
				<CardTitle>{column.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<TaskList columnId={id} taskIds={column.tasks} />
			</CardContent>
		</Card>
	)
}
