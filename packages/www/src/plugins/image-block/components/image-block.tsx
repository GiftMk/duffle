import { useNodeViewContext } from '@prosemirror-adapter/react'
import type { ImageBlockConfig } from '../config'
import { ImageUpload } from './image-upload'
import { ImageViewer } from './image-viewer'

// Factory so config is captured once at setup, in index.tsx's $view closure.
export const createImageBlock = (config: ImageBlockConfig) => {
	const ImageBlock = () => {
		const { node, setAttrs, selected } = useNodeViewContext()
		const src: string = node.attrs.src
		const caption: string = node.attrs.caption

		if (!src) {
			return (
				<ImageUpload
					onUpload={config.onUpload}
					onConfirm={(uploadedSrc) => setAttrs({ src: uploadedSrc })}
				/>
			)
		}

		return (
			<ImageViewer
				src={src}
				caption={caption}
				selected={selected}
				onCaptionChange={(nextCaption) => setAttrs({ caption: nextCaption })}
				onRemove={() => setAttrs({ src: '', caption: '' })}
			/>
		)
	}

	return ImageBlock
}
