import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
	return (
		<div className="py-[62px]">
			<Button asChild>
				<Link href="/conversation">スタート！</Link>
			</Button>
		</div>
	);
};

export default Home;
