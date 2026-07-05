'use client'

import Link from 'next/link'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { CalendarDays, Check, ChevronRight, Clock3, FolderTree, Grid3X3, Layers3, Pencil, Tags, Trash2 } from 'lucide-react'
import { useBlogIndex, type BlogIndexItem } from '@/hooks/use-blog-index'
import { useCategories } from '@/hooks/use-categories'
import { useReadArticles } from '@/hooks/use-read-articles'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { readFileAsText } from '@/lib/file-utils'
import { cn } from '@/lib/utils'
import JuejinSVG from '@/svgs/juejin.svg'
import { saveBlogEdits } from './services/save-blog-edits'
import { CategoryModal } from './components/category-modal'

type DisplayMode = 'day' | 'week' | 'month' | 'year' | 'category'

type ArchiveGroup = {
	key: string
	label: string
	caption: string
	items: BlogIndexItem[]
	startTime: number
}

type CategoryNode = {
	key: string
	label: string
	caption: string
	items: BlogIndexItem[]
	children?: CategoryNode[]
}

const viewOptions: Array<{ value: DisplayMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
	{ value: 'day', label: '日', icon: Grid3X3 },
	{ value: 'week', label: '周', icon: CalendarDays },
	{ value: 'month', label: '月', icon: Clock3 },
	{ value: 'year', label: '年', icon: Layers3 },
	{ value: 'category', label: '分类', icon: FolderTree }
]

const topicRules: Array<{ label: string; match: string[] }> = [
	{ label: '前端与界面', match: ['react', 'next', 'css', 'svg', '组件', '前端', 'ui'] },
	{ label: '图形与动画', match: ['three', 'threejs', '3d', 'shader', '动画', '模型', 'blender', 'gpu'] },
	{ label: '工具与产品', match: ['工具', '开源', 'app', '需求', '项目', 'cursor'] },
	{ label: '工程笔记', match: ['测试', '性能', 'bug', 'git', 'pnpm', 'webpack', 'solidity', 'seo'] },
	{ label: '学习与总结', match: ['学习', '笔记', '总结', '记录'] },
	{ label: '日常与影像', match: ['日常', '旅游', '影评', '游戏'] }
]

const getCover = (item: BlogIndexItem): string | undefined => item.covers?.[0] || item.cover

