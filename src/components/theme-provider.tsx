'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import {
	applyThemeVariables,
	getInitialThemeMode,
	resolveThemeForMode,
	THEME_MODE_KEY,
	type ThemeMode
} from '@/lib/theme'

interface ThemeContextValue {
	mode: ThemeMode
	resolvedMode: 'light' | 'dark'
	setMode: (mode: ThemeMode) => void
	toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}

interface ThemeProviderProps {
	children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	const { siteContent, setSiteContent } = useConfigStore()
	const [mode, setModeState] = useState<ThemeMode>('system')
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => {
		const initial = getInitialThemeMode()
		const stored = typeof window !== 'undefined' ? (window.localStorage.getItem(THEME_MODE_KEY) as ThemeMode | null) : null
		setModeState(stored ?? 'system')
		setHydrated(true)
	}, [])

	const resolvedMode = useMemo<'light' | 'dark'>(() => {
		if (mode === 'system') {
			if (typeof window === 'undefined') return 'light'
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
		}
		return mode
	}, [mode])

	useEffect(() => {
		if (typeof window === 'undefined') return

		const root = document.documentElement
		if (resolvedMode === 'dark') {
			root.classList.add('dark')
		} else {
			root.classList.remove('dark')
		}

		const resolved = resolveThemeForMode(siteContent, resolvedMode)
		applyThemeVariables(resolved.theme, root)

		if (JSON.stringify(siteContent.backgroundColors) !== JSON.stringify(resolved.backgroundColors)) {
			setSiteContent({
				...siteContent,
				backgroundColors: resolved.backgroundColors
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resolvedMode, siteContent.theme, siteContent.darkTheme, siteContent.backgroundColors, siteContent.darkBackgroundColors])

	useEffect(() => {
		if (mode !== 'system' || typeof window === 'undefined') return
		const mq = window.matchMedia('(prefers-color-scheme: dark)')
		const handler = () => {
			// Force a re-render so resolvedMode updates.
			setModeState('system')
		}
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [mode])

	const setMode = (next: ThemeMode) => {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(THEME_MODE_KEY, next)
		}
		setModeState(next)
	}

	const toggleMode = () => {
		if (mode === 'system') {
			setMode(resolvedMode === 'dark' ? 'light' : 'dark')
		} else {
			setMode(mode === 'dark' ? 'light' : 'dark')
		}
	}

	return (
		<ThemeContext.Provider value={{ mode, resolvedMode, setMode, toggleMode }}>
			{children}
		</ThemeContext.Provider>
	)
}
