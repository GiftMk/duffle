import type { LanguageDescription, LanguageSupport } from '@codemirror/language'

export type LanguageRecord = {
	id: string
	name: string
}

export class LanguageCollection {
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

	getExtensionsAysnc(id: string): Promise<LanguageSupport | undefined> {
		const language = this.getById(id)

		if (!language) {
			return Promise.resolve(undefined)
		}

		if (language.support) {
			return Promise.resolve(language.support)
		}

		return language.load()
	}

	get values(): LanguageRecord[] {
		return [...this.map.entries()].map((entry) => ({
			id: entry[0],
			name: entry[1].name,
		}))
	}

	getById(id: string): LanguageDescription | undefined {
		return this.map.get(id)
	}

	getByName(name: string): LanguageDescription | undefined {
		return [...this.map.entries()].find(
			(entry) => entry[0] === name.toLowerCase(),
		)?.[1]
	}
}
