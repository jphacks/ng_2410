import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
	messages: z.array(
		z.object({
			text: z.string().nullable(),
			role: z.string().max(20).nullable(),
		}),
	),
});

export const POST = async (req: NextRequest, res: NextResponse) => {
	const body = await req.json();
	const { messages } = schema.parse(body);
	const { getToken } = await auth();
	const token = await getToken();
	if (!token) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}
	return Response.json({
		message:
			"とてもいいですね！話を広げる質問をしています．とてもいいですね！話を広げる質問をしています．とてもいいですね！話を広げる質問をしています．とてもいいですね！話を広げる質問をしています．",
	});
};
