game.consoleOverlay.setVisible(true)

futureboard.initImu()
game.onUpdateInterval(500, function () {
    let [x, y, z] = futureboard.readImu()
    console.log("X: " + x + " Y: " + y + " Z: " + z)
})