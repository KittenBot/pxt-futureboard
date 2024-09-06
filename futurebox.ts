declare namespace pins {
    /**
     * Read `size` bytes from a 7-bit I2C `address`.
     */
    //% repeat.defl=0 shim=pins::i2cReadBuffer
    function i2cReadBuffer(address: int32, size: int32, repeat?: boolean): Buffer;

    /**
     * Write bytes to a 7-bit I2C `address`.
     */
    //% repeat.defl=0 shim=pins::i2cWriteBuffer
    function i2cWriteBuffer(address: int32, buf: Buffer, repeat?: boolean): int32;

    /**
     * Read the specified pin or connector as either 0 or 1
     * @param name pin to read from, eg: Port.P0
     */
    //% help=pins/digital-read-pin weight=30
    //% blockId=device_get_digital_pin block="digital read|pin %name" blockGap=8
    //% name.shadow=digital_pin shim=pins::digitalReadPin
    function digitalReadPin(name: int32): int32;

    /**
     * Set a pin or connector value to either 0 or 1.
     * @param name pin to write to, eg: Port.P0
     * @param value value to set on the pin, 1 eg,0
     */
    //% help=pins/digital-write-pin weight=29
    //% blockId=device_set_digital_pin block="digital write|pin %name|to %value"
    //% value.min=0 value.max=1
    //% name.shadow=digital_pin shim=pins::digitalWritePin
    function digitalWritePin(name: int32, value: int32): void;

    /**
     * Read the connector value as analog, that is, as a value comprised between 0 and 1023.
     * @param name pin to write to, eg: Port.P0
     */
    //% help=pins/analog-read-pin weight=25
    //% blockId=device_get_analog_pin block="analog read|pin %name" blockGap="8"
    //% name.shadow=analog_pin shim=pins::analogReadPin
    function analogReadPin(name: int32): int32;

    /**
     * Set the connector value as analog. Value must be comprised between 0 and 1023.
     * @param name pin name to write to, eg: Port.P0
     * @param value value to write to the pin between ``0`` and ``1023``. eg:1023,0
     */
    //% help=pins/analog-write-pin weight=24
    //% blockId=device_set_analog_pin block="analog write|pin %name|to %value" blockGap=8
    //% value.min=0 value.max=1023
    //% name.shadow=analog_pin shim=pins::analogWritePin
    function analogWritePin(name: int32, value: int32): void;

    /**
     * Configure the pull direction of of a pin.
     * @param name pin to set the pull mode on, eg: Port.P0
     * @param pull one of the mbed pull configurations, eg: PinPullMode.PullUp
     */
    //% help=pins/set-pull advanced=true
    //% blockId=device_set_pull block="set pull|pin %pin|to %pull"
    //% pin.shadow=digital_pin
    //% group="Pins"
    //% weight=15
    //% blockGap=8 shim=pins::setPull
    function setPull(name: int32, pull: PinPullMode): void;

    /**
     * Configure the pulse-width modulation (PWM) period of the analog output in microseconds.
     * If this pin is not configured as an analog output (using `analog write pin`), the operation has no effect.
     * @param name analog pin to set period to, eg: Port.P0
     * @param micros period in microseconds. eg:20000
     */
    //% help=pins/analog-set-period weight=23 blockGap=8
    //% blockId=device_set_analog_period block="analog set period|pin %pin|to (µs)%micros"
    //% pin.shadow=analog_pin shim=pins::analogSetPeriod
    function analogSetPeriod(name: int32, micros: int32): void;

    /**
     * Configure the IO pin as an analog/pwm output and set a pulse width. The period is 20 ms period and the pulse width is set based on the value given in **microseconds** or `1/1000` milliseconds.
     * @param name pin name
     * @param micros pulse duration in microseconds, eg:1500
     */
    //% help=pins/servo-set-pulse weight=19
    //% blockId=device_set_servo_pulse block="servo set pulse|pin %value|to (µs) %micros"
    //% value.shadow=analog_pin
    //% group="Servo" shim=pins::servoSetPulse
    function servoSetPulse(name: int32, micros: int32): void;

    /**
     * Return the duration of a pulse at a pin in microseconds.
     * @param name the pin which measures the pulse, eg: DigitalPin.P0
     * @param value the value of the pulse, eg: PulseValue.High
     * @param maximum duration in microseconds
     */
    //% blockId=pins__pulse_in" block="pulse in (µs)|pin %name|pulsed %value"
    //% weight=20 advanced=true
    //% help=pins/pulse-in
    //% name.shadow=digital_pin_shadow
    //% group="Pulse"
    //% weight=23
    //% blockGap=8 maxDuration.defl=2000000 shim=pins::pulseIn
    function pulseIn(name: int32, value: int32, maxDuration?: int32): int32;

}


