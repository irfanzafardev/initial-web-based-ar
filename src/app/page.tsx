import DeepARClient from "./DeepARClient";

export default function Home() {
	const key = process.env.NEXT_PUBLIC_LICENCE_KEY;

	return (
		<div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="h-full min-w-[384px] flex flex-col gap-8 items-center sm:items-start rounded-xl bg-white">
				<DeepARClient state={{ effectPath: "/effects/flower_face.deepar", licenseKey: key! }} />
			</main>
		</div>
	);
}
