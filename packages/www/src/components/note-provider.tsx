import { createContext, useContext } from 'react'

type CurrentNoteContextValue = {
	reload: () => void
}

export const CurrentNoteContext = createContext<
	CurrentNoteContextValue | undefined
>(undefined)

export const useCurrentNote = () => {
	const context = useContext(CurrentNoteContext)

	if (context === undefined) {
		throw new Error('useCurrentNote must be used within a CurrentNoteContext')
	}

	return context
}