const sortBlogsDesc = (list: BlogIndexItem[]) => [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const getMondayStart = (value: string | Date) => {
	const date = new Date(value)
	date.setHours(0, 0, 0, 0)
	const day = (date.getDay() + 6) % 7
	date.setDate(date.getDate() - day)
	return date
}

const getGroupCaption = (items: BlogIndexItem[]) => {
	const tags = Array.from(new Set(items.flatMap(item => item.tags || []).filter(Boolean))).slice(0, 4)
	return tags.length ? tags.map(tag => `#${tag}`).join('  ') : '暂无标签'
}

const buildTimeGroups = (items: BlogIndexItem[], mode: Exclude<DisplayMode, 'day' | 'category'>): ArchiveGroup[] => {
	const map = new Map<string, ArchiveGroup>()

	for (const item of sortBlogsDesc(items)) {
		const date = dayjs(item.date)
		let key = ''
		let label = ''
		let startTime = date.valueOf()

		if (mode === 'week') {
			const start = dayjs(getMondayStart(item.date))
			const end = start.add(6, 'day')
			key = start.format('YYYY-MM-DD')
			label = `${start.format('YYYY.MM.DD')} - ${end.format('MM.DD')}`
			startTime = start.valueOf()
		} else if (mode === 'month') {
			key = date.format('YYYY-MM')
			label = date.format('YYYY年 M月')
			startTime = date.startOf('month').valueOf()
		} else {
			key = date.format('YYYY')
			label = `${key} 年`
			startTime = date.startOf('year').valueOf()
		}

		const prev = map.get(key)
		if (prev) {
			prev.items.push(item)
			prev.caption = getGroupCaption(prev.items)
		} else {
			map.set(key, { key, label, caption: getGroupCaption([item]), items: [item], startTime })
		}
	}

	return Array.from(map.values()).sort((a, b) => b.startTime - a.startTime)
}

const buildCategoryNodes = (items: BlogIndexItem[], manualCategories: string[]): CategoryNode[] => {
	const sorted = sortBlogsDesc(items)
	const manualNames = Array.from(new Set([...manualCategories, ...sorted.map(item => item.category || '未分类')].filter(Boolean)))
	const manualChildren = manualNames.map(name => {
		const nodeItems = sorted.filter(item => (item.category || '未分类') === name)
		return { key: `category:${name}`, label: name, caption: `${nodeItems.length} 篇`, items: nodeItems }
	})

	const tagMap = new Map<string, BlogIndexItem[]>()
	for (const item of sorted) {
		for (const tag of item.tags || []) {
			if (!tagMap.has(tag)) tagMap.set(tag, [])
			tagMap.get(tag)!.push(item)
		}
	}
	const tagChildren = Array.from(tagMap.entries())
		.sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
		.map(([tag, nodeItems]) => ({ key: `tag:${tag}`, label: `#${tag}`, caption: `${nodeItems.length} 篇`, items: nodeItems }))

	const topicChildren = topicRules.map(rule => {
		const lowerMatches = rule.match.map(item => item.toLowerCase())
		const nodeItems = sorted.filter(item => {
			const haystack = [item.title, item.summary, item.category, ...(item.tags || [])].join(' ').toLowerCase()
			return lowerMatches.some(keyword => haystack.includes(keyword))
		})
		return { key: `topic:${rule.label}`, label: rule.label, caption: `${nodeItems.length} 篇`, items: nodeItems }
	})

	const uncategorizedTopicItems = sorted.filter(item => {
		const haystack = [item.title, item.summary, item.category, ...(item.tags || [])].join(' ').toLowerCase()
		return !topicRules.some(rule => rule.match.some(keyword => haystack.includes(keyword.toLowerCase())))
	})
	if (uncategorizedTopicItems.length > 0) {
		topicChildren.push({ key: 'topic:其他', label: '其他', caption: `${uncategorizedTopicItems.length} 篇`, items: uncategorizedTopicItems })
	}

	return [
		{ key: 'root:manual', label: '手动分类', caption: `${manualChildren.length} 组`, items: sorted, children: manualChildren },
		{ key: 'root:topic', label: '自动主题', caption: `${topicChildren.length} 组`, items: sorted, children: topicChildren },
		{ key: 'root:tag', label: '标签索引', caption: `${tagChildren.length} 个`, items: sorted, children: tagChildren }
	]
}

const buildDayBuckets = (items: BlogIndexItem[]) => {
	const map = new Map<string, BlogIndexItem[]>()
	for (const item of items) {
		const key = dayjs(item.date).format('YYYY-MM-DD')
		if (!map.has(key)) map.set(key, [])
		map.get(key)!.push(item)
	}
	for (const [key, value] of map.entries()) {
		map.set(key, sortBlogsDesc(value))
	}
	return map
}

const getHeatmapCells = (year: number, dayBuckets: Map<string, BlogIndexItem[]>) => {
	const start = dayjs(`${year}-01-01`)
	const end = dayjs(`${year}-12-31`)
	const startOffset = start.day()
	const days = Array.from({ length: startOffset }, () => null as null | { key: string; day: number; count: number })
	let cursor = start

	while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
		const key = cursor.format('YYYY-MM-DD')
		days.push({ key, day: cursor.date(), count: dayBuckets.get(key)?.length || 0 })
		cursor = cursor.add(1, 'day')
	}

	return days
}

