let a = 0
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    a += 512
    if (a > 4096) {
        a = 0
    }
    console.log("Value: " + a)
    pins.analogWritePin(futureboard.Port.P1, a)
})


controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    a -= 512
    if (a < 0) {
        a = 4096
    }
    console.log("Value: " + a)
    pins.analogWritePin(futureboard.Port.P1, a)
})
