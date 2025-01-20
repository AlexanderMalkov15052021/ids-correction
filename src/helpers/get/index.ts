import { scaleCorrection } from "@/constants";
import { Roads } from "@/modules/extract/getRoads";
import { MooeDoc, Points } from "@/types";
import { DxfWriter, point3d } from "@tarikjabiri/dxf";

export const getDXFLine = (dxf: DxfWriter, dir: number, startId: number, endId: number, pointslist: any) => {
    if (dir === 0) {
        return dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Bidirectional roads" }
        );
    }
    else {
        return dxf.addLine(
            point3d(pointslist[startId].mLaneMarkXYZW.x / scaleCorrection, pointslist[startId].mLaneMarkXYZW.y / scaleCorrection),
            point3d(pointslist[endId].mLaneMarkXYZW.x / scaleCorrection, pointslist[endId].mLaneMarkXYZW.y / scaleCorrection),
            { layerName: "Straight roads" }
        );
    }
}

export const getPointsLine = (mooe: MooeDoc) => {
    return mooe?.mLaneMarks?.reduce((accum: any, obj: any) => {
        accum[obj.mLaneMarkID] = obj;

        return accum;
    }, {});
}

export const getPoints = (mooe: MooeDoc) => {
    const points: Points = mooe?.mLaneMarks?.reduce((accum: any, obj: any) => {

        if (obj.mLaneMarkType === 2) {
            if (obj.mLaneMarkName.toLowerCase().includes("rest") && obj.mLaneMarkName.toLowerCase().includes("检")) {
                accum.targetRestPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("rest") && obj.mLaneMarkName.toLowerCase().includes("前置点")) {
                accum.turningRestPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("charge") && obj.mLaneMarkName.toLowerCase().includes("检")) {
                accum.targetChargePoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("charge") && obj.mLaneMarkName.toLowerCase().includes("前置点")) {
                accum.turningChargePoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("检")) {
                accum.targetPalletPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("前置点")) {
                accum.turningPalletPoints.push(obj);
                return accum;
            }
        }

        if (obj.mLaneMarkType === 9) {

            if (obj.mLaneMarkName.toLowerCase().includes("识别")) {
                accum.cachePalletPoints.push(obj);
                return accum;
            }

        }

        if (obj.mLaneMarkType === 11) {

            if (obj.mLaneMarkName.toLowerCase().includes("rest")) {
                accum.restPoints.push(obj);
                return accum;
            }

            if (obj.mLaneMarkName.toLowerCase().includes("charge")) {
                accum.chargePoints.push(obj);
                return accum;
            }

            accum.palletPoints.push(obj);
            return accum;

        }

        if (obj.mLaneMarkType === 5) {

            accum.locationPoints.push(obj);
            return accum;

        }

        return accum;
    }, {
        palletPoints: [],
        targetPalletPoints: [],
        turningPalletPoints: [],
        cachePalletPoints: [],
        restPoints: [],
        targetRestPoints: [],
        turningRestPoints: [],
        chargePoints: [],
        targetChargePoints: [],
        turningChargePoints: [],
        locationPoints: [],
    });

    return points;
}

export const getStraightLines = (mooe: MooeDoc, roads?: Roads) => {
    const straightLines = mooe?.mRoads?.filter(
        (obj: any) => obj.mLanes[0].mLaneType === 0
            && !roads?.palletRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
            && !roads?.restRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
            && !roads?.chargeRoads.find((roadData: any) => roadData.road.mLanes[0] === obj.mLanes[0])
    );

    return straightLines
}