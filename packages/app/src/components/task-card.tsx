import { Draggable } from '@hello-pangea/dnd'
import { eq, useLiveQuery } from '@tanstack/react-db'
import type { FC } from 'react'
import { cn } from '@/lib/utils'
import { taskCollection } from '@/state/collections'
import { Badge } from './ui/badge'
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card'

type TaskCardProps = {
	id: string
	index: number
	className?: string
}

export const TaskCard: FC<TaskCardProps> = ({ id, index, className }) => {
	const { data: task } = useLiveQuery((q) =>
		q
			.from({ task: taskCollection })
			.where(({ task }) => eq(task.id, id))
			.findOne(),
	)

	if (!task) {
		// TODO: handle this better, return some form of skeleton component that shows column not found
		return null
	}

	return (
		<Draggable draggableId={id} index={index}>
			{(provided) => (
				<Card
					className={cn('w-full cursor-grab shadow-xs', className)}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<CardHeader>
						<CardTitle className='capitalize'>{task.title}</CardTitle>
						<CardDescription className='truncate'>
							{task.description}
						</CardDescription>
					</CardHeader>
					<CardFooter className='justify-between border-0'>
						<Badge className='bg-muted-foreground text-xs'>{task.code}</Badge>
					</CardFooter>
				</Card>
			)}
		</Draggable>
	)
}
