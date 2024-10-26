import Link from "next/link";

const Home = () => {
	return (
		<div className="py-[62px]">
			<Link href="/conversation">スタート！</Link>
			<div>Welcome!</div>
		</div>
	);
};

export default Home;
