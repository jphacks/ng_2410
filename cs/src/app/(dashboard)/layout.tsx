import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const user = await currentUser();
	return (
		<>
			<div className="w-full border-b px-5 absolute z-10">
				<div className="flex justify-between items-center h-[62px]">
					<Link href="/" className="font-bold">
						モットーーク
					</Link>
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Avatar>
									<AvatarImage src={user.imageUrl} />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>
									{user.lastName} {user.firstName}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Link href="/conversation/history">会話履歴</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<SignOutButton />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button asChild>
							<Link href="/sign-in">Sign in</Link>
						</Button>
					)}
				</div>
			</div>
			{children}
		</>
	);
};

export default Layout;
