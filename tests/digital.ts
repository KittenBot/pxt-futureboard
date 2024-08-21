let a = 0
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    futureboard.digiWrite(futureboard.Port.P1, a)
    if (a == 0) {
        a = 1
    } else {
        a = 0
    }
})


controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    let b = futureboard.digiRead(futureboard.Port.P2)
    console.log("B: " + b)
})
