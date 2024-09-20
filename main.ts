/**
 * Provides basic blocks for Keyestudio joystick input.
 */
//% block="Joystick"
namespace keyestudioJoystick {

    // Configure thresholds here
    // Also can be overwritten by using blocks.
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
    //% weight=100
    //% X.defl=AnalogReadWritePin.P1
    //% Y.defl=AnalogReadWritePin.P0
    //% B.defl=DigitalPin.P2
    export function setInput(X: AnalogReadWritePin, Y: AnalogReadWritePin, B: DigitalPin): void {

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

    /**
     * Allow the threshold for each of the 4 directions to be overwritten.
     * @param direction The direction you want to modify
     */
    //% block = "override $direction to $amount"
    //% direction.defl=DirectionChoice.Up
    //% amount.min=0 amount.max=1023 amount.defl=511.5
    //% advanced=true
    export function overrideThreshold(direction: DirectionChoice, amount: number): void {
        switch (direction) {
            case DirectionChoice.Up:
                THRESHOLD.up = amount;
                break;
            case DirectionChoice.Down:
                THRESHOLD.down = amount;
                break;
            case DirectionChoice.Left:
                THRESHOLD.left = amount;
                break;
            case DirectionChoice.Right:
                THRESHOLD.right = amount;
                break;
        }
    }

    /**
     * Allows you to check the threshold for each direction
     * @param direction The direction you want to get the threshold for.
     */
    //% block = "get $direction threshold"
    //% advanced=true
    export function getThreshold(direction: DirectionChoice): number {
        switch (direction) {
            case DirectionChoice.Up: return THRESHOLD.up;
            case DirectionChoice.Down: return THRESHOLD.down;
            case DirectionChoice.Left: return THRESHOLD.left;
            case DirectionChoice.Right: return THRESHOLD.right;
        }
    }
}

enum DirectionChoice {
    Up,
    Down,
    Left,
    Right,
}