export default function BlogPage() {
	const { items, loading } = useBlogIndex()
	const { categories: categoriesFromServer } = useCategories()
	const { isRead } = useReadArticles()
	const { isAuth, setPrivateKey } = useAuthStore()
	const { siteContent } = useConfigStore()
	const hideEditButton = siteContent.hideEditButton ?? false
	const enableCategories = siteContent.enableCategories ?? false

	const keyInputRef = useRef<HTMLInputElement>(null)
	const timelineScrollRef = useRef<HTMLDivElement>(null)
	const [editMode, setEditMode] = useState(false)
	const [editableItems, setEditableItems] = useState<BlogIndexItem[]>([])
	const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set())
	const [saving, setSaving] = useState(false)
	const [displayMode, setDisplayMode] = useState<DisplayMode>('year')
	const [categoryModalOpen, setCategoryModalOpen] = useState(false)
	const [categoryList, setCategoryList] = useState<string[]>([])
	const [newCategory, setNewCategory] = useState('')
	const [activeGroupKey, setActiveGroupKey] = useState<string>('')
	const [selectedDay, setSelectedDay] = useState<string>('')
	const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear())
	const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('')

	useEffect(() => {
		if (!editMode) {
			setEditableItems(items)
		}
	}, [items, editMode])

	useEffect(() => {
		setCategoryList(categoriesFromServer || [])
	}, [categoriesFromServer])

	const displayItems = editMode ? editableItems : items
	const sortedItems = useMemo(() => sortBlogsDesc(displayItems), [displayItems])
	const years = useMemo(() => Array.from(new Set(sortedItems.map(item => dayjs(item.date).year()))).sort((a, b) => b - a), [sortedItems])
	const dayBuckets = useMemo(() => buildDayBuckets(sortedItems), [sortedItems])
	const activeDayItems = useMemo(() => (selectedDay ? dayBuckets.get(selectedDay) || [] : []), [dayBuckets, selectedDay])
	const timeGroups = useMemo(
		() => (displayMode === 'week' || displayMode === 'month' || displayMode === 'year' ? buildTimeGroups(sortedItems, displayMode) : []),
		[displayMode, sortedItems]
	)
	const categoryNodes = useMemo(() => buildCategoryNodes(sortedItems, categoryList), [sortedItems, categoryList])
	const flatCategoryNodes = useMemo(() => categoryNodes.flatMap(node => [node, ...(node.children || [])]), [categoryNodes])
	const activeCategoryNode = useMemo(
		() => flatCategoryNodes.find(node => node.key === selectedCategoryKey) || flatCategoryNodes[0],
		[flatCategoryNodes, selectedCategoryKey]
	)

	useEffect(() => {
		if (years.length > 0 && !years.includes(selectedYear)) {
			setSelectedYear(years[0])
		}
	}, [selectedYear, years])

	useEffect(() => {
		if (!selectedDay && sortedItems[0]) {
			setSelectedDay(dayjs(sortedItems[0].date).format('YYYY-MM-DD'))
			setSelectedYear(dayjs(sortedItems[0].date).year())
		}
	}, [selectedDay, sortedItems])

	useEffect(() => {
		if (timeGroups.length > 0 && !timeGroups.some(group => group.key === activeGroupKey)) {
			setActiveGroupKey(timeGroups[0].key)
		}
	}, [activeGroupKey, timeGroups])

	useEffect(() => {
		if (flatCategoryNodes.length > 0 && !flatCategoryNodes.some(node => node.key === selectedCategoryKey)) {
			setSelectedCategoryKey(flatCategoryNodes[0].key)
		}
	}, [flatCategoryNodes, selectedCategoryKey])

	const activeGroup = timeGroups.find(group => group.key === activeGroupKey) || timeGroups[0]
	const selectedCount = selectedSlugs.size
	const buttonText = isAuth ? '保存' : '导入密钥'

	const toggleEditMode = useCallback(() => {
		if (editMode) {
			setEditMode(false)
			setEditableItems(items)
			setSelectedSlugs(new Set())
		} else {
			setEditableItems(items)
			setEditMode(true)
		}
	}, [editMode, items])

	const toggleSelect = useCallback((slug: string) => {
		setSelectedSlugs(prev => {
			const next = new Set(prev)
			if (next.has(slug)) {
				next.delete(slug)
			} else {
				next.add(slug)
			}
			return next
		})
	}, [])

	const handleSelectAll = useCallback(() => {
		setSelectedSlugs(new Set(editableItems.map(item => item.slug)))
	}, [editableItems])

	const handleDeselectAll = useCallback(() => {
		setSelectedSlugs(new Set())
	}, [])

	const handleSelectGroup = useCallback(
		(groupItems: BlogIndexItem[]) => {
			if (groupItems.length === 0) return
			const allSelected = groupItems.every(item => selectedSlugs.has(item.slug))
			setSelectedSlugs(prev => {
				const next = new Set(prev)
				for (const item of groupItems) {
					if (allSelected) {
						next.delete(item.slug)
					} else {
						next.add(item.slug)
					}
				}
				return next
			})
		},
		[selectedSlugs]
	)

	const handleItemClick = useCallback(
		(event: React.MouseEvent, slug: string) => {
			if (!editMode) return
			event.preventDefault()
			event.stopPropagation()
			toggleSelect(slug)
		},
		[editMode, toggleSelect]
	)

	const handleDeleteSelected = useCallback(() => {
		if (selectedCount === 0) {
			toast.info('请选择要删除的文章')
			return
		}
		setEditableItems(prev => prev.filter(item => !selectedSlugs.has(item.slug)))
		setSelectedSlugs(new Set())
	}, [selectedCount, selectedSlugs])

	const handleAssignCategory = useCallback((slug: string, category?: string) => {
		setEditableItems(prev =>
			prev.map(item => {
				if (item.slug !== slug) return item
				const nextCategory = category?.trim()
				if (!nextCategory) return { ...item, category: undefined }
				return { ...item, category: nextCategory }
			})
		)
	}, [])

	const handleAddCategory = useCallback(() => {
		const value = newCategory.trim()
		if (!value) {
			toast.info('请输入分类名称')
			return
		}
		setCategoryList(prev => (prev.includes(value) ? prev : [...prev, value]))
		setNewCategory('')
	}, [newCategory])

	const handleRemoveCategory = useCallback((category: string) => {
		setCategoryList(prev => prev.filter(item => item !== category))
		setEditableItems(prev => prev.map(item => (item.category === category ? { ...item, category: undefined } : item)))
	}, [])

	const handleReorderCategories = useCallback((nextList: string[]) => {
		setCategoryList(nextList)
	}, [])

	const handleCancel = useCallback(() => {
		setEditableItems(items)
		setSelectedSlugs(new Set())
		setEditMode(false)
	}, [items])

	const handleSave = useCallback(async () => {
		const removedSlugs = items.filter(item => !editableItems.some(editItem => editItem.slug === item.slug)).map(item => item.slug)
		const normalizedCategoryList = categoryList.map(c => c.trim()).filter(Boolean)
		const categoryListChanged = JSON.stringify(normalizedCategoryList) !== JSON.stringify((categoriesFromServer || []).map(c => c.trim()).filter(Boolean))
		const categoryAssignmentChanged = items.some(origin => {
			const next = editableItems.find(editItem => editItem.slug === origin.slug)
			const originCategory = origin.category || ''
			const nextCategory = next?.category || ''
			return originCategory !== nextCategory
		})
		const hasChanges = removedSlugs.length > 0 || categoryListChanged || categoryAssignmentChanged

		if (!hasChanges) {
			toast.info('没有需要保存的改动')
			return
		}

		try {
			setSaving(true)
			await saveBlogEdits(items, editableItems, normalizedCategoryList)
			setEditMode(false)
			setSelectedSlugs(new Set())
			setCategoryModalOpen(false)
		} catch (error: any) {
			console.error(error)
			toast.error(error?.message || '保存失败')
		} finally {
			setSaving(false)
		}
	}, [items, editableItems, categoryList, categoriesFromServer])

	const handleSaveClick = useCallback(() => {
		if (!isAuth) {
			keyInputRef.current?.click()
			return
		}
		void handleSave()
	}, [handleSave, isAuth])

	const handlePrivateKeySelection = useCallback(
		async (file: File) => {
			try {
				const pem = await readFileAsText(file)
				setPrivateKey(pem)
				toast.success('密钥导入成功，请再次点击保存')
			} catch (error) {
				console.error(error)
				toast.error('读取密钥失败')
			}
		},
		[setPrivateKey]
	)

	const handleTimelineWheel = useCallback(
		(event: React.WheelEvent<HTMLDivElement>) => {
			if (!activeGroup || timeGroups.length <= 1) return
			event.preventDefault()
			timelineScrollRef.current?.scrollBy({ top: event.deltaY * 0.65, behavior: 'smooth' })
			const index = timeGroups.findIndex(group => group.key === activeGroup.key)
			const nextIndex = Math.max(0, Math.min(timeGroups.length - 1, index + (event.deltaY > 0 ? 1 : -1)))
			setActiveGroupKey(timeGroups[nextIndex].key)
		},
		[activeGroup, timeGroups]
	)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!editMode && (e.ctrlKey || e.metaKey) && e.key === ',') {
				e.preventDefault()
				toggleEditMode()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [editMode, toggleEditMode])

	const rightTitle =
		displayMode === 'day' ? dayjs(selectedDay).format('YYYY年 M月 D日') : displayMode === 'category' ? activeCategoryNode?.label : activeGroup?.label
	const rightItems = displayMode === 'day' ? activeDayItems : displayMode === 'category' ? activeCategoryNode?.items || [] : activeGroup?.items || []
	const rightCaption =
		displayMode === 'day'
			? selectedDay
				? `${activeDayItems.length} 篇文章`
				: '选择一个有文章的日期'
			: displayMode === 'category'
				? activeCategoryNode?.caption
				: activeGroup?.caption

	return (
		<>
			<input
				ref={keyInputRef}
				type='file'
				accept='.pem'
				className='hidden'
				onChange={async e => {
					const f = e.target.files?.[0]
					if (f) await handlePrivateKeySelection(f)
					if (e.currentTarget) e.currentTarget.value = ''
				}}
			/>

			<div className='mx-auto flex min-h-[100dvh] w-full max-w-[1280px] flex-col gap-5 px-6 pt-24 pb-12 max-sm:px-4 max-sm:pt-24'>
				<header className='card static flex flex-wrap items-center justify-between gap-4 rounded-2xl px-4 py-3 backdrop-blur-xl'>
					<div>
						<div className='text-lg font-semibold'>文章时间线</div>
						<div className='text-secondary mt-1 text-xs'>{sortedItems.length} 篇文章按时间和主题重新编排</div>
					</div>

					<div className='flex flex-wrap items-center gap-2'>
						<div className='bg-card flex rounded-2xl border p-1'>
							{viewOptions
								.filter(option => option.value !== 'category' || enableCategories)
								.map(option => {
									const Icon = option.icon
									const active = displayMode === option.value
									return (
										<button
											key={option.value}
											type='button'
											onClick={() => setDisplayMode(option.value)}
											className={cn(
												'inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm transition-all active:scale-[0.98]',
												active ? 'bg-brand text-white shadow-sm' : 'text-secondary hover:text-brand hover:bg-white/60'
											)}>
											<Icon className='h-4 w-4' />
											{option.label}
										</button>
									)
								})}
						</div>

						<EditToolbar
							editMode={editMode}
							hideEditButton={hideEditButton}
							enableCategories={enableCategories}
							saving={saving}
							buttonText={buttonText}
							selectedCount={selectedCount}
							allSelected={selectedCount > 0 && selectedCount === editableItems.length}
							onToggleEditMode={toggleEditMode}
							onOpenCategory={() => setCategoryModalOpen(true)}
							onCancel={handleCancel}
							onSelectAll={handleSelectAll}
							onDeselectAll={handleDeselectAll}
							onDelete={handleDeleteSelected}
							onSave={handleSaveClick}
						/>
					</div>
				</header>

				{loading ? (
					<ArchiveSkeleton />
				) : sortedItems.length === 0 ? (
					<div className='card text-secondary static grid min-h-[360px] place-items-center rounded-3xl text-sm'>暂无文章</div>
				) : (
					<main className='grid min-h-[620px] grid-cols-[minmax(280px,0.42fr)_minmax(0,0.58fr)] gap-5 max-lg:grid-cols-1'>
						<aside className='card static overflow-hidden rounded-3xl p-0 backdrop-blur-xl'>
							<AnimatePresence mode='wait'>
								{displayMode === 'day' ? (
									<DayHeatmapPanel
										key='day'
										years={years}
										selectedYear={selectedYear}
										selectedDay={selectedDay}
										dayBuckets={dayBuckets}
										onYearChange={setSelectedYear}
										onDaySelect={day => {
											setSelectedDay(day)
											setSelectedYear(dayjs(day).year())
										}}
									/>
								) : displayMode === 'category' ? (
									<CategoryTreePanel key='category' nodes={categoryNodes} activeKey={selectedCategoryKey} onSelect={setSelectedCategoryKey} />
								) : (
									<TimelinePanel
										key={displayMode}
										groups={timeGroups}
										activeKey={activeGroup?.key}
										selectedSlugs={selectedSlugs}
										editMode={editMode}
										scrollRef={timelineScrollRef}
										onWheel={handleTimelineWheel}
										onSelect={setActiveGroupKey}
										onSelectGroup={handleSelectGroup}
									/>
								)}
							</AnimatePresence>
						</aside>

						<section className='card static overflow-hidden rounded-3xl p-0 backdrop-blur-xl'>
							<ArchiveContentPanel
								key={`${displayMode}:${rightTitle}`}
								title={rightTitle || '文章'}
								caption={rightCaption || ''}
								items={rightItems}
								editMode={editMode}
								selectedSlugs={selectedSlugs}
								onItemClick={handleItemClick}
								isRead={isRead}
								onSelectGroup={() => handleSelectGroup(rightItems)}
							/>
						</section>
					</main>
				)}

				{items.length > 0 && (
					<div className='text-center'>
						<motion.a
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.04 }}
							whileTap={{ scale: 0.98 }}
							href='https://juejin.cn/user/2427311675422382/posts'
							target='_blank'
							className='card text-secondary static inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs'>
							<JuejinSVG className='h-4 w-4' />
							更多
						</motion.a>
					</div>
				)}
			</div>

			<CategoryModal
				open={categoryModalOpen}
				onClose={() => setCategoryModalOpen(false)}
				categoryList={categoryList}
				newCategory={newCategory}
				onNewCategoryChange={setNewCategory}
				onAddCategory={handleAddCategory}
				onRemoveCategory={handleRemoveCategory}
				onReorderCategories={handleReorderCategories}
				editableItems={editableItems}
				onAssignCategory={handleAssignCategory}
			/>
		</>
	)
}

