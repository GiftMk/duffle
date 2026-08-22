import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import type { ReactElement } from 'react'

type TooltipProps = {
	content: string
	children: ReactElement
}

export const Tooltip = ({ content, children }: TooltipProps) => {
	return (
		<TooltipPrimitive.Root>
			<TooltipPrimitive.Trigger render={children} />
			<TooltipPrimitive.Portal>
				<TooltipPrimitive.Positioner sideOffset={8}>
					<TooltipPrimitive.Popup className='rounded-md bg-neutral-900 px-2.5 py-1.5 text-neutral-50 text-xs shadow-black/20 shadow-lg'>
						{content}
					</TooltipPrimitive.Popup>
				</TooltipPrimitive.Positioner>
			</TooltipPrimitive.Portal>
		</TooltipPrimitive.Root>
	)
}

export const TooltipProvider = TooltipPrimitive.Provider
