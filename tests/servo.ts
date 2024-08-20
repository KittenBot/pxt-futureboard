let a = 0

function degreeToPulse(degree: number): number {
    let _microsec = Math.map(degree, 0, 180, 500, 2500)
    console.log("Pulse: " + _microsec)
    return _microsec
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    a += 5
    if (a > 180) {
        a = 180
    }
    console.log("Value: " + a)
    pins.servoSetPulse(futureboard.Port.P1, degreeToPulse(a))
})


controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    a -= 5
    if (a < 0) {
        a = 0
    }
    console.log("Value: " + a)
    pins.servoSetPulse(futureboard.Port.P1, degreeToPulse(a))
})
