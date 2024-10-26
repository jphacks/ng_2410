import { createClerkSupabaseClient, supabase } from "@/utils/supabase/client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const History = async () => {
	const { getToken, userId } = await auth();
	const token = await getToken({ template: "supabase" });
	if (!token) {
		console.log("no token");
		return <div>error</div>;
	}

	// TODO Refactor
	const client = createClerkSupabaseClient(token);
	const { data: sessions, error } = await client
		.from("conversation_session")
		.select("*")
		.eq("user_id", userId);
	if (error) {
		console.log("error");
		return <div>error</div>;
	}
	return (
		<div>
			{sessions.map((session: any) => {
				return (
					<div key={session.id}>
						<Link href={`/conversation/history/${session.id}`}>
							{session.id}
						</Link>
					</div>
				);
			})}
		</div>
	);
};

export default History;
