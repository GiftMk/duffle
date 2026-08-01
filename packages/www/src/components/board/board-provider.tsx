import { createContext, type ReactNode, useContext } from 'react'
import { useBoard } from '@/hooks/use-board'

type BoardContextValue = ReturnType<typeof useBoard>

const BoardContext = createContext<BoardContextValue | undefined>(undefined)

type BoardProviderProps = {
	children: ReactNode
}

export const BoardProvider = ({ children }: BoardProviderProps) => {
	const board = useBoard()

	return <BoardContext.Provider value={board}>{children}</BoardContext.Provider>
}

export const useBoardContext = () => {
	const context = useContext(BoardContext)

	if (context === undefined) {
		throw new Error('useBoardContext must be used within a BoardProvider')
	}

	return context
}
