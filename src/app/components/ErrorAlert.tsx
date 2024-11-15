import React from "react";

type TErrorAlertProps = {
	state: {
		error: string;
	};
};

const ErrorAlert: React.FC<TErrorAlertProps> = ({ state }) => {
	return (
		<div role="alert" className="rounded border-s-4 my-5 p-4 border-red-500 bg-red-50  dark:border-red-600 dark:bg-red-900">
			<strong className="block font-medium text-red-800 dark:text-red-100"> Something went wrong </strong>

			<p className="mt-2 text-sm text-red-700 dark:text-red-200">{state.error}</p>
		</div>
	);
};

export default ErrorAlert;
