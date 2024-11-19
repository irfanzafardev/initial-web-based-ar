"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { DeepAR } from "deepar";

import LoadingSpinner from "./components/LoadingSpinner";
import ErrorAlert from "./components/ErrorAlert";
import InfoAlert from "./components/InfoAlert";
import QRCode from "./QRCode";

const DeepARDisplay = dynamic(() => import("./DeepARDisplay"), {
	ssr: false,
	loading: () => (
		<div className="w-full flex flex-col">
			<div className="w-full h-full min-h-[600px] bg-gray-900 flex items-center justify-center rounded-lg">
				<div className="text-white text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
					<p>Loading...</p>
				</div>
			</div>
		</div>
	),
});

type TDeepARClientProps = {
	state: {
		effectPath: string;
		licenseKey: string;
	};
};

export default function DeepARClient({ state }: TDeepARClientProps) {
	const [deepARInstance, setDeepARInstance] = React.useState<DeepAR | null>(null);
	const [showDeepARDisplay, setShowDeepARDisplay] = React.useState<boolean>(false);
	const [isCapturing, setIsCapturing] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string>("");

	const handleCapture = async () => {
		setError("");
		setIsCapturing(true);
		try {
			if (!deepARInstance) {
				throw new Error("Camera not initialized");
			}

			const screenshot = await deepARInstance.takeScreenshot();

			const link = document.createElement("a");
			link.href = screenshot;
			link.download = `capture_${Date.now()}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to capture");
		} finally {
			setIsCapturing(false);
		}
	};

	return (
		<div className="w-full flex flex-col gap-6">
			<div className="relative">
				<div className="deepar-diplay w-full min-h-[600px]">
					<DeepARDisplay effectPath={state.effectPath} licenseKey={state.licenseKey} onInitialized={setDeepARInstance} />
				</div>
				{!showDeepARDisplay && (
					<div className="absolute inset-0 flex items-center justify-center qr-code backdrop-opacity-10 backdrop-invert bg-black/60">
						<div className="w-fit h-fit bg-white rounded-lg p-6 ">
							<QRCode
								state={{
									text: "https://docs.google.com/forms/d/e/1FAIpQLSdbELKAsMbWJvBpcbrp8gZMTkp8Z5taxXnB8L-0tr9ydh1wMg/viewform",
									size: 150,
								}}
							/>
						</div>
					</div>
				)}
			</div>
			<div className="action-buttons w-full flex flex-col items-center gap-2">
				{showDeepARDisplay && (
					<button onClick={handleCapture} disabled={!deepARInstance || isCapturing} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center">
						{isCapturing && <LoadingSpinner />}
						{isCapturing ? "Capturing..." : "Capture"}
					</button>
				)}

				{error && <ErrorAlert state={{ error }} />}
				{!showDeepARDisplay && <InfoAlert state={{ info: "Please scan the QR above" }} />}
				{!showDeepARDisplay && (
					<button onClick={() => setShowDeepARDisplay(true)} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center">
						Lanjut
					</button>
				)}
			</div>
		</div>
	);
}
