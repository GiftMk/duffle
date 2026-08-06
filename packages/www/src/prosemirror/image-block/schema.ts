import { $nodeSchema } from '@milkdown/utils'

export const IMAGE_BLOCK_DATA_TYPE = 'image-block'

export const imageBlockSchema = $nodeSchema('image-block', () => ({
	inline: false,
	group: 'block',
	atom: true,
	selectable: true,
	draggable: true,
	isolating: true,
	marks: '',
	attrs: {
		src: { default: '', validate: 'string' },
		caption: { default: '', validate: 'string' },
	},
	parseDOM: [
		{
			tag: `img[data-type="${IMAGE_BLOCK_DATA_TYPE}"]`,
			// Beats commonmark's generic img[src] rule (default 50) on paste.
			priority: 100,
			getAttrs: (dom) => {
				if (!(dom instanceof HTMLElement)) return false

				return {
					src: dom.getAttribute('src') || '',
					caption: dom.getAttribute('data-caption') || '',
				}
			},
		},
	],
	toDOM: (node) => [
		'img',
		{
			'data-type': IMAGE_BLOCK_DATA_TYPE,
			src: node.attrs.src,
			alt: node.attrs.caption,
			'data-caption': node.attrs.caption,
		},
	],
	parseMarkdown: {
		match: ({ type }) => type === 'image-block',
		runner: (state, node, type) => {
			const src = node.url as string
			const caption = (node.alt as string) || (node.title as string) || ''

			state.addNode(type, { src, caption })
		},
	},
	toMarkdown: {
		match: (node) => node.type.name === 'image-block',
		runner: (state, node) => {
			state.openNode('paragraph')
			state.addNode('image', undefined, undefined, {
				url: node.attrs.src,
				alt: node.attrs.caption,
			})
			state.closeNode()
		},
	},
}))