declare namespace light {
    /**
     * Send a programmable light buffer to the specified digital pin
     * @param pin The pin that the lights are connected to
     * @param buf The buffer to send to the pin
     */
    //% shim=light::sendBuffer1
    function sendBuffer1(pin: number, buf: Buffer): void;
}


namespace pins {
    export function i2cReadNumber(address: number, format: NumberFormat, repeated?: boolean): number {
        const buf = pins.i2cReadBuffer(address, pins.sizeOf(format), repeated)
        if (!buf)
            return undefined
        return buf.getNumber(format, 0)
    }

    export function i2cWriteNumber(address: number, value: number, format?: NumberFormat, repeated?: boolean): void {
        if (format == undefined)
            format = NumberFormat.UInt8LE;
        const buf = control.createBuffer(pins.sizeOf(format))
        buf.setNumber(format, 0, value)
        pins.i2cWriteBuffer(address, buf, repeated)
    }

    export function i2cReadRegister(address: number, register: number, valueFormat?: NumberFormat): number {
        if (valueFormat === undefined)
            valueFormat = NumberFormat.UInt8LE;
        pins.i2cWriteNumber(address, register, NumberFormat.UInt8LE);
        return pins.i2cReadNumber(address, valueFormat);
    }

    export function i2cWriteRegister(address: number, register: number, value: number, valueFormat?: NumberFormat): void {
        if (valueFormat === undefined)
            valueFormat = NumberFormat.UInt8LE;
        const valueSize = pins.sizeOf(valueFormat);
        const buf = control.createBuffer(1 + valueSize);
        buf.setNumber(NumberFormat.UInt8LE, 0, register);
        buf.setNumber(valueFormat, 1, value);
        pins.i2cWriteBuffer(address, buf);
    }
}

//% icon="\uf2d0" color="#00a0a0"
namespace futureboard {
    export const isSim = control.deviceDalVersion() === 'sim'
    export const rgb = neopixel.create(3, 3, NeoPixelMode.RGB)
    export enum Port {
        //% block="P1"
        P1 = 4,
        //% block="P2"
        P2 = 5,
        //% block="P3"
        P3 = 7,
        //% block="P4"
        P4 = 6,
    }
    export enum Motor {
        //% block="M1"
        M1 = 1,
        //% block="M2"
        M2 = 2,
    }
    const DA213ADDR = 39

    export function initImu() {
        if (isSim) return;
        // init da213
        pins.i2cWriteRegister(DA213ADDR, 0x7f, 0x83)
        pins.i2cWriteRegister(DA213ADDR, 0x7f, 0x69)
        pins.i2cWriteRegister(DA213ADDR, 0x7f, 0xbd)
        let a = pins.i2cReadRegister(DA213ADDR, 0x8e)
        if (a == 0) {
            pins.i2cWriteRegister(DA213ADDR, 0x8e, 0x50)
        }
        pins.i2cWriteRegister(DA213ADDR, 0x0f, 0x40)
        pins.i2cWriteRegister(DA213ADDR, 0x20, 0x00)
        pins.i2cWriteRegister(DA213ADDR, 0x11, 0x34)
        pins.i2cWriteRegister(DA213ADDR, 0x10, 0x07)
        pins.i2cWriteRegister(DA213ADDR, 0x1a, 0x04)
        pins.i2cWriteRegister(DA213ADDR, 0x15, 0x04)
    }

    export function readImu() {
        if (isSim) return [0, 0, 0];
        pins.i2cWriteNumber(DA213ADDR, 0x02, NumberFormat.UInt8LE);
        let data = pins.i2cReadBuffer(DA213ADDR, 6);
        let x = data.getNumber(NumberFormat.Int16LE, 0)
        let y = data.getNumber(NumberFormat.Int16LE, 2)
        let z = data.getNumber(NumberFormat.Int16LE, 4)
        return [x, y, z]
    }

    //% blockId=futurebox_motor block="Motor %motor|speed %speed"
    //% speed.min=-255 speed.max=255
    export function motorRun(motor: Motor, speed: number) {
        let p1 = 14
        let p2 = 13
        if (motor == Motor.M2) {
            p1 = 47
            p2 = 21
        }
        if (speed >= 0) {
            analogWrite(p1, speed * 16) // 256 > 4096
            analogWrite(p2, 0)
        } else {
            analogWrite(p1, 0)
            analogWrite(p2, -speed * 16)
        }
    }

