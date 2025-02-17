import board
import busio

from adafruit_pn532.adafruit_pn532 import MIFARE_CMD_AUTH_B
from adafruit_pn532.i2c import PN532_I2C

def read_nfc():

    i2c = busio.I2C(board.SCL, board.SDA)

    pn532 = PN532_I2C(i2c, debug=False)


    ic, ver, rev, support = pn532.firmware_version
    print("Found PN532 with firmware version: {0}.{1}".format(ver, rev))

    pn532.SAM_configuration()
    print("Waiting for RFID/NFC card...")
    while True:
        # Check if a card is available to read
        uid = pn532.read_passive_target(timeout=0.5)
        print(".", end="")
        # Try again if no card is available.
        if uid is None:
            continue
        print("UID:", uid)
        result = ""
        for i in uid:
            result += str(i)
        print("Found card with UID:", result)
        
        return result
