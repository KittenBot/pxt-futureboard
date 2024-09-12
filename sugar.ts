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

enum EnvTypeII {
    //% block="Pressure(hPa)"
    Pressure = 0,
    //% block="Altitude(m)"
    Altitude = 1,
    //% block="Temp(℃)"
    CTemp = 2,
    //% block="Temp(℉)"
    FTemp = 3
}

//self.i2c address of the device
const HP203B_ADDRESS = 0x76

//ADC_CVT(HP203B_ADC_CVT, 3 - bit OSR, 2 - bit CHNL)

//HP203B Command Set
const HP203B_SOFT_RST = 0x06          //Soft reset the device
const HP203B_ADC_CVT = 0x40           //Perform ADC conversion
const HP203B_READ_PT = 0x10           //Read the temperature and pressure values
const HP203B_READ_AT = 0x11           //Read the temperature and altitude values
const HP203B_READ_P = 0x30            //Read the pressure value only
const HP203B_READ_A = 0x31            //Read the altitude value only
const HP203B_READ_T = 0x32            //Read the temperature value only
const HP203B_ANA_CAL = 0x28           //Re - calibrate the internal analog blocks
const HP203B_READ_REG = 0x80          //Read out the control registers
const HP203B_WRITE_REG = 0xC0         //Write in the control registers


//OSR Configuration
const HP203B_OSR_4096 = 0x00                // Conversion time: 4.1ms
const HP203B_OSR_2048 = 0x04                // Conversion time: 8.2ms
const HP203B_OSR_1024 = 0x08                // Conversion time: 16.4ms
const HP203B_OSR_512 = 0xC0                 // Conversion time: 32.8ms
const HP203B_OSR_256 = 0x10                 // Conversion time: 65.6ms
const HP203B_OSR_128 = 0x14                 // Conversion time: 131.1ms

const HP203B_CH_PRESSTEMP = 0x00                  // Sensor Pressure and Temperature Channel
const HP203B_CH_TEMP = 0x02                       // Temperature Channel

class SugarTempHumII {

    i2cwrite(addr: number, reg: number, value: number[]) {
        let a = [reg]
        if (value.length)
            a = a.concat(value)
        return pins.i2cWriteBuffer(addr, Buffer.fromArray(a))
    }

    i2cread(addr: number, reg: number, size: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadBuffer(addr, size);
    }

    envUpdate() {
        const CNVRSN_CONFIG = Buffer.fromArray([HP203B_ADC_CVT | HP203B_OSR_1024 | HP203B_CH_PRESSTEMP])
        pins.i2cWriteBuffer(HP203B_ADDRESS, CNVRSN_CONFIG)
    }

    envGetData(pin: EnvTypeII): number {
        let presData = this.i2cread(HP203B_ADDRESS, HP203B_READ_P, 3)
        let pressure = (((presData[0] & 0x0F) * 65536) + (presData[1] * 256) + presData[2]) / 100.00

        let tempData = this.i2cread(HP203B_ADDRESS, HP203B_READ_T, 3)
        let cTemp = (((tempData[0] & 0x0F) * 65536) + (tempData[1] * 256) + tempData[2]) / 100.00
        const fTemp = (cTemp * 1.8) + 32

        let altData = this.i2cread(HP203B_ADDRESS, HP203B_READ_A, 3)
        let altitude = (((altData[0] & 0x0F) << 16) + (altData[1] << 8) + altData[2]) / 100.00

        if (pin === EnvTypeII.Pressure) {
            return pressure
        } else if (pin === EnvTypeII.Altitude) {
            return altitude
        } else if (pin === EnvTypeII.CTemp) {
            return cTemp
        } else {
            return fTemp
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

    read(): number[] {
        let data = pins.i2cReadBuffer(PMSA003I_ADDR, 32)
        let verify_expect = (data[0x1e] << 8) | data[0x1f]
        let verify_actual = 0;
        let index = 0
        while (index < 30) {
            verify_actual += data[index]
            index += 1
        }
        if (verify_expect == verify_actual) {
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