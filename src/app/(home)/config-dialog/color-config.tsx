'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ColorPicker } from '@/components/color-picker'
import { XIcon } from 'lucide-react'
import type { SiteContent } from '../stores/config-store'
import siteContent from '@/config/site-content.json'
import { generateDarkBackgroundColors, generateDarkTheme } from '@/lib/theme'

interface ColorConfigProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
}

const DEFAULT_THEME_COLORS = siteContent.theme

type ColorPreset = {
	name: string
	theme: Partial<SiteContent['theme']>
	darkTheme?: Partial<SiteContent['theme']>
	backgroundColors: string[]
	darkBackgroundColors?: string[]
}

const COLOR_PRESETS: ColorPreset[] = [
	{
		name: '春暖',
		theme: {
			colorBrand: '#35bfab',
			colorBrandSecondary: '#1fc9e7',
			colorPrimary: '#334f52',
			colorSecondary: '#7b888e',
			colorBg: '#eeeeee',
			colorBorder: '#ffffff',
			colorCard: '#ffffff66',
			colorArticle: '#ffffffcc'
		},
		darkTheme: {
			colorBrand: '#2a9a89',
			colorBrandSecondary: '#19b3cf',
			colorPrimary: '#dcedef',
			colorSecondary: '#9aa8ad',
			colorBg: '#1a1a1a',
			colorBorder: '#ffffff1a',
			colorCard: '#ffffff12',
			colorArticle: '#2a2a2a66'
		},
		backgroundColors: ['#EDDD62', '#9EE7D1', '#84D68A', '#EDDD62', '#88E6E5', '#a7f3d0'],
		darkBackgroundColors: ['#8A7D2E', '#4FA090', '#4A8F5A', '#8A7D2E', '#4FA3A2', '#5A9A7A']
	},
	{
		name: '秋实',
		theme: {
			colorPrimary: '#4E3F42',
			colorBrand: '#de4331',
			colorBrandSecondary: '#FCC841'
		},
		darkTheme: {
			colorBrand: '#ff5a45',
			colorBrandSecondary: '#d4a832',
			colorPrimary: '#f3e6e0',
			colorSecondary: '#a89b91',
			colorBg: '#1f1a18',
			colorBorder: '#ffffff1a',
			colorCard: '#ffffff12',
			colorArticle: '#2a2a2a66'
		},
		backgroundColors: ['#FCC841', '#DFEFFC', '#DEDE92', '#DE4331', '#FE9750', '#FCC841'],
		darkBackgroundColors: ['#9C6F1F', '#2F4A61', '#6B6B2E', '#8B2116', '#A64D1A', '#9C6F1F']
	},
	{
		name: '晴空',
		theme: {
			colorBrand: '#2fcbe7',
			colorPrimary: '#5B423F',
			colorSecondary: '#8b7667',
			colorBrandSecondary: '#eec25e',
			colorBg: '#d4e8f3',
			colorCard: '#ffffff99'
		},
		darkTheme: {
			colorBrand: '#27abc4',
			colorPrimary: '#f0e6e3',
			colorSecondary: '#a89b91',
			colorBrandSecondary: '#c9a44e',
			colorBg: '#1a2630',
			colorBorder: '#ffffff1a',
			colorCard: '#ffffff12',
			colorArticle: '#2a2a2a66'
		},
		backgroundColors: ['#f7da3987', '#8fdbe9', '#fffef8'],
		darkBackgroundColors: ['#9C7F1F99', '#3A7A8A', '#3A4A55']
	},
	{
		name: '深夜',
		theme: {
			colorBrand: '#2a48f3',
			colorBrandSecondary: '#51d0b9',
			colorPrimary: '#1a1a1a',
			colorSecondary: '#6e6e70',
			colorBg: '#f5f5f7',
			colorBorder: '#0000001a',
			colorCard: '#0000000a',
			colorArticle: '#eeeeee'
		},
		darkTheme: {
			colorBrand: '#2a48f3',
			colorPrimary: '#e6e8e8',
			colorSecondary: '#acadae',
			colorBrandSecondary: '#51d0b9',
			colorBg: '#0a051f',
			colorBorder: '#8a8a8a5e',
			colorCard: '#ffffff0e',
			colorArticle: '#6f6f6f33'
		},
		backgroundColors: ['#a5b4fc'],
		darkBackgroundColors: ['#16007b']
	}
]

