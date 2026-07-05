'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useWriteStore } from '../../stores/write-store'
import { getImageItemSrc } from '../../types'
import { ImageCarousel } from '@/components/image-carousel'

type CoverSectionProps = {
	delay?: number
}

export function CoverSection({ delay = 0 }: CoverSectionProps) {
	const { images, coverImages, addCoverImage, removeCoverImage, addFiles } = useWriteStore()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const coverPreviewUrls = coverImages.map(getImageItemSrc)

	const handleCoverDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()

		// 处理从图片列表中拖入的情况
		const md = e.dataTransfer.getData('text/markdown') || e.dataTransfer.getData('text/plain') || ''
		const m = /!\[\]\(([^)]+)\)/.exec(md.trim())
		if (m) {
			const target = m[1]
			let foundItem

			if (target.startsWith('local-image:')) {
				const id = target.replace(/^local-image:/, '')
				foundItem = images.find(it => it.id === id)
			} else {
				foundItem = images.find(it => it.type === 'url' && it.url === target)
			}

			if (foundItem) {
				addCoverImage(foundItem)
				toast.success('已添加到封面轮播')

				return
			}
		}

		// 处理直接拖入文件的情况
		const files = e.dataTransfer.files
		if (files && files.length > 0) {
			const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
			if (imageFiles.length === 0) {
				toast.error('请拖入图片文件')
				return
			}

			const resultImages = await addFiles(imageFiles as unknown as FileList)
			if (resultImages && resultImages.length > 0) {
				resultImages.forEach(addCoverImage)
				toast.success('已添加到封面轮播')
			}
			return
		}
	}

	const handleClickUpload = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		const resultImages = await addFiles(files)
		if (resultImages && resultImages.length > 0) {
			resultImages.forEach(addCoverImage)
			toast.success('已添加到封面轮播')
		}

		// 重置 input 以便可以选择相同的文件
		e.target.value = ''
	}

	return (
		<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }} className='card relative'>
			<div className='flex items-center justify-between'>
				<h2 className='text-sm'>封面轮播</h2>
				<button type='button' className='text-secondary text-xs hover:underline' onClick={handleClickUpload}>
					添加图片
				</button>
			</div>
			<input ref={fileInputRef} type='file' accept='image/*' multiple className='hidden' onChange={handleFileChange} />
			<div
				className='bg-card mt-3 h-[150px] overflow-hidden rounded-xl border'
				onDragOver={e => {
					e.preventDefault()
				}}
				onDrop={handleCoverDrop}>
				{coverPreviewUrls.length > 0 ? (
					<ImageCarousel images={coverPreviewUrls} alt='cover preview' className='h-full w-full rounded-2xl' imageClassName='rounded-2xl' />
				) : (
					<div className='grid h-full w-full cursor-pointer place-items-center transition-colors hover:bg-white/60' onClick={handleClickUpload}>
						<span className='text-3xl leading-none text-neutral-400'>+</span>
					</div>
				)}
			</div>
			{coverImages.length > 0 && (
				<div className='mt-3 grid grid-cols-5 gap-2'>
					{coverImages.map((item, index) => (
						<div key={item.id} className='group relative aspect-square overflow-hidden rounded-lg border bg-white/50'>
							<img src={getImageItemSrc(item)} alt='cover thumbnail' className='h-full w-full object-cover' />
							<span className='bg-brand absolute top-1 left-1 rounded-full px-1.5 py-0.5 text-[10px] text-white shadow'>{index + 1}</span>
							<button
								type='button'
								className='text-secondary absolute top-1 right-1 hidden rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] shadow group-hover:block'
								onClick={() => removeCoverImage(item.id)}>
								删除
							</button>
						</div>
					))}
				</div>
			)}
		</motion.div>
	)
}