function EditToolbar({
	editMode,
	hideEditButton,
	enableCategories,
	saving,
	buttonText,
	selectedCount,
	allSelected,
	onToggleEditMode,
	onOpenCategory,
	onCancel,
	onSelectAll,
	onDeselectAll,
	onDelete,
	onSave
}: {
	editMode: boolean
	hideEditButton: boolean
	enableCategories: boolean
	saving: boolean
	buttonText: string
	selectedCount: number
	allSelected: boolean
	onToggleEditMode: () => void
	onOpenCategory: () => void
	onCancel: () => void
	onSelectAll: () => void
	onDeselectAll: () => void
	onDelete: () => void
	onSave: () => void
}) {
	if (!editMode) {
		if (hideEditButton) return null
		return (
			<motion.button
				whileHover={{ scale: 1.04 }}
				whileTap={{ scale: 0.98 }}
				onClick={onToggleEditMode}
				className='bg-card inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm backdrop-blur-sm transition-colors hover:bg-white/80'>
				<Pencil className='h-4 w-4' />
				编辑
			</motion.button>
		)
	}

	return (
		<div className='bg-card flex flex-wrap items-center gap-2 rounded-2xl border p-1'>
			{enableCategories && (
				<ToolbarButton onClick={onOpenCategory} disabled={saving}>
					分类
				</ToolbarButton>
			)}
			<ToolbarButton onClick={onCancel} disabled={saving}>
				取消
			</ToolbarButton>
			<ToolbarButton onClick={allSelected ? onDeselectAll : onSelectAll}>{allSelected ? '取消全选' : '全选'}</ToolbarButton>
			<ToolbarButton danger onClick={onDelete} disabled={selectedCount === 0}>
				<Trash2 className='h-4 w-4' />
				{selectedCount}
			</ToolbarButton>
			<motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} onClick={onSave} disabled={saving} className='brand-btn h-9 px-4 text-sm'>
				{saving ? '保存中...' : buttonText}
			</motion.button>
		</div>
	)
}

