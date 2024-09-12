
class SugarSolarPwr {
    onOff(state: number): void {
        pins.i2cWriteBuffer(37, Buffer.fromArray([0x03, state]))
    }

    batteryLevel(): number {
        pins.i2cWriteBuffer(37, Buffer.fromArray([0x02]))
        let data = pins.i2cReadBuffer(37, 4)
        let sign: boolean = !(data[3] & 0b10000000)
        let exponent = ((data[3] & 0b01111111) << 1) + (data[2] >> 7) - 127
        let significand = ((data[2] & 0b01111111) << 16) + ((data[1]) << 8) + data[0]
        let integerBit = 0
        let middle = 0b10000000000000000000000
        if (exponent > -1) {
            integerBit = (significand >> (23 - exponent)) + (1 << exponent)
            middle = middle >> exponent
        }
        let decimalBit = 0
        let decBit = 0
        let ex = 0
        significand = (0b11111111111111111111111 >> exponent) & significand
        for (let index = 0; index <= 23 - exponent; index++) {
            decBit -= 1
            if (significand & middle) {
                ex = 1
            } else {
                ex = 0
            }
            decimalBit += ex * 2 ** decBit
            middle = middle >> 1
        }
        return decimalBit + integerBit
    }

    getDate(date: number): number {
        pins.i2cWriteBuffer(37, Buffer.fromArray([0x06]))
        let data = pins.i2cReadBuffer(37, 6)
        return data[date]
    }

    setDate(y: number, month: number, d: number, h: number, minute: number, s: number): void {
        y = y % 100
        pins.i2cWriteBuffer(37, Buffer.fromArray([0x05,y,month,d,h,minute,s]))
    }

    setAlarm(h: number, minute: number, s: number): void {
        pins.i2cWriteBuffer(37, Buffer.fromArray([0x04,h,minute,s]))
    }
}
