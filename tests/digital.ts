let a = 0
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    pins.digitalWritePin(futureboard.Port.P1, a)
    if (a == 0) {
        a = 1
    } else {
        a = 0
    }
})


controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    let b = pins.digitalReadPin(futureboard.Port.P2)
    console.log("B: " + b)
})