function ToolbarButton({ children, danger, disabled, onClick }: { children: React.ReactNode; danger?: boolean; disabled?: boolean; onClick: () => void }) {
	return (
		<motion.button
			whileHover={{ scale: disabled ? 1 : 1.04 }}
			whileTap={{ scale: disabled ? 1 : 0.98 }}
			onClick={onClick}
			disabled={disabled}
			className={cn(
				'inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-sm transition-colors disabled:opacity-50',
				danger ? 'border-red-200 bg-red-50 text-red-600' : 'bg-white/60 hover:bg-white/85'
			)}>
			{children}
		</motion.button>
	)
}

function DayHeatmapPanel({
	years,
	selectedYear,
	selectedDay,
	dayBuckets,
	onYearChange,
	onDaySelect
}: {
	years: number[]
	selectedYear: number
	selectedDay: string
	dayBuckets: Map<string, BlogIndexItem[]>
	onYearChange: (year: number) => void
	onDaySelect: (day: string) => void
}) {
	const cells = useMemo(() => getHeatmapCells(selectedYear, dayBuckets), [dayBuckets, selectedYear])

	return (
		<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className='flex h-full flex-col p-5'>
			<div className='mb-4 flex items-center justify-between gap-3'>
				<div>
					<div className='text-base font-semibold'>{selectedYear} 日历热力图</div>
					<div className='text-secondary mt-1 text-xs'>点击有颜色的日期查看当天文章</div>
				</div>
				<div className='flex gap-1'>
					{years.slice(0, 5).map(year => (
						<button
							key={year}
							type='button'
							onClick={() => onYearChange(year)}
							className={cn(
								'h-8 rounded-lg px-2 text-xs transition-colors',
								year === selectedYear ? 'bg-brand text-white' : 'text-secondary hover:text-brand bg-white/60'
							)}>
							{year}
						</button>
					))}
				</div>
			</div>

			<div className='rounded-2xl border bg-white/40 p-4'>
				<div className='text-secondary mb-3 grid grid-cols-7 text-center text-[11px]'>
					{['日', '一', '二', '三', '四', '五', '六'].map(label => (
						<span key={label}>{label}</span>
					))}
				</div>
				<div className='grid grid-cols-7 gap-1.5'>
					{cells.map((cell, index) => {
						if (!cell) return <div key={`empty-${index}`} className='aspect-square' />
						const active = cell.key === selectedDay
						const level = Math.min(4, cell.count)
						return (
							<button
								key={cell.key}
								type='button'
								onClick={() => cell.count > 0 && onDaySelect(cell.key)}
								title={`${cell.key} ${cell.count} 篇`}
								className={cn(
									'aspect-square rounded-[6px] border text-[10px] transition-all active:scale-[0.96]',
									cell.count === 0 && 'border-white/40 bg-white/30 text-transparent',
									level === 1 && 'border-brand/20 bg-brand/20 text-brand',
									level === 2 && 'border-brand/30 bg-brand/35 text-brand',
									level === 3 && 'border-brand/40 bg-brand/55 text-white',
									level >= 4 && 'border-brand bg-brand text-white',
									active && 'ring-brand ring-2 ring-offset-2 ring-offset-white/50'
								)}>
								{cell.count > 0 ? cell.day : ''}
							</button>
						)
					})}
				</div>
			</div>

			<div className='text-secondary mt-4 flex items-center gap-2 text-xs'>
				<span>少</span>
				<span className='h-3 w-3 rounded-[4px] bg-white/40'></span>
				<span className='bg-brand/20 h-3 w-3 rounded-[4px]'></span>
				<span className='bg-brand/40 h-3 w-3 rounded-[4px]'></span>
				<span className='bg-brand/70 h-3 w-3 rounded-[4px]'></span>
				<span className='bg-brand h-3 w-3 rounded-[4px]'></span>
				<span>多</span>
			</div>
		</motion.div>
	)
}

