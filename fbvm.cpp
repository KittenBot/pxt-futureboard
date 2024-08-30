// just dummy cpp function to make the compiler happy

/** Microbit like io operations */

namespace pins {
    //%
    Buffer i2cReadBuffer(int address, int size, bool repeat = false) {

    }

    //%
    int i2cWriteBuffer(int address, Buffer buf, bool repeat = false) {
    }

    //%
    int digitalReadPin(int name) {
    }

    //%
    void digitalWritePin(int name, int value) {
    }

    //%
    int analogReadPin(int name) {
    }

    //%
    void analogWritePin(int name, int value) {
    }

    //%
    void servoSetPulse(int name, int micros) {
    }

    //%
    void setPull(int name, PinPullMode pull) {
    }

    //%
    int pulseIn(int name, int pulse, int maxDuration = 2000000) {
    }

}

namespace light {
    //%
    void sendBuffer1(int pin, Buffer buf){
    }
}
