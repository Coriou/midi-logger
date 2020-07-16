import React, { useEffect, useState } from "react"
import useMidi from "react-midi-hook"

const frenchNotes = {
	A: "la",
	B: "si",
	C: "do",
	D: "ré",
	E: "mi",
	F: "fa",
	G: "sol",
}

export default () => {
	// Looking at you Safari
	if (!navigator.requestMIDIAccess)
		return (
			<div>
				<p style={{ color: "#e74c3c" }}>
					Your browser doesn't support the MIDIAccess API
				</p>
				<p>Try using Chrome, Edge or Opera</p>
				<p>
					<a href="https://caniuse.com/#feat=midi">Supported browsers</a>
				</p>
			</div>
		)

	const { pressedKeys, event } = useMidi()
	const [keysPressed, setKeypressed] = useState([])

	useEffect(() => {
		if (Array.isArray(pressedKeys) && pressedKeys.length)
			setKeypressed([pressedKeys[0], ...keysPressed])
	}, [pressedKeys])

	const toFR = letter => frenchNotes[letter.replace(/#$/, "")]
	const toMIDI = position => position + 21

	const Event = ({ keyPressed, event }) => {
		if (!keyPressed) return null

		const fr = toFR(keyPressed.letter)

		return (
			<>
				<h4>Values:</h4>
				<ul>
					<li>
						<b>MIDI</b>: {toMIDI(keyPressed.position)}
					</li>
					<li>
						<b>Velocity</b>: {keyPressed.velocity} (
						{parseFloat((keyPressed.velocity / 127) * 100).toFixed(0)}%)
					</li>
					<li>
						<b>Note</b>: {keyPressed.letter}
					</li>
					<li>
						{fr && (
							<>
								<b>Note (fr)</b>: {fr}
							</>
						)}
					</li>
					<li>
						<b>Octave</b>: {keyPressed.octave}
					</li>
					<li>
						<b>Keyboard position</b>: {keyPressed.position}
					</li>
				</ul>
				<hr />
				<p>Last event: {event.type}</p>
			</>
		)
	}

	const Log = () => {
		if (!keysPressed || !Array.isArray(keysPressed) || keysPressed.length <= 1)
			return null

		return (
			<>
				<h3>Previously played:</h3>
				<pre style={{ maxHeight: 250, overflowY: "scroll", overflowX: "none" }}>
					{keysPressed
						.slice(1)
						.map(k => `${toMIDI(k.position)} (${k.letter} - ${toFR(k.letter)})`)
						.join("\n")}
				</pre>
			</>
		)
	}

	return (
		<div>
			<h1 style={{ marginBottom: 0 }}>MIDI</h1>
			<h3 style={{ margin: 0 }}>Plug a MIDI keyboard and go</h3>
			<Event keyPressed={keysPressed[0]} event={event} />
			<Log />
		</div>
	)
}
