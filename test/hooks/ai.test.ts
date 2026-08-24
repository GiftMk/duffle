import { describe, expect, it } from 'vitest'
import { isChatBusy } from '@/hooks/ai'

describe('isChatBusy', () => {
	it('is busy while submitted', () => {
		expect(isChatBusy('submitted')).toBe(true)
	})

	it('is busy while streaming', () => {
		expect(isChatBusy('streaming')).toBe(true)
	})

	it('is not busy once ready', () => {
		expect(isChatBusy('ready')).toBe(false)
	})

	it('is not busy on error', () => {
		expect(isChatBusy('error')).toBe(false)
	})
})
