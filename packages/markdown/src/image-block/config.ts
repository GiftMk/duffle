import { $ctx } from '@milkdown/utils'
import { uploadImageAsDataUri } from './upload'

export interface ImageBlockConfig {
	onUpload: (file: File) => Promise<string>
}

export const defaultImageBlockConfig: ImageBlockConfig = {
	onUpload: uploadImageAsDataUri,
}

export const imageBlockConfig = $ctx(
	defaultImageBlockConfig,
	'imageBlockConfigCtx',
)
