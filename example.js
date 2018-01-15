/**
 * Creates a basic serial terminal that can be used to control
 * a PCA9685 on address hex_0x40
 *
 * Commands Available:
 *   s|servo <number> <degrees> - Set servo number (1-16) to degrees.
 *   s|servo <number> - Show the configuration values of servo number (1-16).
 *   p|pin <number> <onTime> <offTime> - Set pin number (0-15) to an onTime (0-4096) and offTime (0-4096).
 *   l|led <number> <dutyCycle> - Set LED number (1-16) on pin to dutyCycle (0-100).
 *   i|init <freq> - Reset the PCA9685 to freq.
 *   f|reset - Reset the micro:bit and PCA9685.
 *   h|help - Show this help screen.
 */
let source = ""
function showHelp()  {
    serial.writeLine("Commands:")
    serial.writeLine("  s|servo <number> <degrees> - Set servo number (1-16) to degrees.")
    serial.writeLine("  s|servo <number> - Show the configuration values of servo number (1-16).")
    serial.writeLine("  p|pin <number> <onTime> <offTime> - Set pin number (0-15) to an onTime (0-4096) and offTime (0-4096).")
    serial.writeLine("  l|led <number> <dutyCycle> - Set LED number (1-16) on pin to dutyCycle (0-100).")
    serial.writeLine("  i|init <freq> - Reset the PCA9685 to freq.")
    serial.writeLine("  f|reset - Reset the micro:bit and PCA9685.")
    serial.writeLine("  h|help - Show this help screen.")
}
serial.onDataReceived('\r\n', () => {
    basic.showIcon(IconNames.Surprised)
    source = serial.readUntil('\r\n')
    const parts = parse(source)
const chip = PCA9685.getChipConfig(controller)
const freq = chip.freq;
switch (parts[0]) {
        case ('servo'):
        case ('s'):
            const servoNum: number = parseInt(parts[1])
            const position: number = parseInt(parts[2])
            if (parts.length == 2) {
                showServoConfig(servoNum)
                break
            }
            if (parts.length < 3) {
                return serial.writeLine("Must supply a servo number and degree to set to.")
            }
            moveServoTo(servoNum, position);
            break
        case ('pin'):
        case ('p'):
            const pinNum: number = parseInt(parts[1])
            const onTime: number = parseInt(parts[2])
            const offTime: number = parseInt(parts[3])
            if (parts.length < 4) {
                return serial.writeLine("Must supply a pin number, onTime, and offTime.")
            }
            PCA9685.setPinPulseRange(pinNum, onTime, offTime, controller)
            break
        case ('led'):
        case ('l'):
            const ledNum: number = parseInt(parts[1])
            const dutyCycle: number = parseInt(parts[2])
            if (parts.length < 3) {
                return serial.writeLine("Must supply a pin number and dutyCycle.")
            }
            PCA9685.setLedDutyCycle(ledNum, dutyCycle, controller)
            break
        case ('init'):
        case ('i'):
            if (parts.length < 2) {
                return serial.writeLine("Must supply a frequency to init to.")
            }
            const newFreq: number = parseInt(parts[1])
            PCA9685.init(newFreq)
            break
        case ('reset'):
        case ('r'):
            PCA9685.init(freq)
            break
        case ('help'):
        case ('h'):
            showHelp()
            break
        default:
            basic.showIcon(IconNames.Confused)
            return serial.writeLine('Unknown "' + parts[0] + '".')
    }
basic.showIcon(IconNames.Yes)
    return serial.writeLine('Ok')
})
let asciiNum = ""
let controller = 0
function moveServoTo(servoNum: number, degrees: number): void {
    if ((servoNum > 16) || (servoNum < 1)) {
        return serial.writeLine(`Invalid: Servo number ${servoNum}. Servos are 1-indexed. Servos can be between 1-16.`)
    }
    if ((degrees > 180) || (degrees < 0)) {
        return serial.writeLine(`Invalid servo position on ${servoNum} must be 0-180.`)
    }
    serial.writeLine(`Moving servo ${servoNum} to ${degrees}.`)
    return PCA9685.setServoPosition(servoNum, degrees, controller)
}
function parse(src: string): string[] {
    let res2: string[] = [];
    const m: number = src.length;
    let part: string = '';
    for (let j: number = 0; j < m; j++) {
        const c = src.charAt(j)
        if (isAsciiNum(c)) {
            part = part + c
            continue
        }
        if (part !== '' && part !== ' ') {
            res2.push(part)
        }
        part = ''
    }
    if (part !== '') {
        res2.push(part)
    }
    return res2
}
function showServoConfig(servoNumber: number): void{
    const chip2 = PCA9685.getChipConfig(controller)
    const servo = chip2.servos[servoNumber-1]
    const params = servo.config()

    for (let k = 0; k < params.length; k = k + 2) {
        serial.writeLine(`Servo[${servoNumber}].${params[k]}: ${params[k + 1]}`)
    }
}
controller = PCA9685.chipAddress("0x40")
PCA9685.init(controller, 60)
asciiNum = "abcdefghijklmnopqrstuvwxyz0123456789_-"
function asciiNumsToArray(asciiNum: string): string[]{
    const l: number = asciiNum.length
    const res: string[] = []
    for (let i: number = 0; i < l; i++) {
        res.push(asciiNum.charAt(i))
    }
    return res
}
const aAN: string[] = asciiNumsToArray(asciiNum)
const isAsciiNum = (c: string): boolean => {
    return aAN.indexOf(c) > -1
}
