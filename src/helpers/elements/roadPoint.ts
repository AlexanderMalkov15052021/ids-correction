
export const roadPoint = (lastId: number, pointX: number, pointY: number, angle: number) => {
    return {
        "mIsJockeyEndpoint": false,
        "mLaneMarkDescript": "",
        "mLaneMarkEnName": "",
        "mLaneMarkID": lastId,
        "mLaneMarkName": "",
        "mLaneMarkType": 0,
        "mLaneMarkWidth": 0.3,
        "mLaneMarkXYZW": {
            "w": Math.cos(angle / 2),
            "x": pointX,
            "y": pointY,
            "z": Math.sin(angle / 2)
        },
        "neighborsID": []
    }
}