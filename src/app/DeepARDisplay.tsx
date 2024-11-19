"use client";

import { useEffect, useRef, useState } from "react";
import type { DeepAR } from "deepar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let deepARModule: any = null;

type TDeepARDisplayProps = {
	effectPath: string;
	licenseKey: string;
	onInitialized?: (instance: DeepAR | null) => void;
};

const DeepARDisplay: React.FC<TDeepARDisplayProps> = ({ effectPath, licenseKey, onInitialized }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [permissionDenied, setPermissionDenied] = useState(false);
	const deepARInstance = useRef<DeepAR | null>(null);

	useEffect(() => {
		let mounted = true;
		let cleanup: (() => void) | undefined;

		const initializeDeepAR = async () => {
			if (!containerRef.current) return;

			try {
				if (!deepARModule) {
					const deeparImport = await import("deepar");
					deepARModule = deeparImport.default || deeparImport;
				}

				if (!mounted) return;

				const effectResponse = await fetch(effectPath);
				if (!effectResponse.ok) {
					throw new Error(`Effect file not found at ${effectPath}`);
				}

				deepARInstance.current = await deepARModule.initialize({
					licenseKey,
					previewElement: containerRef.current,
					effect: effectPath,
					additionalOptions: {
						cameraConfig: {
							disableDefaultCamera: true,
							facingMode: "user",
						},
					},
				});

				if (mounted) {
					await deepARInstance.current?.startCamera();
					setIsLoading(false);
					onInitialized?.(deepARInstance.current);
				}

				cleanup = () => {
					if (deepARInstance.current) {
						deepARInstance.current.shutdown();
						deepARInstance.current = null;
						onInitialized?.(null);
					}
				};
			} catch (err) {
				console.error("DeepAR initialization error:", err);
				if (!mounted) return;

				if (err instanceof Error) {
					if (err.message.includes("Permission denied") || err.message.includes("NotAllowedError")) {
						setPermissionDenied(true);
						setError("Camera access denied");
					} else if (err.message.includes("not found")) {
						setError("Effect file not found. Please check the path.");
					} else {
						setError(`Failed to initialize: ${err.message}`);
					}
				} else {
					setError("An unknown error occurred");
				}
				setIsLoading(false);
			}
		};

		const timer = setTimeout(() => {
			initializeDeepAR();
		}, 0);

		return () => {
			mounted = false;
			clearTimeout(timer);
			if (cleanup) cleanup();
		};
	}, [effectPath, licenseKey, onInitialized]);

	const handleRetry = async () => {
		setIsLoading(true);
		setError("");
		setPermissionDenied(false);

		if (deepARInstance.current) {
			await deepARInstance.current.shutdown();
			deepARInstance.current = null;
		}

		window.location.reload();
	};

	return (
		<div className="relative w-full min-h-[600px] bg-black rounded-t-xl overflow-hidden">
			<div ref={containerRef} className="w-full h-[600px]" />

			{isLoading && (
				<div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
					<div className="text-white text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
						<p>Initializing camera...</p>
					</div>
				</div>
			)}

			{error && !permissionDenied && (
				<div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white p-3 rounded-lg">
					<p className="text-sm">{error}</p>
					<button onClick={handleRetry} className="mt-2 px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30 transition-colors">
						Retry
					</button>
				</div>
			)}
		</div>
	);
};

export default DeepARDisplay;
