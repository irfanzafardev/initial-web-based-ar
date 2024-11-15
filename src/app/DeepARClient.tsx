"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { DeepAR } from "deepar";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorAlert from "./components/ErrorAlert";

const DeepARDisplay = dynamic(() => import("./DeepARDisplay"), {
	ssr: false,
	loading: () => (
		<div className="w-full h-full min-h-[300px] bg-gray-900 rounded-lg flex items-center justify-center">
			<div className="text-white text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
				<p>Loading...</p>
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
	const [deepARInstance, setDeepARInstance] = useState<DeepAR | null>(null);
	const [isCapturing, setIsCapturing] = useState(false);
	const [error, setError] = useState<string>("");

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
		<>
			<div className="w-full max-w-2xl mx-auto aspect-video">
				<DeepARDisplay effectPath={state.effectPath} licenseKey={state.licenseKey} onInitialized={setDeepARInstance} />
			</div>
			<div className="action-buttons w-full flex flex-col items-center gap-2">
				<button onClick={handleCapture} disabled={!deepARInstance || isCapturing} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center">
					{isCapturing && <LoadingSpinner />}
					{isCapturing ? "Capturing..." : "Capture"}
				</button>

				{error && <ErrorAlert state={{ error }} />}
			</div>
		</>
	);
}
