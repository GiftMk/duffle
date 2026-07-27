import { MoonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr'
import { useTheme } from '@/components/theme-provider'
import { ICON_SIZE_PX } from '@/lib/constants'

export const ThemeToggle = () => {
	const { resolvedTheme, setTheme } = useTheme()

	const handleClick = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}

	return (
		<button
			onClick={handleClick}
			type='button'
			className='flex h-fit w-fit items-center justify-center rounded-full border border-surface-400 bg-surface-100 p-2 text-typography-600 transition-all duration-75 hover:scale-125 hover:bg-surface-300/50 focus:outline-none'
		>
			{resolvedTheme === 'dark' ? (
				<SunIcon size={ICON_SIZE_PX} />
			) : (
				<MoonIcon size={ICON_SIZE_PX} />
			)}
		</button>
	)
}
