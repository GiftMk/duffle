import type { LinkProps } from '@tanstack/react-router'
import { useState } from 'react'
import { signIn } from '@/lib/auth'

const safeCallback = (path: LinkProps['to']) => {
	return `${window.location.origin}${path}`
}

export const useGithubAuth = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSignIn = async ({
		successRoute,
		errorRoute,
	}: {
		successRoute: LinkProps['to']
		errorRoute: LinkProps['to']
	}) => {
		setLoading(true)
		setError(null)

		const { error: signInError } = await signIn.social({
			provider: 'github',
			callbackURL: safeCallback(successRoute),
			errorCallbackURL: safeCallback(errorRoute),
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
