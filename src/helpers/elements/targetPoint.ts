export const targetPoint = (
    lastId: number, pointX: number, pointY: number, angle: number, lastNum: number,
    colNum: number, rowNum: number, postName: string, dir: number
) => {

    return {
        "mAvoidPointID": null,
        "mBindRoadGroups": [],
        "mID": null,
        "mIsJockeyEndpoint": false,
        "mLaneMarkDescript": "",
        "mLaneMarkEnName": `A${lastNum}col${colNum}row${rowNum}${postName}`,  // A603col01row21
        "mLaneMarkID": lastId,
        "mLaneMarkName": `A${lastNum}col${colNum}row${rowNum}${postName}`,  // A603col01row21
        "mLaneMarkSize": {
            "height": 0,
            "length": 0,
            "width": 0
        },
        "mLaneMarkType": 2,
        "mLaneMarkWidth": 0.3,
        "mLaneMarkXYZW": {
            "w": Math.cos(angle / 2 + dir),
            "x": pointX,
            "y": pointY,
            "z": Math.sin(angle / 2 + dir)
        },
        "mMapName": "",
        "mPrepointID": null,
        "mTaskListName": "",
        "neighborsID": []
    }
}