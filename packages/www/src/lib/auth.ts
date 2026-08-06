import { createAuthClient } from 'better-auth/react'

const authClient = createAuthClient()

export const { signIn, signOut, signUp, useSession, getSession } = authClient

export const isAnonymous = async () => {
	const session = await getSession()
	return session.data?.user === undefined
}