    //% blockId=futurebox_geekservo block="Servo %port|angle %angle"
    //% angle.min=0 angle.max=180
    export function geekServo(port: Port, angle: number) {
        let v_us = (angle - 90) * 20 / 3 + 1500
        servoPulse(port, v_us)
    }

    //% blockId=futurebox_digiread block="digital read|port %port"
    export function digiRead(port: Port): boolean {
        if (isSim) return false;
        return pins.digitalReadPin(port) == 1
    }

    //% blockId=futurebox_analogread block="analog read|port %port"
    export function analogRead(port: Port): number {
        if (isSim) return 0;
        return pins.analogReadPin(port)
    }

    //% blockId=futurebox_digiwrite block="digital write|port %port|to %value"
    //% value.min=0 value.max=1
    export function digiWrite(port: Port, value: number) {
        if (isSim) return;
        return pins.digitalWritePin(port, value)
    }

    //% blockId=futurebox_analogwrite block="analog write|port %port|to %value"
    //% value.min=0 value.max=1023
    export function analogWrite(port: Port, value: number) {
        if (isSim) return;
        return pins.analogWritePin(port, value)
    }

    //% blockId=futurebox_servopulse block="servo set pulse|port %port|to (µs) %value"
    //% advanced=true
    export function servoPulse(port: Port, value: number) {
        if (isSim) return;
        return pins.servoSetPulse(port, value)
    }

    //% blockId=futurebox_ultrasonic block="distance|port %port"
    //% value.min=0 value.max=1
    export function distance(port: Port): number {
        if (isSim) return 0;
        pins.digitalWritePin(port, 1)
        pause(1)
        pins.digitalWritePin(port, 0)
        return pins.pulseIn(port, 1)
    }

    export enum EnvType {
        //% block="Temperature(℃)"
        Temperature = 0,
        //% block="Humidity(%RH)"
        Humidity = 1
    }

    //% blockId=sugar_button block="(Button) pressed %pin "
    //% subcategory="sugar-digital" weight=99
    export function sugarButton(pin: Port): boolean {
        if (isSim) return true;
        //pins.setPull(pin, PinPullMode.PullUp)
        return pins.digitalReadPin(pin) == 0

    }

    //% blockId=sugar_tracker block="(Tracker) black dectected %pin"
    //% subcategory="sugar-digital" weight=98
    export function sugarTracker(pin: Port): boolean {
        if (isSim) return false;
        return pins.digitalReadPin(pin) == 1
    }

    //% blockId=sugar_hall block="(Hall) magnetic detected %pin"
    //% subcategory="sugar-digital" weight=97
    export function sugarHall(pin: Port): boolean {
        if (isSim) return true;
        return pins.digitalReadPin(pin) == 0
    }

    //% blockId=sugar_crash block="(Crash) crash detected %pin "
    //% subcategory="sugar-digital" weight=96
    export function sugarCrash(pin: Port): boolean {
        if (isSim) return false;
        return pins.digitalReadPin(pin) == 1
    }

    //% blockId=sugar_touch block="(Touch) touch detected %pin "
    //% subcategory="sugar-digital" weight=95
    export function sugarTouch(pin: Port): boolean {
        if (isSim) return false;
        return pins.digitalReadPin(pin) == 1
    }

    //% blockId=sugar_PIR block="(PIR) motion detected %pin"
    //% subcategory="sugar-digital" weight=94
    export function sugarPIR(pin: Port): boolean {
        if (isSim) return false;
        return pins.digitalReadPin(pin) == 1
    }

    //% blockId=sugar_flameDigi block="(Flame) fire Detected %pin "
    //% subcategory="sugar-digital" weight=93
    export function sugarFlameDigi(pin: Port): boolean {
        if (isSim) return false;
        return pins.digitalReadPin(pin) == 1
    }

    //% blockId=sugar_waterLevelDigi block="(WaterLevel) value %pin"
    //% subcategory="sugar-digital" weight=92
    export function sugarWaterLevelDigi(pin: Port): boolean {
        if (isSim) return false;
        return pins.digitalReadPin(pin) == 1
    }

    export enum LEDSta {
        //% block="OFF"
        Off = 0,
        //% block="ON"
        On = 1
    }

    export enum Switch {
        //% block="OFF"
        Off = 0,
        //% block="ON"
        On = 1
    }

    //% blockId=sugar_ledOnoff block="(LED) %pin| %onoff"
    //% subcategory="sugar-digital" weight=91
    export function sugarledOnoff(pin: Port, onoff: LEDSta) {
        if (isSim) return;
        pins.digitalWritePin(pin, onoff ? 1 : 0)
    }

