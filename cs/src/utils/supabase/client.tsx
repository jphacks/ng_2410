import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const createClerkSupabaseClient = (clerkToken: string) => {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			global: {
				// Get the custom Supabase token from Clerk
				fetch: async (url, options = {}) => {
					// Insert the Clerk Supabase token into the headers
					const headers = new Headers(options?.headers);
					headers.set("Authorization", `Bearer ${clerkToken}`);

					// Call the default fetch
					return fetch(url, {
						...options,
						headers,
					});
				},
			},
		},
	);
};
