import { MoonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr'
import { Tooltip } from '@/components/tooltip'
import { ICON_SIZE_MD } from '@/lib/constants'
import { SidebarButton } from './sidebar-button'
import { useTheme } from './theme-provider'

export const ThemeToggle = () => {
	const { resolvedTheme, setTheme } = useTheme()

	const handleClick = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}

	return (
		<Tooltip
			content={
				resolvedTheme === 'dark'
					? 'Switch to light mode'
					: 'Switch to dark mode'
			}
		>
			<SidebarButton onClick={handleClick}>
				{resolvedTheme === 'dark' ? (
					<SunIcon size={ICON_SIZE_MD} />
				) : (
					<MoonIcon size={ICON_SIZE_MD} />
				)}
			</SidebarButton>
		</Tooltip>
	)
}
