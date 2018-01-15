let controller = PCA9685.chipAddress("0x40")
input.onButtonPressed(Button.A, () => {
    PCA9685.setServoPosition(PCA9685.ServoNum.Servo1, 0, controller)
    basic.showString("A")
})
input.onButtonPressed(Button.B, () => {
    PCA9685.setServoPosition(PCA9685.ServoNum.Servo1, 180, controller)
    basic.showString("B")
})
input.onButtonPressed(Button.AB, () => {
    PCA9685.setServoPosition(PCA9685.ServoNum.Servo1, 90, controller)
    basic.showString("C")
})
basic.showNumber(controller)
PCA9685.init(controller, 60)
