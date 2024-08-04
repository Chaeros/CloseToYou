import sys
sys.path.append('/home/orin/S11P12B201/iot/features/sensors/')
from microphone import recognize_speech_from_mic
sys.path.append('/home/orin/S11P12B201/iot/features/sensors/')
from speaker import text_to_speech
sys.path.append('/home/orin/S11P12B201/iot/features/sensors/')
from nfc import read_nfc
from adafruit_pn532.i2c import PN532_I2C
import busio
import board
sys.path.append('/home/orin/S11P12B201/iot/database/')
from mySqlConnection import read_db_config, MySQLDatabase

def registClothes(pn532):
    voice="촬영용 거치대에 옷을 걸어주세요."
    text_to_speech(voice)
    print(voice)

    # clothesInfo=getColothesInfo()
    # if(clothesInfo!=None):
    clothesName="빨간색 셔츠"
    voice=clothesName+"가 등록되었습니다. NFC 태깅을 통해 옷을 등록해주세요."
    text_to_speech(voice)
    print(voice)

    uid=read_nfc(pn532)

    if(uid==None):
        voice="NFC 센서 태깅에 실패했습니다."
        text_to_speech(voice)
        return

    print(uid)

    insert_query = "INSERT INTO clothes (nickname, color, location) VALUES (%s, %s, %s)"
    db.execute_query(insert_query, ("파란 무지 반팦티", "파란색","B-1"))

    voice = "옷이 정상적으로 등록되었습니다. 옷장에 걸어주세요."
    text_to_speech(voice)



    # else:


if __name__ == "__main__":
    i2c = busio.I2C(board.SCL, board.SDA)
    pn532 = PN532_I2C(i2c, debug=False)
    ic, ver, rev, support = pn532.firmware_version
    pn532.SAM_configuration()

    # DB 연결
    config = read_db_config()
    db = MySQLDatabase(config)
    db.connect()

    registClothes(pn532)
    db.disconnect()
