import type { LinkProps } from '@tanstack/react-router'
import { useState } from 'react'
import { signIn } from '@/lib/auth'

const safePath = (path: LinkProps['to']) => {
	return `${window.location.origin}/${path}`
}

const getCallbackUrl = (): string => {
	return document.referrer?.startsWith(window.location.origin)
		? document.referrer
		: safePath('/boards')
}

export const useGithubAuth = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSignIn = async () => {
		setLoading(true)
		setError(null)

		const { error: signInError } = await signIn.social({
			provider: 'github',
			callbackURL: getCallbackUrl(),
			errorCallbackURL: safePath('/login'),
		})

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
