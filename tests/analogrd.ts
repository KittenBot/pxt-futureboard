game.consoleOverlay.setVisible(true)
game.onUpdateInterval(500, function () {
    let a = futureboard.analogRead(futureboard.Port.P1)
    console.log("A: " + a)
})