export function ColorConfig({ formData, setFormData }: ColorConfigProps) {
	const [editMode, setEditMode] = useState<'light' | 'dark'>('light')
	const defaultDarkColors = useMemo(() => generateDarkTheme(DEFAULT_THEME_COLORS), [])

	// Lazily initialize the dark palette from the current light palette
	// the first time the user switches to dark editing.
	useEffect(() => {
		if (editMode !== 'dark') return

		setFormData(prev => {
			const next = { ...prev }
			if (!next.darkTheme) {
				next.darkTheme = generateDarkTheme(prev.theme)
			}
			if (!next.darkBackgroundColors) {
				next.darkBackgroundColors = generateDarkBackgroundColors(prev.backgroundColors)
			}
			return next
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editMode])

	const isLight = editMode === 'light'
	const activeTheme = isLight ? formData.theme ?? {} : formData.darkTheme ?? {}
	const activeDefaultColors = isLight ? DEFAULT_THEME_COLORS : defaultDarkColors
	const activeBackgroundColors = isLight
		? formData.backgroundColors
		: (formData.darkBackgroundColors ?? generateDarkBackgroundColors(formData.backgroundColors))

	const handleThemeColorChange = (key: keyof typeof DEFAULT_THEME_COLORS, value: string) => {
		if (isLight) {
			setFormData(prev => ({
				...prev,
				theme: {
					...prev.theme,
					[key]: value
				}
			}))
		} else {
			setFormData(prev => ({
				...prev,
				darkTheme: {
					...prev.darkTheme,
					[key]: value
				}
			}))
		}
	}

	const handleBrandColorChange = (value: string) => {
		handleThemeColorChange('colorBrand', value)
	}

	const backgroundColorsKey: 'backgroundColors' | 'darkBackgroundColors' = isLight ? 'backgroundColors' : 'darkBackgroundColors'

	const handleColorChange = (index: number, value: string) => {
		setFormData(prev => {
			const colors = [...(prev[backgroundColorsKey] ?? [])]
			colors[index] = value
			return { ...prev, [backgroundColorsKey]: colors }
		})
	}

	const generateRandomColor = () => {
		const randomChannel = () => Math.floor(Math.random() * 256)
		return `#${[randomChannel(), randomChannel(), randomChannel()]
			.map(channel => channel.toString(16).padStart(2, '0'))
			.join('')
			.toUpperCase()}`
	}

	const handleRandomizeColors = () => {
		const count = Math.floor(Math.random() * 5) + 4 // 4 ~ 8 个颜色
		const backgroundColors = Array.from({ length: count }, () => generateRandomColor())
		const colorBrand = generateRandomColor()

		if (isLight) {
			setFormData(prev => ({
				...prev,
				backgroundColors,
				theme: {
					...prev.theme,
					colorBrand
				}
			}))
		} else {
			setFormData(prev => ({
				...prev,
				darkBackgroundColors: backgroundColors,
				darkTheme: {
					...prev.darkTheme,
					colorBrand
				}
			}))
		}
	}

	const handleAddColor = () => {
		const fallback = isLight ? '#EDDD62' : '#6b6b2e'
		setFormData(prev => ({
			...prev,
			[backgroundColorsKey]: [...(prev[backgroundColorsKey] ?? []), fallback]
		}))
	}

	const handleRemoveColor = (index: number) => {
		const colors = formData[backgroundColorsKey] ?? []
		if (colors.length > 1) {
			setFormData(prev => ({
				...prev,
				[backgroundColorsKey]: colors.filter((_, i) => i !== index)
			}))
		}
	}

	const handlePresetChange = (preset: ColorPreset) => {
		setFormData(prev => ({
			...prev,
			backgroundColors: [...preset.backgroundColors],
			darkBackgroundColors: preset.darkBackgroundColors ? [...preset.darkBackgroundColors] : prev.darkBackgroundColors,
			theme: {
				...prev.theme,
				...preset.theme
			},
			darkTheme: {
				...prev.darkTheme,
				...preset.darkTheme
			}
		}))
	}

	const ModeButton = ({ mode, label }: { mode: 'light' | 'dark'; label: string }) => (
		<button
			type='button'
			onClick={() => setEditMode(mode)}
			className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
				editMode === mode ? 'bg-white shadow-sm' : 'text-secondary hover:text-primary'
			}`}>
			{label}
		</button>
	)

	return (
		<div className='space-y-6'>
			<div className='flex rounded-lg border bg-white/60 p-1'>
				<ModeButton mode='light' label='亮色模式' />
				<ModeButton mode='dark' label='暗色模式' />
			</div>

			<div>
				<label className='mb-2 block text-sm font-medium'>基础颜色</label>
				<div className='grid grid-cols-2 gap-4'>
					<div className='flex items-center gap-3'>
						<ColorPicker value={activeTheme.colorBrand ?? activeDefaultColors.colorBrand} onChange={handleBrandColorChange} />
						<span className='text-xs'>主题色</span>
					</div>
					<div className='flex items-center gap-3'>
						<ColorPicker
							value={activeTheme.colorBrandSecondary ?? activeDefaultColors.colorBrandSecondary}
							onChange={value => handleThemeColorChange('colorBrandSecondary', value)}
						/>
						<span className='text-xs'>次级主题色</span>
					</div>
					<div className='flex items-center gap-3'>
						<ColorPicker value={activeTheme.colorPrimary ?? activeDefaultColors.colorPrimary} onChange={value => handleThemeColorChange('colorPrimary', value)} />
						<span className='text-xs'>主色</span>
					</div>
					<div className='flex items-center gap-3'>
						<ColorPicker
							value={activeTheme.colorSecondary ?? activeDefaultColors.colorSecondary}
							onChange={value => handleThemeColorChange('colorSecondary', value)}
						/>
						<span className='text-xs'>次色</span>
					</div>
					<div className='flex items-center gap-3'>
						<ColorPicker value={activeTheme.colorBg ?? activeDefaultColors.colorBg} onChange={value => handleThemeColorChange('colorBg', value)} />
						<span className='text-xs'>背景色</span>
					</div>
					<div className='flex items-center gap-3'>
						<ColorPicker value={activeTheme.colorBorder ?? activeDefaultColors.colorBorder} onChange={value => handleThemeColorChange('colorBorder', value)} />
						<span className='text-xs'>边框色</span>
					</div>
					<div className='flex items-center gap-3'>
						<ColorPicker value={activeTheme.colorCard ?? activeDefaultColors.colorCard} onChange={value => handleThemeColorChange('colorCard', value)} />
						<span className='text-xs'>卡片色</span>
					</div>
					<div className='flex items-center gap-3'>
						<ColorPicker value={activeTheme.colorArticle ?? activeDefaultColors.colorArticle} onChange={value => handleThemeColorChange('colorArticle', value)} />
						<span className='text-xs'>文章背景</span>
					</div>
				</div>
			</div>

			<div>
				<div className='mb-2 flex items-center justify-between gap-3'>
					<label className='block text-sm font-medium'>背景颜色</label>
					<div className='flex gap-2'>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleRandomizeColors}
							className='rounded-lg border bg-white/60 px-3 py-1 text-xs whitespace-nowrap'>
							随机配色
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleAddColor}
							className='rounded-lg border bg-white/60 px-3 py-1 text-xs whitespace-nowrap'>
							+ 添加颜色
						</motion.button>
					</div>
				</div>
				<div className='flex gap-3'>
					{activeBackgroundColors.map((color, index) => (
						<div key={index} className='flex items-center gap-2'>
							<div className='group relative'>
								<ColorPicker value={color} onChange={value => handleColorChange(index, value)} />
								{activeBackgroundColors.length > 1 && (
									<button
										onClick={() => handleRemoveColor(index)}
										className='text-secondary absolute -top-1 -right-2 rounded-lg border bg-white/60 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100'>
										<XIcon className='size-3' />
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				{COLOR_PRESETS.map(preset => (
					<button
						key={preset.name}
						onClick={() => handlePresetChange(preset)}
						className='flex items-center gap-3 rounded-lg border bg-white/60 p-3 transition-colors hover:bg-white/80'>
						<div className='flex items-center gap-2'>
							<div
								className='h-10 w-10 rounded-lg border-2 border-white/20 shadow-sm'
								style={{ backgroundColor: preset.theme.colorBrand ?? DEFAULT_THEME_COLORS.colorBrand }}
							/>
							{preset.backgroundColors.map((color, index) => (
								<div key={index} className='h-10 w-10 rounded-lg border-2 border-white/20 shadow-sm' style={{ backgroundColor: color }} />
							))}
						</div>

						<span className='text-sm font-medium whitespace-nowrap'>{preset.name}</span>
					</button>
				))}
			</div>
		</div>
	)
}
