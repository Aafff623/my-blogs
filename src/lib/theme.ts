import type { SiteContent } from '@/app/(home)/stores/config-store'
import { hexToRgba, rgbToHex, rgbToHsl, hslToRgb } from './color'

export type Theme = SiteContent['theme']
export type ThemeMode = 'light' | 'dark' | 'system'

export const THEME_CSS_VARS: Record<keyof Theme, string> = {
	colorBrand: '--color-brand',
	colorBrandSecondary: '--color-brand-secondary',
	colorPrimary: '--color-primary',
	colorSecondary: '--color-secondary',
	colorBg: '--color-bg',
	colorBorder: '--color-border',
	colorCard: '--color-card',
	colorArticle: '--color-article'
}

export const THEME_MODE_KEY = 'theme-mode'

function rgbaToHex(r: number, g: number, b: number, a: number): string {
	const base = rgbToHex(r, g, b)
	if (a < 1) {
		const alphaHex = Math.round(a * 255)
			.toString(16)
			.padStart(2, '0')
		return `${base}${alphaHex}`
	}
	return base
}

/**
 * Generate a sensible dark-mode counterpart for a single color.
 * Keeps hue, inverts lightness around the midpoint, and slightly
 * desaturates very light background-like colors.
 */
export function generateDarkColor(hex: string): string {
	const rgba = hexToRgba(hex)
	const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b)

	// Invert lightness around 0.5 and keep it within readable bounds.
	let l = 1 - hsl.l
	if (l > 0.5) {
		l = Math.min(0.95, l + 0.06)
	} else {
		l = Math.max(0.06, l - 0.06)
	}

	// Slightly desaturate colors that were very light (likely backgrounds),
	// keep others roughly as saturated.
	const s = hsl.l > 0.6 ? hsl.s * 0.82 : hsl.s

	const rgb = hslToRgb(hsl.h, s, l)
	return rgbaToHex(rgb.r, rgb.g, rgb.b, rgba.a)
}

/**
 * Build a complete dark theme from a light theme.
 * Explicit `overrides` (e.g. from `siteContent.darkTheme`) take precedence.
 */
export function generateDarkTheme(light: Theme, overrides?: Partial<Theme>): Theme {
	const keys = Object.keys(light) as Array<keyof Theme>
	const generated = {} as Theme

	for (const key of keys) {
		const explicit = overrides?.[key]
		generated[key] = explicit ?? generateDarkColor(light[key])
	}

	return generated
}

/**
 * Build dark-mode background colors.
 * Explicit `overrides` take precedence index-by-index.
 */
export function generateDarkBackgroundColors(colors: string[], overrides?: string[]): string[] {
	const generated = colors.map(generateDarkColor)
	if (!overrides?.length) return generated

	return generated.map((fallback, index) => overrides[index] ?? fallback)
}

/**
 * Resolve the theme + background colors that should be applied for a given mode.
 */
export function resolveThemeForMode(siteContent: SiteContent, mode: 'light' | 'dark') {
	if (mode === 'light') {
		return {
			theme: siteContent.theme,
			backgroundColors: siteContent.backgroundColors
		}
	}

	return {
		theme: generateDarkTheme(siteContent.theme, siteContent.darkTheme),
		backgroundColors: generateDarkBackgroundColors(siteContent.backgroundColors, siteContent.darkBackgroundColors)
	}
}

/**
 * Apply theme CSS variables to a DOM element (defaults to <html>).
 */
export function applyThemeVariables(theme: Partial<Theme>, root: HTMLElement = document.documentElement) {
	for (const [key, value] of Object.entries(theme)) {
		if (!value) continue
		const varName = THEME_CSS_VARS[key as keyof Theme]
		if (varName) {
			root.style.setProperty(varName, value)
		}
	}
}

/**
 * Read the stored theme mode, falling back to system preference.
 */
export function getInitialThemeMode(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light'

	const stored = window.localStorage.getItem(THEME_MODE_KEY) as ThemeMode | null
	if (stored === 'dark') return 'dark'
	if (stored === 'light') return 'light'
	if (stored === 'system' || !stored) {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}
	return 'light'
}

/**
 * Build the inline script that runs before first paint to avoid a flash of
 * light mode when the user is in dark mode.
 */
export function buildThemeScript(siteContent: SiteContent): string {
	const lightTheme = siteContent.theme
	const darkTheme = generateDarkTheme(siteContent.theme, siteContent.darkTheme)

	const toVars = (theme: Theme) => {
		const vars: Record<string, string> = {}
		for (const [key, value] of Object.entries(theme)) {
			const name = THEME_CSS_VARS[key as keyof Theme]
			if (name && value) {
				vars[name] = value
			}
		}
		return vars
	}

	const lightVars = toVars(lightTheme)
	const darkVars = toVars(darkTheme)

	return `
(function(){
  try {
    var lightVars = ${JSON.stringify(lightVars)};
    var darkVars = ${JSON.stringify(darkVars)};
    var stored = localStorage.getItem('${THEME_MODE_KEY}');
    var mode = stored === 'dark' ? 'dark' : stored === 'light' ? 'light' : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var root = document.documentElement;
    var vars = mode === 'dark' ? darkVars : lightVars;
    if (mode === 'dark') root.classList.add('dark');
    for (var k in vars) { if (vars[k]) root.style.setProperty(k, vars[k]); }
  } catch (e) {}
})();
  `.trim()
}
