export const pallet = (
    lastNum: number, lastId: number, colNum: number, rowNum: number, pointX: number, pointY: number, angle: number, zoneName: string
) => {
    return {
        "mIsJockeyEndpoint": false,
        "mLaneMarkDescript": "",
        "mLaneMarkEnName": `${zoneName}${lastNum}col${colNum}row${rowNum}`,  // A603col01row21
        "mLaneMarkID": lastId,
        "mLaneMarkName": `${zoneName}${lastNum}col${colNum}row${rowNum}`,  // GT97col01row01
        "mLaneMarkType": 11,
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