export type BlogIndexItem = {
	slug: string
	title: string
	tags: string[]
	date: string
	summary?: string
	cover?: string
	covers?: string[]
	hidden?: boolean
	category?: string
}

export type BlogConfig = {
	title?: string
	tags?: string[]
	date?: string
	summary?: string
	cover?: string
	covers?: string[]
	hidden?: boolean
	category?: string
}
