controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    let strip = futureboard.rgb
    strip.setPixelColor(0, 0xff0000)
    strip.setPixelColor(1, 0x00ff00)
    strip.setPixelColor(2, 0x0000ff)
    strip.show()
})
