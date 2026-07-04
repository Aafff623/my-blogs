'use client'

import { motion } from 'motion/react'
import { MoonIcon, SunIcon, MonitorIcon } from 'lucide-react'
import { useTheme } from './theme-provider'

export function ThemeToggle() {
	const { mode, resolvedMode, toggleMode } = useTheme()

	const Icon = resolvedMode === 'dark' ? MoonIcon : SunIcon
	const label = mode === 'system' ? '跟随系统' : resolvedMode === 'dark' ? '暗色模式' : '亮色模式'

	return (
		<motion.button
			whileHover={{ scale: 1.08 }}
			whileTap={{ scale: 0.92 }}
			onClick={toggleMode}
			className='bg-card/80 fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm'
			aria-label={label}
			title={label}>
			{mode === 'system' ? (
				<MonitorIcon className='text-primary size-4' />
			) : (
				<Icon className='text-primary size-4' />
			)}
		</motion.button>
	)
}
