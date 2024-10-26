import { createClerkSupabaseClient } from "@/utils/supabase/client";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const GET = async () => {
	const { getToken, userId } = await auth();
	const token = await getToken({ template: "supabase" });
	if (!token) {
		console.error("no token");
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}
	const client = createClerkSupabaseClient(token);

	const { data, error } = await client
		.from("conversation_session")
		.insert({ user_id: userId })
		.select("id")
		.single();
	if (error) {
		console.error(error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
	return redirect(`/conversation/${data.id}`);
};
