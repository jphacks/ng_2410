// hooks/useSupabaseClient.js
import { useEffect, useMemo, useRef } from 'react'
import { useSession } from '@clerk/nextjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function useSupabaseClient() {
    const { session, isLoaded } = useSession()
    const client = useRef<SupabaseClient | null>(null)

    useEffect(() => {
        if (!session) {
            return
        }

        if (client.current) {
            return
        }

        client.current = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    fetch: async (url, options = {}) => {
                        const clerkToken = await session.getToken({
                            template: 'supabase',
                        })

                        const headers = new Headers(options?.headers)
                        headers.set('Authorization', `Bearer ${clerkToken}`)

                        return fetch(url, {
                            ...options,
                            headers,
                        })
                    },
                },
            },
        )
    }, [session, isLoaded])

    if (!isLoaded) {
        return { client: null, isLoaded, session }
    }

    if (!session) {
        return { client: null, isLoaded, session }
    }

    return { client: client.current, isLoaded, session }
}
