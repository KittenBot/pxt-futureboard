const AHT20_ADDR = 0x38

class SugarTempHum {

    temp: number;
    hum: number;


    constructor() {
        pins.i2cWriteBuffer(AHT20_ADDR, Buffer.fromArray([0xba]))
        basic.pause(50)
        pins.i2cWriteBuffer(AHT20_ADDR, Buffer.fromArray([0xa8, 0x00, 0x00]))
        basic.pause(350)
        pins.i2cWriteBuffer(AHT20_ADDR, Buffer.fromArray([0xe1, 0x28, 0x00]))
    }

    _aht20Ready() {
        let stat = pins.i2cReadNumber(AHT20_ADDR, NumberFormat.UInt8BE);
        while (stat & 0x80) {
            stat = pins.i2cReadNumber(AHT20_ADDR, NumberFormat.UInt8BE);
            basic.pause(100)
        }
        return true
    }

    update() {
        pins.i2cWriteBuffer(AHT20_ADDR, Buffer.fromArray([0xac, 0x33, 0x00]))
        if (this._aht20Ready()) {
            let n = pins.i2cReadBuffer(AHT20_ADDR, 6)
            let h = ((n[1] << 16) | (n[2] << 8) | (n[3])) >> 4
            this.hum = Math.floor((h * 0.000095) * 100) / 100
            let t = ((n[3] & 0x0f) << 16 | (n[4] << 8) | n[5])
            this.temp = Math.floor((t * 0.000191 - 50) * 100) / 100
        }
    }

}

const JOYSTICK_ADDR = 0x5c

class SugarJoyStick {

    sta: number;
    coordX: number;
    coordY: number;

    joyState(): void {
        pins.i2cWriteNumber(JOYSTICK_ADDR, 0x01, NumberFormat.UInt8BE);
        this.sta = pins.i2cReadBuffer(JOYSTICK_ADDR, 1)[0];
    }

    joyValue(): void {
        pins.i2cWriteNumber(JOYSTICK_ADDR, 2, NumberFormat.UInt8BE);
        const buf = pins.i2cReadBuffer(JOYSTICK_ADDR, 4);
        this.coordX = Math.round(buf.getNumber(NumberFormat.Int16LE, 0) * 255 / 2048 - 255)
        this.coordY = Math.round(buf.getNumber(NumberFormat.Int16LE, 2) * 255 / 2048 - 255)
    }

}