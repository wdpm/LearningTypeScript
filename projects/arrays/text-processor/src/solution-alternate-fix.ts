export type AlignmentOptions = {
	align?: "left" | "middle" | "right";
	width: number;
};

export function alignTexts(texts: string[], options: AlignmentOptions) {
	return texts.map((text) =>
		alignLines(splitLines(text, options.width), options)
	);
}

function splitLines(text: string, width: number) {
	const lines: string[] = [];
	let line = "";

	for (const word of text.split(" ")) {
		if (line === "") {
			line = word;
		} else if (line.length + word.length < width) {
			line += ` ${word}`;
		} else {
			lines.push(line);
			line = word;
		}
	}

	lines.push(line);

	return lines;
}

const aligners = {
	left: (line: string, width: number) => line.padEnd(width),
	middle: (line: string, width: number) => {
		const remainingSpaces = width - line.length;

		return remainingSpaces
			? [
					// #3 use string.repeat method is more succinct, The result of Array.from() is weird on some test cases.
					// Array.from({ length: Math.floor(remainingSpaces / 2) }, () => " "),
					" ".repeat(Math.floor(remainingSpaces / 2)),
					line,
					// Array.from({ length: Math.ceil(remainingSpaces / 2) }, () => " ")
					" ".repeat(Math.ceil(remainingSpaces / 2)),
			  ].join("")
			: line;
	},
	right: (line: string, width: number) => line.padStart(width), // #1 should be padStart, not padEnd
};

function alignLines(
	lines: string[],
	{ align = "left", width }: AlignmentOptions
) {
	const aligner = aligners[align];
	// #2 original logic is wrong
	return lines.map((line, index, lines) => {
		return aligner(line, width);
	});
}
