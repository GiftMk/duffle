import type { LanguageDescription, LanguageSupport } from '@codemirror/language'

export type LanguageRecord = {
	id: string
	name: string
}

export class LanguageRepository {
	private readonly map: Map<string, LanguageDescription> = new Map()

	constructor(languages: LanguageDescription[]) {
		for (const language of languages) {
			for (const alias of language.alias) {
				if (alias === language.name.toLowerCase()) {
					this.map.set(alias, language)
				}
			}
		}
	}

	getExtensions(id: string): Promise<LanguageSupport | undefined> {
		const language = this.getDescriptionById(id)

		if (!language) {
			return Promise.resolve(undefined)
		}

		if (language.support) {
			return Promise.resolve(language.support)
		}

		return language.load()
	}

	get records(): LanguageRecord[] {
		return [...this.map.entries()].map((entry) => ({
			id: entry[0],
			name: entry[1].name,
		}))
	}

	getRecordById(id: string): LanguageRecord | undefined {
		const description = this.map.get(id)

		if (!description) {
			return
		}

		return {
			id,
			name: description.name,
		}
	}

	getDescriptionById(id: string): LanguageDescription | undefined {
		return this.map.get(id)
	}
}
