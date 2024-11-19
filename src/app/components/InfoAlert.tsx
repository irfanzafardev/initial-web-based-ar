import React from "react";

type TInfoAlertProps = {
	state: {
		info: string;
	};
};

const InfoAlert: React.FC<TInfoAlertProps> = ({ state }) => {
	return (
		<div className="border rounded-lg p-4 bg-blue-50 flex items-start space-x-3">
			<div className="flex-shrink-0">
				<svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-.01M12 8h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
				</svg>
			</div>
			<div className="flex-1 text-sm text-blue-700">
				<p>{state.info}</p>
			</div>
		</div>
	);
};

export default InfoAlert;