function TimelinePanel({
	groups,
	activeKey,
	selectedSlugs,
	editMode,
	scrollRef,
	onWheel,
	onSelect,
	onSelectGroup
}: {
	groups: ArchiveGroup[]
	activeKey?: string
	selectedSlugs: Set<string>
	editMode: boolean
	scrollRef: React.RefObject<HTMLDivElement | null>
	onWheel: (event: React.WheelEvent<HTMLDivElement>) => void
	onSelect: (key: string) => void
	onSelectGroup: (items: BlogIndexItem[]) => void
}) {
	return (
		<motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className='flex h-full flex-col'>
			<div className='border-b bg-white/25 p-5'>
				<div className='text-base font-semibold'>回忆时间轴</div>
				<div className='text-secondary mt-1 text-xs'>滚动左侧时间线，右侧内容会同步切换</div>
			</div>
			<div ref={scrollRef} onWheel={onWheel} className='scrollbar-none relative flex-1 overflow-y-auto p-5'>
				<div className='absolute top-5 bottom-5 left-[34px] w-px bg-gradient-to-b from-transparent via-[var(--color-brand)]/35 to-transparent' />
				<div className='space-y-3'>
					{groups.map(group => {
						const active = group.key === activeKey
						const groupAllSelected = group.items.length > 0 && group.items.every(item => selectedSlugs.has(item.slug))
						return (
							<button
								key={group.key}
								type='button'
								onClick={() => onSelect(group.key)}
								className={cn(
									'group relative flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all active:scale-[0.99]',
									active ? 'border-brand/45 bg-white/75 shadow-sm' : 'border-white/40 bg-white/35 hover:bg-white/60'
								)}>
								<span
									className={cn(
										'relative z-10 h-7 w-7 shrink-0 rounded-full border bg-white transition-all',
										active ? 'border-brand shadow-[0_0_0_6px_rgb(222_67_49_/_0.12)]' : 'border-white'
									)}
								/>
								<span className='min-w-0 flex-1'>
									<span className='block truncate text-sm font-semibold'>{group.label}</span>
									<span className='text-secondary mt-1 block truncate text-xs'>{group.caption}</span>
								</span>
								<span className='text-secondary rounded-full bg-white/70 px-2 py-1 text-xs'>{group.items.length}</span>
								{editMode && (
									<span
										onClick={event => {
											event.preventDefault()
											event.stopPropagation()
											onSelectGroup(group.items)
										}}
										className={cn(
											'grid h-6 w-6 place-items-center rounded-full border text-[10px]',
											groupAllSelected ? 'border-brand bg-brand text-white' : 'border-white bg-white/70 text-transparent'
										)}>
										<Check className='h-3 w-3' />
									</span>
								)}
							</button>
						)
					})}
				</div>
			</div>
		</motion.div>
	)
}

