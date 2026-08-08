import { useState } from 'react'
import { signIn } from '@/lib/auth'
import type { LinkProps } from '@tanstack/react-router'

const getCallbackUrl = (): string => {
	return document.referrer?.startsWith(window.location.origin)
		? document.referrer
		: safePath('/boards')
}

const safePath = (path: LinkProps['to']) => {
	return `${window.location.origin}/${path}`
}

const signInToGithub = () =>
	signIn.social({
		provider: 'github',
		callbackURL: getCallbackUrl(),
		errorCallbackURL: safePath('/login'),
	})

export const useAuth = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSignIn = async () => {
		setLoading(true)
		setError(null)

		const { error: signInError } = await signInToGithub()

		if (signInError) {
			setError(signInError.message ?? 'Something went wrong. Please try again.')
			setLoading(false)
		}
	}

	return {
		signIn: handleSignIn,
		loading,
		error,
	}
}
