import { Droppable } from '@hello-pangea/dnd'
import type { BoardColumn as BoardColumnType } from '@/lib/db'
import { cn } from '@/lib/utils'
import { AddCard } from './add-card'
import { BoardCardItem } from './board-card'
import { useBoardContext } from './board-provider'
import { ColumnTitle } from './column-title'

type BoardColumnProps = {
	column: BoardColumnType
}

export const BoardColumn = ({ column }: BoardColumnProps) => {
	const { cards } = useBoardContext()

	return (
		<div className='flex w-80 shrink-0 flex-col gap-3'>
			<ColumnTitle columnId={column.id} title={column.title} />
			<Droppable droppableId={column.id}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={cn(
							'flex min-h-20 flex-col rounded-md p-1 transition-colors',
							snapshot.isDraggingOver && 'bg-surface-200',
						)}
					>
						{column.cardIds.map((cardId, index) => {
							const card = cards[cardId]
							if (!card) return null
							return (
								<BoardCardItem
									key={card.id}
									card={card}
									index={index}
									className='mb-3'
								/>
							)
						})}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<AddCard columnId={column.id} />
		</div>
	)
}
