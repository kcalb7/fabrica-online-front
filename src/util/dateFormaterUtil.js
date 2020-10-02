const formatDate = (datetime, form = false) => {
	const datefull = new Date(datetime);
	let date = [];
	date.push(
		datefull
			.getUTCDate()
			.toString()
			.padStart(2, "0")
	);
	date.push((datefull.getUTCMonth() + 1).toString().padStart(2, "0"));
	date.push(datefull.getUTCFullYear());
	return form ? date.reverse().join("-") : date.join("/");
};

export default formatDate;
