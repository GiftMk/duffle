import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
	children: ReactNode
	defaultTheme?: Theme
	storageKey?: string
}

type ThemeProviderState = {
	theme: Theme
	resolvedTheme: 'dark' | 'light'
	setTheme: (theme: Theme) => void
}

const STORAGE_KEY = 'duffle-ui-theme'

const isBrowser = typeof window !== 'undefined'

const getSystemTheme = (): 'dark' | 'light' => {
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
	undefined,
)

export const ThemeProvider = ({
	children,
	defaultTheme = 'system',
	storageKey = STORAGE_KEY,
}: ThemeProviderProps) => {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (!isBrowser) {
			return defaultTheme
		}
		return (localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme
	})
	const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
		if (!isBrowser) {
			return 'light'
		}
		return theme === 'system' ? getSystemTheme() : theme
	})

	useLayoutEffect(() => {
		const root = window.document.documentElement
		const applied = theme === 'system' ? getSystemTheme() : theme

		root.classList.remove('light', 'dark')
		root.classList.add(applied)
		setResolvedTheme(applied)
	}, [theme])

	useEffect(() => {
		if (theme !== 'system') {
			return
		}

		const root = window.document.documentElement
		const media = window.matchMedia('(prefers-color-scheme: dark)')
		const handleChange = () => {
			const systemTheme = getSystemTheme()
			root.classList.remove('light', 'dark')
			root.classList.add(systemTheme)
			setResolvedTheme(systemTheme)
		}

		media.addEventListener('change', handleChange)
		return () => media.removeEventListener('change', handleChange)
	}, [theme])

	const setTheme = (nextTheme: Theme) => {
		localStorage.setItem(storageKey, nextTheme)
		setThemeState(nextTheme)
	}

	return (
		<ThemeProviderContext.Provider value={{ theme, resolvedTheme, setTheme }}>
			{children}
		</ThemeProviderContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext)

	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}

	return context
}
