'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type ImageCarouselProps = {
	images: Array<string | undefined | null>
	alt?: string
	intervalMs?: number
	className?: string
	imageClassName?: string
	showDots?: boolean
	onClick?: () => void
}

export function ImageCarousel({ images, alt = 'carousel image', intervalMs = 4500, className, imageClassName, showDots = true, onClick }: ImageCarouselProps) {
	const normalizedImages = useMemo(() => {
		const seen = new Set<string>()
		return images.filter((src): src is string => {
			if (!src || seen.has(src)) return false
			seen.add(src)
			return true
		})
	}, [images])

	const [activeIndex, setActiveIndex] = useState(0)

	useEffect(() => {
		setActiveIndex(0)
	}, [normalizedImages.join('|')])

	useEffect(() => {
		if (normalizedImages.length <= 1) return

		const timer = window.setInterval(() => {
			setActiveIndex(index => (index + 1) % normalizedImages.length)
		}, intervalMs)

		return () => {
			window.clearInterval(timer)
		}
	}, [intervalMs, normalizedImages.length])

	if (normalizedImages.length === 0) return null

	return (
		<div className={cn('relative overflow-hidden', onClick && 'cursor-pointer', className)} onClick={onClick}>
			{normalizedImages.map((src, index) => (
				<img
					key={src}
					src={src}
					alt={alt}
					draggable={false}
					className={cn(
						'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out',
						index === activeIndex ? 'opacity-100' : 'opacity-0',
						imageClassName
					)}
				/>
			))}
			{showDots && normalizedImages.length > 1 && (
				<div className='pointer-events-none absolute right-2 bottom-2 left-2 flex justify-center gap-1'>
					{normalizedImages.map((src, index) => (
						<span key={src} className={cn('h-1.5 rounded-full bg-white/80 shadow transition-all', index === activeIndex ? 'w-4' : 'w-1.5 opacity-70')} />
					))}
				</div>
			)}
		</div>
	)
}
