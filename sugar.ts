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

const VL53L0X_ADDR = 0x5e;

class SugarTOF {
    constructor() {
        pins.i2cWriteBuffer(VL53L0X_ADDR, Buffer.fromArray([0x01]))
        control.waitMicros(50)
    }

    distance(): number {
        pins.i2cWriteNumber(VL53L0X_ADDR, 0x1, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(VL53L0X_ADDR, NumberFormat.UInt16LE);
    }

}

const PMSA003I_ADDR = 0X12

class SugarPMSA003I {

    dataList: number[];

    constructor() {
        this.dataList = [0, 0, 0, 0, 0, 0]
    }

    read():number[]{
        let data = pins.i2cReadBuffer(PMSA003I_ADDR,32)
        let verify_expect = (data[0x1e] << 8) | data[0x1f]
        let verify_actual = 0;
        let index = 0
        while(index<30){
            verify_actual+=data[index]
            index += 1
        }
        if (verify_expect == verify_actual){
            //PM1.0, PM2.5, PM10
            //CF = 1, 标准颗粒物
            this.dataList[0] = (data[0x04] << 8) | data[0x05]
            this.dataList[1] = (data[0x06] << 8) | data[0x07]
            this.dataList[2] = (data[0x08] << 8) | data[0x09]

            //PM1.0, PM2.5, PM10
            //大气环境下
            this.dataList[3] = (data[0x0a] << 8) | data[0x0b]
            this.dataList[4] = (data[0x0c] << 8) | data[0x0d]
            this.dataList[5] = (data[0x0e] << 8) | data[0x0f]
        } 
        return this.dataList
    }
}