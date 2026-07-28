import { createContext, type ReactNode, useContext } from 'react'

type CurrentNoteContextValue = {
	reload: () => void
}

const CurrentNoteContext = createContext<CurrentNoteContextValue | undefined>(
	undefined,
)

type CurrentNoteProviderProps = {
	children: ReactNode
	reload: () => void
}

export const CurrentNoteProvider = ({
	children,
	reload,
}: CurrentNoteProviderProps) => {
	return <CurrentNoteContext value={{ reload }}>{children}</CurrentNoteContext>
}

export const useCurrentNote = () => {
	const context = useContext(CurrentNoteContext)

	if (context === undefined) {
		throw new Error('useCurrentNote must be used within a CurrentNoteProvider')
	}

	return context
}
