/**
 * Provides basic blocks for Keyestudio joystick input.
 */
//% block="Joystick"
namespace keyestudioJoystick {
    const THRESHOLD = {
        up: 625,
        down: 175,
        left: 175,
        right: 625,
    }

    // Saves pins to read from
    let X_pin: AnalogReadWritePin | null = null;
    let Y_pin: AnalogReadWritePin | null = null;
    let B_pin: DigitalPin | null = null;

    /**
     * Sets the pins to check for input for X, Y and B.
     * @param X Pin for left and right movement.
     * @param Y Pin for up and down movement.
     * @param B Pin for when joystick is pressed.
     */
    //% blockId=readJoystickInput
    //% block="read at X: $X, Y: $Y, B: $B"
    export function setInput(X: AnalogReadWritePin, Y: AnalogReadWritePin, B: DigitalPin): void {
        // Block default values
        X |= AnalogReadWritePin.P1;
        Y |= AnalogReadWritePin.P0;
        B |= DigitalPin.P2;

        // Saves the pins to get values from in the future.
        X_pin = X;
        Y_pin = Y;
        B_pin = B;
    }

    /**
     * Outputs the current state of the joystick to serial.
     */
    //% block="input to serial"
    export function inputToSerial(): void {
        const {x, y, b} = getValues()
        serial.writeValue("X", x);
        serial.writeValue("Y", y);
        serial.writeValue("B", b);
    }

    /**
     * Outputs the current direction of the joystick to serial.
     */
    //% block="direction to serial"
    export function directionToSerial(): void {
        serial.writeLine(checkJoystickDirection())
    }

    /**
     * Outputs the current direction to the LEDs.
     */
    //% block="direction to LEDs"
    export function directionToLEDs(): void {
        const direction = checkJoystickDirection();
        switch (direction) {
            case "Up":
                basic.showArrow(ArrowNames.North);
                break;
            case "Down":
                basic.showArrow(ArrowNames.South);
                break;
            case "Left":
                basic.showArrow(ArrowNames.West);
                break;
            case "Right":
                basic.showArrow(ArrowNames.East);
                break;
            default:
                basic.showIcon(IconNames.No)
        }
    }

    /**
     * Check if pins were defined.
     */
    //% block="check pins defined"
    export function checkPinsDefined(): boolean {
        if (X_pin === null || Y_pin === null || B_pin === null) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Check the direction that the joystick is pointing. If the joystick is not pointing in any direction, return "None".
     */
    //% block="check joystick direction"
    export function checkJoystickDirection(): string {
        const {x, y} = getValues();
        if (y > THRESHOLD.up) {
            return "Up";
        } else if (y < THRESHOLD.down) {
            return "Down";
        } else if (x < THRESHOLD.left) {
            return "Left";
        } else if (x > THRESHOLD.right) {
            return "Right";
        } else {
            return "None"
        }
    }

    /**
     * Check if the joystick is being pressed.
     */
    //% block = "check pressed"
    export function checkPressed(): boolean {
        const {b} = getValues();
        if (b === 1) {
            return true;
        } else {
            return false;
        }
    }

    // Get pin data
    interface JoystickData {
        x: number,
        y: number,
        b: number,
    }
    function getValues(): JoystickData {
        return {
            x: pins.analogReadPin(X_pin),
            y: pins.analogReadPin(Y_pin),
            b: pins.digitalReadPin(B_pin),
        }
    }
}