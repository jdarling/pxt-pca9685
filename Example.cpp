#include "MicroBit.h"
#include "PCA6985.h"

MicroBitDisplay display;

int main() {
    //PCA9685 Name(I2C adress)
    PCA9685 LedController1(128);
    LedController1.init(1500);
    while(1){
        LedController1.setPinPulseRange(15, 100);
        display.print("1");
        fiber_sleep(5000);
        LedController1.setPinPulseRange(15, 0);
        display.print("0");
        fiber_sleep(5000);
    }
}