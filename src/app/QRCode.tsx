import React from "react";
import { QRCodeSVG } from "qrcode.react";

type TQRCodeProps = {
	state: {
		text: string;
		size?: number;
	};
};

const QRCode: React.FC<TQRCodeProps> = ({ state }) => {
	return (
		<div className="rounded-md bg-white">
			<QRCodeSVG value={state.text} size={state.size} />
		</div>
	);
};

export default QRCode;
