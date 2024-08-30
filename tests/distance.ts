game.consoleOverlay.setVisible(true)

game.onUpdateInterval(500, function () {
    let d = futureboard.distance(futureboard.Port.P3)
    console.log("Distance: " + d)
})

