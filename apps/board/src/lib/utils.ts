export const onNextTick = (callback: () => void) => {
	return setTimeout(callback, 0)
}
