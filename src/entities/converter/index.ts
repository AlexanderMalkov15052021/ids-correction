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

    duplicateObjects: { name: string, id: number, coords?: { w: number; x: number; y: number; z: number; } }[] = [];
    duplicateObjectsGroup: Record<
        number,
        { name: string, id: number, coords?: { w: number; x: number; y: number; z: number; } }[]
    > = {};

    modalIdsState: boolean = false;


    // Дубли имён
    duplicatesNames: laneMark[][] = [];

    // Флаг модалки дублей имён
    isNameDuplicatesModalOpen = false;

    constructor() {
        makeAutoObservable(this);
    }

    // Установка флага модалки дублей имён
    setDuplicatePointNamesModalState = (val: boolean) => {
        this.isNameDuplicatesModalOpen = val;
    }

    // Проверка дубликатов имён
    checkingDuplicateNames = () => {
        if (this.sourceFile) {

            // Получение дубликатов имён
            const pointList = this.sourceFile?.mLaneMarks.filter((obj: laneMark) => obj.mLaneMarkName).reduce((accum: any, obj: laneMark) => {

                if (accum.points[obj.mLaneMarkName]) {
                    accum.points[obj.mLaneMarkName].push(obj);
                }
                else {
                    accum.points[obj.mLaneMarkName] = [obj];
                }

                return accum;
            }, { points: {} });

            const dublicates = (Object.values(pointList.points) as laneMark[][]).filter((arr: laneMark[]) => arr.length > 1);

            this.duplicatesNames = dublicates;

            dublicates.length && (this.isNameDuplicatesModalOpen = true);


            this.setDuplicatePointNamesModalState(true);

        }
    }

    setModalIdsState = (state: boolean) => {
        this.modalIdsState = state;
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

    refreshCheckIds = () => {
        this.duplicateObjects = [];
        this.duplicateObjectsGroup = {};
    }

    checkIds = () => {

        if (this.outputFile) {

            this.setIsLoading(true);

            const promise = new Promise((resolve) => {

                setTimeout(() => {

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

                    if (this.duplicateIds.length) {

                        this.outputFile?.mLaneMarks.map(poin => {
                            if (this.duplicateIds.includes(poin.mLaneMarkID)) {
                                this.duplicateObjects.push({ name: poin.mLaneMarkName, id: poin.mLaneMarkID, coords: poin.mLaneMarkXYZW });
                            }
                        });

                        this.outputFile?.mRoads.map(road => {
                            Ids.push(road.mRoadID);
                            if (this.duplicateIds.includes(road.mRoadID)) {
                                this.duplicateObjects.push({ name: road.mRoadName, id: road.mRoadID });
                            }
                        });

                        this.outputFile?.mRoads.map(road => {
                            Ids.push(road.mLanes[0].mLaneID);
                            if (this.duplicateIds.includes(road.mLanes[0].mLaneID)) {
                                this.duplicateObjects.push({ name: road.mLanes[0].mLaneName, id: road.mLanes[0].mLaneID });
                            }
                        });

                        this.duplicateObjects.map((obj: { name: string, id: number, coords?: { w: number; x: number; y: number; z: number; } }) => {

                            if (this.duplicateObjectsGroup.hasOwnProperty(obj.id)) {
                                this.duplicateObjectsGroup[obj.id].push(obj);
                            }
                            else {
                                this.duplicateObjectsGroup = { ...this.duplicateObjectsGroup, [obj.id]: [obj] };
                            }

                        });

                        this.modalIdsState = true;
                    }

                    resolve(null);

                }, 1000);

            });

            promise.then(
                () => this.setIsLoading(false),
                error => console.log(error)
            );

        }
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

            this.setIsLoading(true);

            const promise = new Promise((resolve) => {

                setTimeout(() => {

                    if (this.sourceFile && this.outputFile) {

                        const sourceFile = JSON.stringify(this.sourceFile);
                        const outputFile = JSON.stringify(this.outputFile);

                        this.isCompareFiles = sourceFile === outputFile;

                        this.compareFilesModalState = true;

                        resolve(null);
                    }

                }, 1000);

            });

            promise.then(
                () => this.setIsLoading(false),
                error => console.log(error)
            );

        }

    }

    compareRoadsAndPoints = () => {

        if (this.sourceFile && this.outputFile) {

            this.setIsLoading(true);

            const promise = new Promise((resolve) => {

                setTimeout(() => {

                    if (this.sourceFile && this.outputFile) {

                        const sourceRoadsAndPoints = {
                            points: this.sourceFile.mLaneMarks,
                            roads: this.sourceFile.mRoads
                        }

                        const outputRoadsAndPoints = {
                            points: this.outputFile.mLaneMarks,
                            roads: this.outputFile.mRoads
                        }

                        const sourceFile = JSON.stringify(sourceRoadsAndPoints);

                        const outputFile = JSON.stringify(outputRoadsAndPoints);

                        this.isCompareFiles = sourceFile === outputFile;

                        this.compareFilesModalState = true;

                        resolve(null);
                    }

                }, 1000);

            });

            promise.then(
                () => this.setIsLoading(false),
                error => console.log(error)
            );

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

    resetDuplicateIds = () => {
        this.duplicateIds = []
    }

    removeDuplicateIds = () => {

        if (this.outputFile) {

            this.setIsLoading(true);

            const promise = new Promise((resolve) => {

                setTimeout(() => {

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
                        this.resetDuplicateIds();
                        resolve(null);
                    }

                }, 1000);

            });

            promise.then(
                () => this.setIsLoading(false),
                error => console.log(error)
            );

        }
    }



    redefineAllIds = () => {

        if (this.outputFile) {

            this.setIsLoading(true);

            const promise = new Promise((resolve) => {

                setTimeout(() => {

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

                        objData.tmpDoc.mLaneMarks.map(point => {
                            if (objData.duplicateIds.includes(point.mLaneMarkID)) {
                                point.mLaneMarkID = objData.pointIdsBuffer[objData.pointIdsBuffer.length - 1];
                                objData.pointIdsBuffer.pop();
                            }
                        });

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
                        this.resetDuplicateIds();
                        resolve(null);

                    }

                }, 1000);

            });

            promise.then(
                () => this.setIsLoading(false),
                error => console.log(error)
            );

        }

    }


    // Недопустимы дубли в исходном файле!

    // Недопустимы дубли более двух раз одного ID!

    // Недопустимы дороги по старым точкам!

    // Найти идентификаторы новых дорог и добавить если не задублированны и лейны проверить для дорог по старым точкам

    redefineIds = () => {

        if (this.sourceFile && this.outputFile) {

            this.setIsLoading(true);

            const promise = new Promise((resolve) => {

                setTimeout(() => {

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
                        this.resetDuplicateIds();
                        resolve(null);

                    }

                }, 1000);

            });

            promise.then(
                () => this.setIsLoading(false),
                error => console.log(error)
            );
        }
    }
}

export const store = new ConverterStor();