    //% blockId=sugar_ledLuminent block="(LED) %pin| set brightness(0-1023) %value"
    //% value.min=0 value.max=1023 value.defl=0
    //% subcategory="sugar-digital" weight=90
    export function sugarLedLuminent(pin: Port, value: number) {
        if (isSim) return;
        pins.analogWritePin(pin, value)
    }

    //% blockId=sugar_stringLightsOnoff block="(String Lights) %pin| %onoff"
    //% subcategory="sugar-digital" weight=89
    export function sugarStringLightsOnoff(pin: Port, onoff: LEDSta) {
        if (isSim) return;
        pins.digitalWritePin(pin, onoff ? 1 : 0)
    }

    //% blockId=sugar_buzzer block="(Active Buzzer) %pin| sound %onoff"
    //% subcategory="sugar-digital" weight=88
    export function sugarBuzzer(pin: Port, onoff: Switch) {
        if (isSim) return;
        pins.digitalWritePin(pin, onoff ? 1 : 0)
    }

    //% blockId=sugar_laser block="(Laser) %pin| %onoff"
    //% subcategory="sugar-digital" weight=87
    export function sugarLaser(pin: Port, onoff: Switch) {
        if (isSim) return;
        pins.digitalWritePin(pin, onoff ? 1 : 0)
    }

    //% blockId=sugar_vibeMotor block="(Vibe Motor) %pin| %onoff"
    //% subcategory="sugar-digital" weight=86
    export function sugarVibeMotor(pin: Port, onoff: Switch) {
        if (isSim) return;
        pins.digitalWritePin(pin, onoff ? 1 : 0)
    }

    //% blockId=sugar_atomizer block="(Atomizer) %pin| %onoff"
    //% subcategory="sugar-digital" weight=85
    export function sugarAtomizer(pin: Port, onoff: Switch) {
        if (isSim) return;
        pins.digitalWritePin(pin, onoff ? 1 : 0)
    }

    //% blockId=sugar_flameAna block="(Flame) value %pin"
    //% subcategory="sugar-analog" weight=99
    export function sugarFlameAna(pin: Port): number {
        return pins.analogReadPin(pin)
    }
    //% blockId=sugar_angle block="(Angle) value %pin"
    //% subcategory="sugar-analog" weight=98
    export function sugarAngle(pin: Port): number {
        return pins.analogReadPin(pin)
    }
    //% blockId=sugar_audio block="(Audio) value %pin"
    //% subcategory="sugar-analog" weight=97
    export function sugaraudio(pin: Port): number {
        return pins.analogReadPin(pin)
    }
    //% blockId=sugar_light block="(Light) value %pin"
    //% subcategory="sugar-analog" weight=96
    export function sugarLight(pin: Port): number {
        return pins.analogReadPin(pin)
    }
    //% blockId=sugar_soilMoisture block="(SoilMoisture) value %pin"
    //% subcategory="sugar-analog" weight=95
    export function sugarSoilMoisture(pin: Port): number {
        return pins.analogReadPin(pin)
    }
    //% blockId=sugar_grayscale block="(Grayscale) value %pin"
    //% subcategory="sugar-analog" weight=94
    export function sugargrayscale(pin: Port): number {
        return pins.analogReadPin(pin)
    }
    //% blockId=sugar_waterLevelAna block="(WaterLevel) value %pin"
    //% subcategory="sugar-analog" weight=93
    export function sugarWaterLevelAna(pin: Port): number {
        return pins.analogReadPin(pin)
    }

    let sugarTempHumInit = false;
    let sugarTempHum: SugarTempHum;
    //% blockId=sugar_envReadData block="(ENV) get %env"
    //% subcategory="sugar-i2c" weight=99
    export function sugarEnvReadData(env: EnvType): number {

        if (!sugarTempHumInit) {
            sugarTempHum = new SugarTempHum()
            sugarTempHumInit = true
        }
        sugarTempHum.update()
        if (env) {
            return sugarTempHum.hum
        }
        return sugarTempHum.temp
    }

    export enum JoystickDir {
        pressed = 1,
        left = 0x10,
        right = 0x8,
        up = 0x4,
        down = 0x2
    }

    export enum DirType {
        X = 0,
        Y = 1
    }

