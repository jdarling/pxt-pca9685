#include "MicroBit.h"
#include "PCA6985.h"

MicroBitI2C i2c = MicroBitI2C(I2C_SDA0, I2C_SCL0);

PCA9685::PCA9685 (char chipAddress) : chipAddress(chipAddress) {}

int PCA9685::calcFreqPrescaler(int freq){
    return (25000000 / (freq * chipResolution)) - 1;
}

void PCA9685::init(int freq){
    //char buff[]={register,data};
    write(modeRegister1, Sleep);
    
    int prescaler = calcFreqPrescaler(freq);
    write(PrescaleReg, prescaler);
    
    write(allChannelsOnStepLowByte, 0x00);
    write(allChannelsOnStepHighByte, 0x00);
    write(allChannelsOffStepLowByte, 0x00);
    write(allChannelsOffStepHighByte, 0x00);
    
    write(modeRegister1, wake);

    fiber_sleep(1000);
    write(modeRegister1, restart);
}

void PCA9685::setPinPulseRange(char pinNumber, char dutyCycle) {
    int offStep = (dutyCycle * (chipResolution - 1)) / 100;
    char pinOffset = PinRegDistance * pinNumber;

    // Low byte of offStep
    write(pinOffset + channel0OffStepLowByte, offStep & 0xFF);

    // High byte of offStep
    write(pinOffset + channel0OffStepHighByte, (offStep >> 8) & 0x0F);
}

void PCA9685::write(char Register, char Value) {
    this->chipAddress = chipAddress;
    char WriteBuffer[2];
    WriteBuffer[0] = Register;
    WriteBuffer[1] = Value;
    i2c.write(chipAddress * 2, WriteBuffer, 2, false);
}
