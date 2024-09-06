const COMMAND_I2C_ADDRESS = 0x24
const DISPLAY_I2C_ADDRESS = 0x34
const _SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];
class SugarDisplay {
    _intensity: number;
    dbuf: number[];

    constructor() {
        this._intensity = 3
        this.dbuf = [0, 0, 0, 0]
        this.on()
        pins.i2cWriteNumber(0x24, 4|0x01, NumberFormat.Int8BE)
    }

    cmd(c: number) {
        pins.i2cWriteNumber(COMMAND_I2C_ADDRESS, c, NumberFormat.Int8BE)
    }

    dat(bit: number, d: number) {
        pins.i2cWriteNumber(DISPLAY_I2C_ADDRESS + (bit % 4), d, NumberFormat.Int8BE)
    }

    on() {
        this.cmd(this._intensity * 16 + 1)
    }

    off() {
        this._intensity = 0
        this.cmd(0)
    }

    clear() {
        this.dat(0, 0)
        this.dat(1, 0)
        this.dat(2, 0)
        this.dat(3, 0)
        this.dbuf = [0, 0, 0, 0]
    }

    digit(num: number, bit: number) {
        this.dbuf[bit % 4] = _SEG[num % 16]
        this.dat(bit, _SEG[num % 16])
    }

    showNumber(num: number) {
        if (num < 0) {
            this.dat(0, 0x40) // '-'
            num = -num
        }
        else {
            this.digit(Math.idiv(num, 1000) % 10, 0)
        }
        this.digit(num % 10, 3)
        this.digit(Math.idiv(num, 10) % 10, 2)
        this.digit(Math.idiv(num, 100) % 10, 1)
    }

    showHex(num: number) {
        if (num < 0) {
            this.dat(0, 0x40) // '-'
            num = -num
        } else {
            this.digit((num >> 12) % 16, 0)
        }
        this.digit(num % 16, 3)
        this.digit((num >> 4) % 16, 2)
        this.digit((num >> 8) % 16, 1)
    }

    showDpAt(show: boolean, bit: number) {
        if (show) this.dat(bit, this.dbuf[bit % 4] | 0x80)
        else this.dat(bit, this.dbuf[bit % 4] & 0x7F)
    }

    setIntensity(dat: number) {
        if ((dat < 0) || (dat > 8)){
            return;
        }
        if (dat == 0){
            this.off()
        }else {
            this._intensity = dat
            this.cmd((dat << 4) | 0x01)
        }
    }
}