    let sugarJoystickInit = false;
    let sugarJoystick: SugarJoyStick;
    //% blockId=sugar_joyState block="(Joystick) state %state triggered"
    //% subcategory="sugar-i2c" weight=98
    export function sugarJoyState(state: JoystickDir): boolean {
        if (!sugarJoystickInit) sugarJoystick = new SugarJoyStick();
        sugarJoystick.joyState()
        return sugarJoystick.sta == state
    }

    //% blockId=sugar_joyValue block="(Joystick) value %dir"
    //% subcategory="sugar-i2c" weight=97
    export function sugarJoyValue(dir: DirType): number {
        if (!sugarJoystickInit) sugarJoystick = new SugarJoyStick();
        sugarJoystick.joyValue()
        return dir === DirType.X ? sugarJoystick.coordX : sugarJoystick.coordY
    }

    let sugarTOFInit = false;
    let sugarTOF: SugarTOF;
    //% blockId=sugar_tofDistance block="(TOF Distance) distance(mm)"
    //% subcategory="sugar-i2c" weight=96
    export function sugarTofDistance(): number {
        if (!sugarTOFInit) sugarTOF = new SugarTOF();
        return sugarTOF.distance();
    }

    let sugarRFIDInit = false;
    let sugarRFID: SugarRFID;
    /**
     * read uid
     */
    //% blockId=sugar_rfidReadUid block="(RFID) read card uid"
    //% subcategory="sugar-i2c" weight=95
    export function sugarRfidReadUid(): string {
        if (!sugarRFIDInit) {
            sugarRFID = new SugarRFID()
            sugarRFIDInit = true
        }
        return sugarRFID.scanCar()
    }

    /**
     * write block
     */
    //% blockId=sugar_rfidWriteBlock block="(RFID) write block %blockAddress write %data"
    //% blockAddress.min=0 blockAddress.max=46
    //% subcategory="sugar-i2c" weight=94
    export function sugarRfidWriteBlock(blockAddress: number, data: string): void {
        if (!sugarRFIDInit) {
            sugarRFID = new SugarRFID()
            sugarRFIDInit = true
        }
        sugarRFID.writeBlock(blockAddress, data)
    }

    /**
     * read block
     */
    //% blockId=sugar_rfidReadBlock block="(RFID) read block %blockAddress"
    //% blockAddress.min=0 blockAddress.max=46
    //% subcategory="sugar-i2c" weight=93
    export function sugarRfidReadBlock(blockAddress: number): string {
        if (!sugarRFIDInit) {
            sugarRFID = new SugarRFID()
            sugarRFIDInit = true
        }
        return sugarRFID.readBlock(blockAddress)
    }

    let sugarDisplayInit = false;
    let sugarDisplay: SugarDisplay;
    //% blockId=sugar_displayOff block="(TM1650) turn off"
    //% subcategory="sugar-i2c" weight=92
    export function sugarDisplayOff() {
        if (!sugarDisplayInit) {
            sugarDisplay = new SugarDisplay()
            sugarDisplayInit = true
        }
        sugarDisplay.off()
    }

    //% blockId=sugar_displayOn block="(TM1650) turn on"
    //% subcategory="sugar-i2c" weight=91
    export function sugarDisplayOn() {
        if (!sugarDisplayInit) {
            sugarDisplay = new SugarDisplay()
            sugarDisplayInit = true
        }
        sugarDisplay.on()
    }

    /**
     * show a number in display
     * @param num is number will be shown, eg: 100
     */
    //% blockId=sugar_displayShowNumber block="(TM1650) show int %num"
    //% subcategory="sugar-i2c" weight=90
    export function sugarDisplayShowNumber(num: number) {
        if (!sugarDisplayInit) {
            sugarDisplay = new SugarDisplay()
            sugarDisplayInit = true
        }
        sugarDisplay.showNumber(num)
    }

    //% blockId=sugar_displayClear block="(TM1650) clear"
    //% subcategory="sugar-i2c" weight=89
    export function sugarDisplayClear() {
        if (!sugarDisplayInit) {
            sugarDisplay = new SugarDisplay()
            sugarDisplayInit = true
        }
        sugarDisplay.clear()
    }

    /**
     * show a digital in given position
     * @param digit is number (0-15) will be shown, eg: 1
     * @param bit is position, eg: 0
     */
    //% blockId=sugar_displayDigit block="(TM1650) show number %num|at %bit place"
    //% subcategory="sugar-i2c" weight=88
    //% num.max=15 num.min=0
    export function sugarDisplayDigit(num: number, bit: number) {
        if (!sugarDisplayInit) {
            sugarDisplay = new SugarDisplay()
            sugarDisplayInit = true
        }
        sugarDisplay.digit(num, bit)
    }
}