function CategoryTreePanel({ nodes, activeKey, onSelect }: { nodes: CategoryNode[]; activeKey: string; onSelect: (key: string) => void }) {
	return (
		<motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className='h-full overflow-y-auto p-5'>
			<div className='mb-4'>
				<div className='text-base font-semibold'>多维分类树</div>
				<div className='text-secondary mt-1 text-xs'>手动分类、标签和自动主题会共同参与筛选</div>
			</div>
			<div className='space-y-4'>
				{nodes.map(node => (
					<div key={node.key} className='rounded-2xl border bg-white/35 p-3'>
						<button
							type='button'
							onClick={() => onSelect(node.key)}
							className={cn(
								'flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition-colors',
								activeKey === node.key ? 'bg-brand text-white' : 'hover:bg-white/60'
							)}>
							<span className='font-medium'>{node.label}</span>
							<span className='text-xs opacity-75'>{node.caption}</span>
						</button>
						<div className='mt-2 space-y-1'>
							{node.children?.map(child => (
								<button
									key={child.key}
									type='button'
									onClick={() => onSelect(child.key)}
									className={cn(
										'flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition-colors',
										activeKey === child.key ? 'text-brand bg-white shadow-sm' : 'text-secondary hover:text-brand hover:bg-white/55'
									)}>
									<ChevronRight className='h-3.5 w-3.5' />
									<span className='min-w-0 flex-1 truncate'>{child.label}</span>
									<span className='text-xs'>{child.items.length}</span>
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</motion.div>
	)
}

function ArchiveContentPanel({
	title,
	caption,
	items,
	editMode,
	selectedSlugs,
	onItemClick,
	isRead,
	onSelectGroup
}: {
	title: string
	caption: string
	items: BlogIndexItem[]
	editMode: boolean
	selectedSlugs: Set<string>
	onItemClick: (event: React.MouseEvent, slug: string) => void
	isRead: (slug: string) => boolean
	onSelectGroup: () => void
}) {
	const allSelected = items.length > 0 && items.every(item => selectedSlugs.has(item.slug))

	return (
		<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='flex h-full flex-col'>
			<div className='flex items-start justify-between gap-4 border-b bg-white/25 p-5'>
				<div>
					<div className='text-xl font-semibold'>{title}</div>
					<div className='text-secondary mt-1 text-sm'>{caption}</div>
				</div>
				{editMode && (
					<button
						type='button'
						onClick={onSelectGroup}
						className={cn(
							'shrink-0 rounded-xl border px-3 py-2 text-xs transition-colors',
							allSelected ? 'border-brand/40 bg-brand/10 text-brand' : 'text-secondary hover:text-brand bg-white/60'
						)}>
						{allSelected ? '取消本组' : '选择本组'}
					</button>
				)}
			</div>

			<div className='scrollbar-none flex-1 overflow-y-auto p-5'>
				<AnimatePresence mode='popLayout'>
					{items.length > 0 ? (
						<motion.div key='list' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='grid gap-3'>
							{items.map((item, index) => (
								<ArticleRow
									key={item.slug}
									item={item}
									index={index}
									editMode={editMode}
									selected={selectedSlugs.has(item.slug)}
									read={isRead(item.slug)}
									onClick={onItemClick}
								/>
							))}
						</motion.div>
					) : (
						<motion.div
							key='empty'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							className='text-secondary grid min-h-[360px] place-items-center text-sm'>
							这里暂时没有文章
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	)
}

function ArticleRow({
	item,
	index,
	editMode,
	selected,
	read,
	onClick
}: {
	item: BlogIndexItem
	index: number
	editMode: boolean
	selected: boolean
	read: boolean
	onClick: (event: React.MouseEvent, slug: string) => void
}) {
	const cover = getCover(item)

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 14, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -8, scale: 0.98 }}
			transition={{ delay: Math.min(index * 0.025, 0.18) }}
			className={cn(
				'group relative rounded-2xl border transition-all',
				selected ? 'border-brand/60 bg-brand/5' : 'border-white/45 bg-white/45 hover:bg-white/70'
			)}>
			<Link href={`/blog/${item.slug}`} onClick={event => onClick(event, item.slug)} className='flex gap-3 p-3'>
				{editMode && (
					<span
						className={cn(
							'mt-5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]',
							selected ? 'border-brand bg-brand text-white' : 'border-white bg-white/70 text-transparent'
						)}>
						<Check className='h-3 w-3' />
					</span>
				)}

				{cover ? (
					<img src={cover} alt='' className='h-[82px] w-[112px] shrink-0 rounded-xl border object-cover max-sm:h-16 max-sm:w-20' />
				) : (
					<div className='grid h-[82px] w-[112px] shrink-0 place-items-center rounded-xl border bg-white/60 max-sm:h-16 max-sm:w-20'>
						<Tags className='text-secondary h-5 w-5' />
					</div>
				)}

				<div className='min-w-0 flex-1'>
					<div className='flex items-start justify-between gap-3'>
						<h3 className='group-hover:text-brand line-clamp-1 text-sm font-semibold transition-colors'>{item.title || item.slug}</h3>
						<span className='text-secondary shrink-0 text-xs'>{dayjs(item.date).format('YYYY.MM.DD')}</span>
					</div>
					{item.summary && <p className='text-secondary mt-1 line-clamp-2 text-xs leading-relaxed'>{item.summary}</p>}
					<div className='mt-2 flex flex-wrap items-center gap-1.5'>
						{read && <span className='text-secondary rounded-full bg-white/70 px-2 py-0.5 text-[11px]'>已阅读</span>}
						{item.category && <span className='bg-brand/10 text-brand rounded-full px-2 py-0.5 text-[11px]'>{item.category}</span>}
						{(item.tags || []).slice(0, 4).map(tag => (
							<span key={tag} className='text-secondary rounded-full bg-white/65 px-2 py-0.5 text-[11px]'>
								#{tag}
							</span>
						))}
					</div>
				</div>
			</Link>
		</motion.div>
	)
}

function ArchiveSkeleton() {
	return (
		<main className='grid min-h-[620px] grid-cols-[minmax(280px,0.42fr)_minmax(0,0.58fr)] gap-5 max-lg:grid-cols-1'>
			<div className='card static rounded-3xl p-5'>
				<div className='h-5 w-32 animate-pulse rounded-lg bg-white/60' />
				<div className='mt-5 space-y-3'>
					{Array.from({ length: 8 }).map((_, index) => (
						<div key={index} className='h-14 animate-pulse rounded-2xl bg-white/45' />
					))}
				</div>
			</div>
			<div className='card static rounded-3xl p-5'>
				<div className='h-6 w-40 animate-pulse rounded-lg bg-white/60' />
				<div className='mt-5 space-y-3'>
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index} className='h-[108px] animate-pulse rounded-2xl bg-white/45' />
					))}
				</div>
			</div>
		</main>
	)
}
