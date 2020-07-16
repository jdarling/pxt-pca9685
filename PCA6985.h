class PCA9685 {
    public:
    PCA9685 (char chipAddress);
    
    static const int chipResolution = 4096;
    static const char PrescaleReg = 0xFE; //the prescale register address
    static const char modeRegister1 = 0x00; // MODE1
    static const char modeRegister2 = 0x01; // MODE2
    static const char Sleep = 0x11; // Set sleep bit to 1
    static const char wake = 0x01; // Set sleep bit to 0
    static const char restart = 0x81; // Set restart bit to 1
    static const char allChannelsOnStepLowByte = 0xFA; // ALL_LED_ON_L
    static const char allChannelsOnStepHighByte = 0xFB; // ALL_LED_ON_H
    static const char allChannelsOffStepLowByte = 0xFC; // ALL_LED_OFF_L
    static const char allChannelsOffStepHighByte = 0xFD; // ALL_LED_OFF_H
    static const char PinRegDistance = 4;
    static const char channel0OffStepLowByte = 0x08; // LED0_OFF_L
    static const char channel0OffStepHighByte = 0x09; // LED0_OFF_H
    
    void init(int freq);
    void setPinPulseRange(char pinNumber, char dutyCycle);
    
    private:
    char chipAddress;
    int calcFreqPrescaler(int freq);
    void write(char Register, char Value);
};