import { isIdenticalPoints, isNearestPoints } from "@/helpers/math";
import { getLaneIdsBuffer } from "@/modules/extract/getLaneIdsBuffer";
import { getPointIdsBuffer } from "@/modules/extract/getPointIdsBuffer";
import { getRoadIdsBuffer } from "@/modules/extract/getRoadIdsBuffer";
import { FieldType, laneMark, MooeDoc } from "@/types";
import { makeAutoObservable } from "mobx";

class ConverterStor {
    isLoading: boolean = false;
    sourceFileName: string | null = null;
    outputFileName: string | null = null;
    loadingTime: number[] = [0, 0];
    isMessageShow: boolean = false;
    href: string = "";
    sourceFile: MooeDoc | null = null;
    outputFile: MooeDoc | null = null;
    tmpFile: MooeDoc | null = null;

    isCompareFiles: boolean = false;
    compareFilesModalState: boolean = false;

    sourcePointsList: Record<string, number> = {};

    targetId: string = "0";

    replaceableId: string = "0";

    formValues: FieldType = {
        targetID: "0",
        replaceableID: "0",
    };

    duplicateIds: number[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setLoadingTime = (val: number[]) => this.loadingTime = val;
    setIsMessageShow = (val: boolean) => this.isMessageShow = val;
    setSourceFileName = (val: string | null) => this.sourceFileName = val;
    setOutputFileName = (val: string | null) => this.outputFileName = val;
    setIsLoading = (val: boolean) => this.isLoading = val;

    setHref = (doc: any) => {

        const targetDoc = JSON.stringify(doc);

        const file = new Blob([targetDoc as unknown as string], { type: 'application/json' });
        const url = URL.createObjectURL(file);

        this.href = url;

        this.tmpFile = this.outputFile;
    }

    setSourceFile = (doc: any) => {
        this.sourceFile = doc;
    }

    setOutputFile = (doc: any) => {
        this.outputFile = doc;
        this.tmpFile = doc;
    }

    compareIds = () => {

        // this.outputFile && this.outputFile.mLaneMarks.map((point: laneMark) => {
        //     point.mLaneMarkXYZW.x += 2;
        //     point.mLaneMarkXYZW.y += 3;
        // });

        // console.log("Compare Ids!");

        // this.setHref(this.outputFile);






        // if (this.sourceFile && this.tmpFile) {

        //     const pointsData = {
        //         replaceablePoint: null,
        //         targetPoint: null,
        //     }

        //     this.sourceFile.mLaneMarks.map((obj: laneMark) => {
        //         obj.mLaneMarkName && (this.sourcePointsList[obj.mLaneMarkName] = obj.mLaneMarkID);
        //     });

        //     this.tmpFile.mLaneMarks.map((obj: laneMark) => {

        //         const id = this.sourcePointsList[obj.mLaneMarkName];

        //         if (id) {
        //             obj.mLaneMarkID = id;
        //         }

        //     });

        //     this.setHref(this.tmpFile);

        // }



    }






    setCompareFilesModalState = (state: boolean) => {
        this.compareFilesModalState = state;
    }

    setTargetId = (id: string) => {
        this.targetId = id;
    }

    setReplaceableId = (id: string) => {
        this.replaceableId = id;
    }

    setParams = (values: FieldType) => {

        this.formValues = values;

        const replaceableID = Number(values.replaceableID);
        const targetID = Number(values.targetID);

        this.outputFile && this.outputFile.mLaneMarks.map(point => {
            if (point.mLaneMarkID === replaceableID) {
                point.mLaneMarkID = targetID;
            }
        });

        this.outputFile && this.outputFile.mRoads.map(road => {
            if (road.mRoadID === replaceableID) {
                road.mRoadID = targetID;
            }
        });

        this.outputFile && this.outputFile.mRoads.map(road => {
            if (road.mLanes[0].mLaneID === replaceableID) {
                road.mLanes[0].mLaneID = targetID;
            }
        });

        this.setHref(this.outputFile);

    }

    compareFiles = () => {

        if (this.sourceFile && this.outputFile) {

            const sourceFile = JSON.stringify(this.sourceFile);
            const outputFile = JSON.stringify(this.outputFile);

            this.isCompareFiles = sourceFile === outputFile;

            this.compareFilesModalState = true;

        }

    }

    renameObj = () => {

        if (this.outputFile) {

            const objData = {
                tmpDoc: { ...this.outputFile }
            }

            objData.tmpDoc?.mLaneMarks.map(poin => {
                const nameEn = poin.mLaneMarkEnName;

                poin.mLaneMarkName = nameEn;
            });

            this.setHref(objData.tmpDoc);

        }

    }

    removeDuplicateIds = () => {

        if (this.outputFile) {

            const Ids: number[] = [];

            this.outputFile?.mLaneMarks.map(poin => {
                Ids.push(poin.mLaneMarkID);
            });

            this.outputFile?.mRoads.map(road => {
                Ids.push(road.mRoadID);
            });

            this.outputFile?.mRoads.map(road => {
                Ids.push(road.mLanes[0].mLaneID);
            });

            this.duplicateIds = Ids.filter((number, index, numbers) => {
                return numbers.indexOf(number) !== index;
            });

            console.log("Duplicate IDs: ", [...this.duplicateIds]);

            const roadIds = this.outputFile?.mRoads.map(road => road.mRoadID);
            const laneIds = this.outputFile?.mRoads.flatMap(road => road.mLanes[0].mLaneID);
            const pointIds = this.outputFile?.mLaneMarks.map(point => point.mLaneMarkID);

            const objData = {
                tmpDoc: { ...this.outputFile },
                duplicateIds: this.duplicateIds,
                duplicateRoadIds: roadIds?.filter((number, index, numbers) => numbers.indexOf(number) !== index),
                duplicateLaneIds: laneIds?.filter((number, index, numbers) => numbers.indexOf(number) !== index),
                duplicatePointIds: pointIds?.filter((number, index, numbers) => numbers.indexOf(number) !== index)
            }

            objData.tmpDoc.mRoads.map(road => {
                if (objData.duplicateRoadIds.includes(road.mRoadID)) {
                    objData.tmpDoc.mRoads = objData.tmpDoc.mRoads.filter(obj => obj !== road);
                    objData.duplicateRoadIds = objData.duplicateRoadIds.filter(id => id !== road.mRoadID);
                }
            });

            objData.tmpDoc.mRoads.map(road => {
                if (objData.duplicateLaneIds.includes(road.mLanes[0].mLaneID)) {
                    objData.tmpDoc.mRoads = objData.tmpDoc.mRoads.filter(obj => obj !== road);
                    objData.duplicateLaneIds = objData.duplicateLaneIds.filter(id => id !== road.mLanes[0].mLaneID);
                }
            });

            objData.tmpDoc.mLaneMarks.map(point => {
                if (objData.duplicatePointIds.includes(point.mLaneMarkID)) {
                    objData.tmpDoc.mLaneMarks = objData.tmpDoc.mLaneMarks.filter(obj => obj !== point);
                    objData.duplicatePointIds = objData.duplicatePointIds.filter(id => id !== point.mLaneMarkID);
                }
            });

            this.setHref(objData.tmpDoc);

        }

    }


    redefineAllIds = () => {

        if (this.outputFile) {

            const newIds: number[] = [];

            this.outputFile?.mLaneMarks.map(poin => {
                newIds.push(poin.mLaneMarkID);
            });

            this.outputFile?.mRoads.map(road => {
                newIds.push(road.mRoadID);
            });

            this.outputFile?.mRoads.map(road => {
                newIds.push(road.mLanes[0].mLaneID);
            });

            this.duplicateIds = newIds.filter((number, index, numbers) => {
                return numbers.indexOf(number) !== index;
            });

            const objData = {
                tmpDoc: { ...this.outputFile },
                duplicateIds: this.duplicateIds,
                roadIdsBuffer: getRoadIdsBuffer(this.outputFile),
                laneIdsBuffer: getLaneIdsBuffer(this.outputFile),
                pointIdsBuffer: getPointIdsBuffer(this.outputFile)
            }

            // objData.tmpDoc.mLaneMarks.map(point => {
            //     if (objData.duplicateIds.includes(point.mLaneMarkID)) {
            //         point.mLaneMarkID = objData.pointIdsBuffer[objData.pointIdsBuffer.length - 1];
            //         objData.pointIdsBuffer.pop();
            //     }
            // });

            objData.tmpDoc.mRoads.map(road => {
                if (objData.duplicateIds.includes(road.mRoadID)) {
                    road.mRoadID = objData.roadIdsBuffer[objData.roadIdsBuffer.length - 1];
                    objData.roadIdsBuffer.pop();
                }
            });

            objData.tmpDoc.mRoads.map(road => {
                if (objData.duplicateIds.includes(road.mLanes[0].mLaneID)) {
                    road.mLanes[0].mLaneID = objData.laneIdsBuffer[objData.laneIdsBuffer.length - 1];
                    objData.laneIdsBuffer.pop();
                }
            });

            this.setHref(objData.tmpDoc);

        }

    }


    // Недопустимы дубли в исходном файле!

    // Недопустимы дубли более двух раз одного ID!

    // Недопустимы дороги по старым точкам!

    // Найти идентификаторы новых дорог и добавить если не задублированны и лейны проверить для дорог по старым точкам

    redefineIds = () => {

        if (this.sourceFile && this.outputFile) {

            const newIds: number[] = [];

            this.outputFile?.mLaneMarks.map(poin => {
                newIds.push(poin.mLaneMarkID);
            });

            this.outputFile?.mRoads.map(road => {
                newIds.push(road.mRoadID);
            });

            this.outputFile?.mRoads.map(road => {
                newIds.push(road.mLanes[0].mLaneID);
            });

            this.duplicateIds = newIds.filter((number, index, numbers) => {
                return numbers.indexOf(number) !== index;
            });

            const objData = {
                tmpDoc: { ...this.outputFile },
                duplicateIds: this.duplicateIds,
                roadIdsBuffer: getRoadIdsBuffer(this.outputFile),
                laneIdsBuffer: getLaneIdsBuffer(this.outputFile),
                pointIdsBuffer: getPointIdsBuffer(this.outputFile)
            }









            //////////////////////
            /* 🔻 new points 🔻 */
            const newPointIds = objData.tmpDoc.mLaneMarks.map(point => point.mLaneMarkID);
            // const oldPointIds = this.sourceFile.mLaneMarks.map(point => point.mLaneMarkID);

            const duplicatePointIds = newPointIds.filter((number, index, numbers) => numbers.indexOf(number) !== index)

            const uniquePointIds = [...new Set(newPointIds)];

            // const targetUniquePointIds = [...uniquePointIds, ...duplicatePointIds];

            const newPointList: Record<number, laneMark> = {};

            objData.tmpDoc.mLaneMarks.map(point => {
                newPointList[point.mLaneMarkID] = point
            });

            const oldPointList: Record<number, laneMark> = {};

            this.sourceFile.mLaneMarks.map(point => {
                oldPointList[point.mLaneMarkID] = point
            });

            const newPoints: laneMark[] = uniquePointIds.reduce((accum: laneMark[], id: number) => {

                !oldPointList[id] && accum.push(newPointList[id]);

                return accum
            }, []);

            const newPointRecord: Record<number | string, laneMark[]> = {};
            const oldPointRecord: Record<number | string, laneMark> = {};

            objData.tmpDoc.mLaneMarks.map(point => {
                if (newPointRecord.hasOwnProperty(point.mLaneMarkID)) {
                    newPointRecord[point.mLaneMarkID].push(point);
                }
                else {
                    newPointRecord[point.mLaneMarkID] = [point];
                }
            });

            this.sourceFile.mLaneMarks.map(point => {
                if (duplicatePointIds.includes(point.mLaneMarkID)) {
                    oldPointRecord[point.mLaneMarkID] = point;
                }
            });

            const newPointFiltredRecord: Record<number | string, laneMark[]> = {};

            Object.keys(newPointRecord).map((key: string) => {
                if (newPointRecord[key].length > 1) {
                    newPointFiltredRecord[key] = newPointRecord[key];
                }
            });

            Object.keys(newPointFiltredRecord).map((key: string) => {

                newPointFiltredRecord[key].map(point => {
                    oldPointRecord[point.mLaneMarkID]

                    const isIdentical = isIdenticalPoints(
                        {
                            x: oldPointRecord[point.mLaneMarkID].mLaneMarkXYZW.x,
                            y: oldPointRecord[point.mLaneMarkID].mLaneMarkXYZW.y
                        },
                        {
                            x: point.mLaneMarkXYZW.x,
                            y: point.mLaneMarkXYZW.y
                        }
                    );

                    !isIdentical && newPoints.push(point);

                })

            });

            const newPointsRecord: Record<number | string, laneMark> = {};

            newPoints.map(point => {
                newPointsRecord[point.mLaneMarkID] = point;
            });

            /* 🔺 new points 🔺 */

            /* 🔻 new roads 🔻 */

            const inaccuracy = 0.2;  // погрешность

            const newRoads = objData.tmpDoc.mRoads.filter(road => {

                const roadEndPos = road.mEndPosition;
                const roadStartPos = road.mStartPosition;

                const roadEndId = road.mLanes[0].mEndPos
                const roadStartId = road.mLanes[0].mStartPos

                const newEndPoint = newPointsRecord[roadEndId] ? newPointsRecord[roadEndId].mLaneMarkXYZW : null;
                const newStartPoint = newPointsRecord[roadStartId] ? newPointsRecord[roadStartId].mLaneMarkXYZW : null;

                const isNewStartPoint: boolean = newEndPoint
                    ? isNearestPoints(newEndPoint.x, newEndPoint.y, roadEndPos.x, roadEndPos.y, inaccuracy)
                    : false;

                const isNewEndPoint: boolean = newStartPoint
                    ? isNearestPoints(newStartPoint.x, newStartPoint.y, roadStartPos.x, roadStartPos.y, inaccuracy)
                    : false;

                if (isNewStartPoint || isNewEndPoint) {

                    return road;

                }

            });

            /* 🔺 new roads 🔺 */


            newRoads.map(road => {

                console.log(road.mRoadID);

                if (objData.duplicateIds.includes(road.mRoadID)) {
                    const id = objData.roadIdsBuffer[objData.roadIdsBuffer.length - 1];

                    road.mRoadID = id;

                    objData.roadIdsBuffer.pop();
                }

                if (objData.duplicateIds.includes(road.mLanes[0].mLaneID)) {
                    const id = objData.laneIdsBuffer[objData.laneIdsBuffer.length - 1];

                    road.mLanes[0].mLaneID = id;

                    objData.laneIdsBuffer.pop();
                }

            });


            newPoints.map(point => {

                if (objData.duplicateIds.includes(point.mLaneMarkID)) {

                    const id = objData.pointIdsBuffer[objData.pointIdsBuffer.length - 1];

                    newRoads.map(road => {
                        if (road.mLanes[0].mEndPos === point.mLaneMarkID) {
                            road.mLanes[0].mEndPos = id;
                        }

                        if (road.mLanes[0].mStartPos === point.mLaneMarkID) {
                            road.mLanes[0].mStartPos = id;
                        }
                    });

                    point.mLaneMarkID = id;

                }

            });

            this.setHref(objData.tmpDoc);


            //////////////////////











            // /* 🔻 outputFile 🔻 */
            // const newRoadCoordsList: Record<number, { startPoint: Coords2D, endPoint: Coords2D }> = {};
            // const newLaneCoordsList: Record<number, { startPoint: Coords2D, endPoint: Coords2D }> = {};
            // const newPointCoordsList: Record<number, Coords2D> = {};

            // objData.tmpDoc.mLaneMarks.map(point => {
            //     newPointCoordsList[point.mLaneMarkID] = { x: point.mLaneMarkXYZW.x, y: point.mLaneMarkXYZW.y }
            // });

            // objData.tmpDoc.mRoads.map(road => {
            //     const startCoords: Coords2D = newPointCoordsList[road.mLanes[0].mStartPos];
            //     const endCoords: Coords2D = newPointCoordsList[road.mLanes[0].mEndPos];
            //     newLaneCoordsList[road.mLanes[0].mLaneID] = { startPoint: startCoords, endPoint: endCoords };
            // });

            // objData.tmpDoc.mRoads.map(road => {
            //     const startCoords: Coords2D = newPointCoordsList[road.mLanes[0].mStartPos];
            //     const endCoords: Coords2D = newPointCoordsList[road.mLanes[0].mEndPos];
            //     newRoadCoordsList[road.mRoadID] = { startPoint: startCoords, endPoint: endCoords };
            // });
            // /* 🔺 outputFile 🔺 */


            // /* 🔻 sourceFile 🔻 */
            // const oldRoadCoordsList: Record<number, { startPoint: Coords2D, endPoint: Coords2D }> = {};
            // const oldLaneCoordsList: Record<number, { startPoint: Coords2D, endPoint: Coords2D }> = {};
            // const oldPointCoordsList: Record<number, Coords2D> = {};

            // this.sourceFile.mLaneMarks.map(point => {
            //     oldPointCoordsList[point.mLaneMarkID] = { x: point.mLaneMarkXYZW.x, y: point.mLaneMarkXYZW.y }
            // });

            // this.sourceFile.mRoads.map(road => {
            //     const startCoords: Coords2D = oldPointCoordsList[road.mLanes[0].mStartPos];
            //     const endCoords: Coords2D = oldPointCoordsList[road.mLanes[0].mEndPos];
            //     oldLaneCoordsList[road.mLanes[0].mLaneID] = { startPoint: startCoords, endPoint: endCoords };
            // });

            // this.sourceFile.mRoads.map(road => {
            //     const startCoords: Coords2D = oldPointCoordsList[road.mLanes[0].mStartPos];
            //     const endCoords: Coords2D = oldPointCoordsList[road.mLanes[0].mEndPos];
            //     oldRoadCoordsList[road.mRoadID] = { startPoint: startCoords, endPoint: endCoords };
            // });
            // /* 🔺 sourceFile 🔺 */

            // /* 🔻 outputFile (Record) 🔻 */
            // const newRoadCoordsRecord: Record<number | string, Roads[]> = {};
            // // const newLaneCoordsRecord: Record<number | string, Roads[]> = {};
            // const newPointCoordsRecord: Record<number | string, laneMark[]> = {};

            // objData.tmpDoc.mLaneMarks.map(point => {
            //     if (newPointCoordsRecord.hasOwnProperty(point.mLaneMarkID)) {
            //         newPointCoordsRecord[point.mLaneMarkID].push(point);
            //     }
            //     else {
            //         newPointCoordsRecord[point.mLaneMarkID] = [point];
            //     }
            // });

            // const pointFiltredRecord: Record<number | string, laneMark[]> = {};

            // Object.keys(newPointCoordsRecord).map((key: string) => {
            //     if (newPointCoordsRecord[key].length > 1) {
            //         pointFiltredRecord[key] = newPointCoordsRecord[key];
            //     }
            // });

            // // objData.tmpDoc.mRoads.map(road => {
            // //     const startCoords: Coords2D = newPointCoordsRecord[road.mLanes[0].mStartPos];
            // //     const endCoords: Coords2D = newPointCoordsRecord[road.mLanes[0].mEndPos];
            // //     newLaneCoordsRecord[road.mLanes[0].mLaneID] = { startPoint: startCoords, endPoint: endCoords };
            // // });

            // objData.tmpDoc.mRoads.map(road => {
            //     if (newRoadCoordsRecord.hasOwnProperty(road.mRoadID)) {
            //         newRoadCoordsRecord[road.mRoadID].push(road);
            //     }
            //     else {
            //         newRoadCoordsRecord[road.mRoadID] = [road];
            //     }
            // });

            // const roadFiltredRecord: Record<number | string, Roads[]> = {};

            // Object.keys(newRoadCoordsRecord).map((key: string) => {
            //     if (newRoadCoordsRecord[key].length > 1) {
            //         roadFiltredRecord[key] = newRoadCoordsRecord[key];
            //     }
            // });
            // /* 🔺 outputFile (Record) 🔺 */

            // /* 🔻 srcFile (Record) 🔻 */
            // const oldRoadCoordsRecord: Record<number | string, Roads[]> = {};
            // // const newLaneCoordsRecord: Record<number | string, Roads[]> = {};
            // const oldPointCoordsRecord: Record<number | string, laneMark[]> = {};

            // this.sourceFile.mLaneMarks.map(point => {
            //     if (oldPointCoordsRecord.hasOwnProperty(point.mLaneMarkID)) {
            //         oldPointCoordsRecord[point.mLaneMarkID].push(point);
            //     }
            //     else {
            //         oldPointCoordsRecord[point.mLaneMarkID] = [point];
            //     }
            // });

            // const oldPointFiltredRecord: Record<number | string, laneMark[]> = {};

            // Object.keys(oldPointCoordsRecord).map((key: string) => {
            //     if (oldPointCoordsRecord[key].length > 1) {
            //         oldPointFiltredRecord[key] = oldPointCoordsRecord[key];
            //     }
            // });

            // // this.sourceFile.mRoads.map(road => {
            // //     const startCoords: Coords2D = oldPointCoordsRecord[road.mLanes[0].mStartPos];
            // //     const endCoords: Coords2D = oldPointCoordsRecord[road.mLanes[0].mEndPos];
            // //     newLaneCoordsRecord[road.mLanes[0].mLaneID] = { startPoint: startCoords, endPoint: endCoords };
            // // });

            // this.sourceFile.mRoads.map(road => {
            //     if (oldRoadCoordsRecord.hasOwnProperty(road.mRoadID)) {
            //         oldRoadCoordsRecord[road.mRoadID].push(road);
            //     }
            //     else {
            //         oldRoadCoordsRecord[road.mRoadID] = [road];
            //     }
            // });

            // const oldRoadFiltredRecord: Record<number | string, Roads[]> = {};

            // Object.keys(oldRoadCoordsRecord).map((key: string) => {
            //     if (oldRoadCoordsRecord[key].length > 1) {
            //         oldRoadFiltredRecord[key] = oldRoadCoordsRecord[key];
            //     }
            // });
            // /* 🔺 srcFile (Record) 🔺 */

            // const newPointList: Record<number, laneMark> = {};

            // objData.tmpDoc.mLaneMarks.map(point => {
            //     newPointList[point.mLaneMarkID] = point
            // });








            // objData.tmpDoc.mRoads.map(road => {

            //     if (objData.duplicateIds.includes(road.mRoadID)) {

            //         const startPos = road.mLanes[0].mStartPos;
            //         const endPos = road.mLanes[0].mEndPos;



            //         if (objData.duplicateIds.includes(startPos)) {
            //             const newPoint = pointFiltredRecord[startPos].find(point => {
            //                 oldPointCoordsList[startPos].x !== point.mLaneMarkXYZW.x
            //                     || oldPointCoordsList[startPos].y !== point.mLaneMarkXYZW.y
            //             });

            //             const constNewPointId = objData.pointIdsBuffer[objData.pointIdsBuffer.length - 1];

            //             newPoint && (newPoint.mLaneMarkID = constNewPointId);

            //             road.mLanes[0].mStartPos = constNewPointId;

            //             objData.pointIdsBuffer.pop();
            //         }
            //         else {
            //             if (!oldPointCoordsList[startPos]) {
            //                 const newPoint = newPointList[startPos];

            //                 const constNewPointId = objData.pointIdsBuffer[objData.pointIdsBuffer.length - 1];

            //                 newPoint && (newPoint.mLaneMarkID = constNewPointId);

            //                 road.mLanes[0].mStartPos = constNewPointId;

            //                 objData.pointIdsBuffer.pop();
            //             }
            //         }




            //         if (objData.duplicateIds.includes(endPos)) {

            //         }
            //         else {

            //         }




            //         // const startX = newPointCoordsList[startPos].x;
            //         // const startY = newPointCoordsList[startPos].y;

            //         // const endX = newPointCoordsList[endPos].x;
            //         // const endY = newPointCoordsList[endPos].y;

            //         // const newPoint = {
            //         //     startPoint: { x: startX, y: startY },
            //         //     endPoint: { x: endX, y: endY }
            //         // }

            //         // const oldPoints = oldRoadCoordsList[road.mRoadID];

            //         // return isIdenticalPoints(newPoint.startPoint, oldPoints.startPoint)
            //         //     && isIdenticalPoints(newPoint.endPoint, oldPoints.endPoint);


            //     }
            //     else {

            //     }

            // })






            // const createdRoads: any[] = this.outputFile.mRoads.filter(road => {

            //     if (objData.duplicateIds.includes(road.mRoadID)) {

            //         const startPos = road.mLanes[0].mStartPos;
            //         const endPos = road.mLanes[0].mEndPos;

            //         const startX = newPointCoordsList[startPos].x;
            //         const startY = newPointCoordsList[startPos].y;

            //         const endX = newPointCoordsList[endPos].x;
            //         const endY = newPointCoordsList[endPos].y;

            //         const newPoint = {
            //             startPoint: { x: startX, y: startY },
            //             endPoint: { x: endX, y: endY }
            //         }

            //         const oldPoints = oldRoadCoordsList[road.mRoadID];

            //         return isIdenticalPoints(newPoint.startPoint, oldPoints.startPoint)
            //             && isIdenticalPoints(newPoint.endPoint, oldPoints.endPoint);

            //     }

            // });

            // const createdLanes: any[] = this.outputFile.mRoads.filter(road => {

            //     if (objData.duplicateIds.includes(road.mLanes[0].mLaneID)) {

            //         const startPos = road.mLanes[0].mStartPos;
            //         const endPos = road.mLanes[0].mEndPos;

            //         const startX = newPointCoordsList[startPos].x;
            //         const startY = newPointCoordsList[startPos].y;

            //         const endX = newPointCoordsList[endPos].x;
            //         const endY = newPointCoordsList[endPos].y;

            //         const newPoint = {
            //             startPoint: { x: startX, y: startY },
            //             endPoint: { x: endX, y: endY }
            //         }

            //         const oldPoints = oldLaneCoordsList[road.mLanes[0].mLaneID];

            //         return !isIdenticalPoints(newPoint.startPoint, oldPoints.startPoint)
            //             || !isIdenticalPoints(newPoint.endPoint, oldPoints.endPoint);

            //     }

            // });


            // // Не допустимы дубли в исходном файле!
            // const createdPoints: any[] = this.outputFile.mLaneMarks.filter(point => {

            //     if (objData.duplicateIds.includes(point.mLaneMarkID)) {

            //         const newPoint = { x: point.mLaneMarkXYZW.x, y: point.mLaneMarkXYZW.y }

            //         const oldPoint = oldPointCoordsList[point.mLaneMarkID];

            //         return !isIdenticalPoints(newPoint, oldPoint);

            //     }

            // });

            // const newRoads: any = [];
            // const newLanes: any = [];
            // const newPoints: any = [];

            // this.outputFile?.mRoads.map((road: any) => {
            //     if (objData.duplicateIds.includes(road.mRoadID) && createdRoads.includes(road)) {
            //         objData.duplicateIds = objData.duplicateIds.filter(id => id !== road.mRoadID);

            //         newRoads.push({ ...road, mRoadID: objData.roadIdsBuffer[objData.roadIdsBuffer.length - 1] });

            //         objData.roadIdsBuffer.pop();
            //     }
            //     else {
            //         newRoads.push(road);
            //     }
            // });

            // const targetNewRoads = newRoads.map((road: any) => {
            //     if (objData.duplicateIds.includes(road.mLanes[0].mLaneID) && createdLanes.includes(road)) {
            //         objData.duplicateIds = objData.duplicateIds.filter(id => id !== road.mLanes[0].mLaneID);

            //         const targetRoad = { ...road, mRoadID: objData.laneIdsBuffer[objData.laneIdsBuffer.length - 1] }

            //         objData.laneIdsBuffer.pop();

            //         return targetRoad
            //     }
            //     else {
            //         return road;
            //     }
            // });

            // this.outputFile?.mRoads.map(road => {
            //     if (objData.duplicateIds.includes(road.mLanes[0].mLaneID) && createdLanes.includes(road)) {
            //         objData.duplicateIds = objData.duplicateIds.filter(id => id !== road.mLanes[0].mLaneID);

            //         newLanes.push({ ...road, mRoadID: objData.laneIdsBuffer[objData.laneIdsBuffer.length - 1] });

            //         objData.laneIdsBuffer.pop();
            //     }
            //     else {
            //         newLanes.push(road);
            //     }
            // });

            // this.outputFile?.mLaneMarks.map(point => {
            //     if (objData.duplicateIds.includes(point.mLaneMarkID) && createdPoints.includes(point)) {
            //         objData.duplicateIds = objData.duplicateIds.filter(id => id !== point.mLaneMarkID);

            //         newPoints.push({ ...point, mLaneMarkID: objData.pointIdsBuffer[objData.pointIdsBuffer.length - 1] });

            //         objData.pointIdsBuffer.pop();
            //     }
            //     else {
            //         newPoints.push(point);
            //     }
            // });

            // const newDoc = {
            //     ...this.outputFile,
            //     mRoads: targetNewRoads,
            //     mLaneMarks: newPoints
            // }

            // this.setHref(newDoc);

        }

    }


}

export const store = new ConverterStor();
