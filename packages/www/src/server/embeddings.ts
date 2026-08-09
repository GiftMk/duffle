import OpenAI from 'openai'
import { env } from '@/env'

let client: OpenAI | undefined

const getClient = () => {
	client ??= new OpenAI({ apiKey: env.OPENAI_API_KEY })
	return client
}

export const EMBEDDING_DIMENSIONS = 512

export const embed = async (text: string): Promise<number[]> => {
	const result = await getClient().embeddings.create({
		model: 'text-embedding-3-small',
		input: text,
		dimensions: EMBEDDING_DIMENSIONS,
	})
	const embedding = result.data[0]?.embedding
	if (!embedding) {
		throw new Error('OpenAI returned no embedding')
	}
	return embedding
}

export const generateEmbedding = async (
	title: string,
	content: string | null | undefined,
): Promise<number[]> => embed(`${title}\n${content ?? ''}`)
