import type { Node } from '@milkdown/kit/transformer'
import { $remark } from '@milkdown/utils'
import { visit } from 'unist-util-visit'

function promoteStandaloneImages(ast: Node) {
	visit(
		ast,
		'paragraph',
		(
			node: Node & { children?: Node[] },
			index: number,
			parent: Node & { children: Node[] },
		) => {
			if (node.children?.length !== 1) {
				return
			}

			const image = node.children[0]
			if (!image || image.type !== 'image') {
				return
			}

			const { url, alt, title } = image as Node & {
				url: string
				alt: string
				title: string
			}

			parent.children.splice(index, 1, {
				type: 'image-block',
				url,
				alt,
				title,
			} as Node)
		},
	)
}

export const remarkImageBlockPlugin = $remark(
	'remark-image-block',
	() => () => promoteStandaloneImages,
)
