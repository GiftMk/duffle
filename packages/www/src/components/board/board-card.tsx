import { Draggable } from '@hello-pangea/dnd'
import type { BoardCard } from '@/lib/db'
import { cn, stripMarkdown } from '@/lib/utils'

type BoardCardItemProps = {
	card: BoardCard
	index: number
	className?: string
}

export const BoardCardItem = ({
	card,
	index,
	className,
}: BoardCardItemProps) => {
	const preview = card.description ? stripMarkdown(card.description).trim() : ''

	return (
		<Draggable draggableId={card.id} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={cn(
						'min-h-16 rounded-md border border-surface-400 bg-surface-50 px-3 py-3 text-sm text-typography-950 dark:bg-surface-300',
						className,
					)}
				>
					<p>{card.title}</p>
					{preview && (
						<p className='mt-1 line-clamp-2 text-typography-600 text-xs'>
							{preview}
						</p>
					)}
				</div>
			)}
		</Draggable>
	)
}
