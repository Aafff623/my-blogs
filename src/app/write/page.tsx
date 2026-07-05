'use client'

import { useWriteStore } from './stores/write-store'
import { usePreviewStore } from './stores/preview-store'
import { WriteEditor } from './components/editor'
import { WriteSidebar } from './components/sidebar'
import { WriteActions } from './components/actions'
import { WritePreview } from './components/preview'
import { useEffect } from 'react'
import { getImageItemSrc } from './types'

export default function WritePage() {
	const { form, coverImages, reset } = useWriteStore()
	useEffect(() => reset(), [])
	const { isPreview, closePreview } = usePreviewStore()

	const coverPreviewUrls = coverImages.map(getImageItemSrc)

	return isPreview ? (
		<WritePreview form={form} coverPreviewUrls={coverPreviewUrls} onClose={closePreview} />
	) : (
		<>
			<div className='flex h-full justify-center gap-6 px-6 pt-24 pb-12'>
				<WriteEditor />
				<WriteSidebar />
			</div>

			<WriteActions />
		</>
	)
}
