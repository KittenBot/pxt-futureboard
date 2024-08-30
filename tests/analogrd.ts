game.consoleOverlay.setVisible(true)
game.onUpdateInterval(500, function () {
    let a = futureboard.analogRead(futureboard.Port.P1)
    let b = futureboard.analogRead(futureboard.Port.P2)
    console.log("A: " + a + " B: " + b)
})