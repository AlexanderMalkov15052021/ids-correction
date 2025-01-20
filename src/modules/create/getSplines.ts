import { maxDecimalIndex, scaleCorrection } from "@/constants";
import { getCubicSpline } from "@/helpers/spline/getCubicSpline";
import { getQuadraticSpline } from "@/helpers/spline/getQuadraticSpline";
import { MooeDoc } from "@/types";
import { DxfWriter } from "@tarikjabiri/dxf";

export const getSplines = (mooe: MooeDoc, newDXF: DxfWriter) => {

    const quadraticCurveLines = mooe?.mRoads.filter((obj: any) => obj.mLanes[0].mLaneType === 1);
    const cubicCurveLines = mooe?.mRoads.filter((obj: any) => obj.mLanes[0].mLaneType === 2);

    const pointslist = mooe?.mLaneMarks.reduce((accum: any, obj: any) => {
        accum[obj.mLaneMarkID] = obj;

        return accum;
    }, {});



    const finalQuadraticCurveIndex = maxDecimalIndex;

    const finalCubicCurveIndex = maxDecimalIndex - (quadraticCurveLines?.length ?? 0);


    const quadraticSplines = quadraticCurveLines?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        const firstPoint = {
            x: pointslist[startId].mLaneMarkXYZW.x / scaleCorrection,
            y: pointslist[startId].mLaneMarkXYZW.y / scaleCorrection,
            z: pointslist[startId].mLaneMarkXYZW.z / scaleCorrection
        };
        const secondPoint = {
            x: obj.mLanes[0].mBezierControl.x / scaleCorrection,
            y: obj.mLanes[0].mBezierControl.y / scaleCorrection,
            z: obj.mLanes[0].mBezierControl.z / scaleCorrection
        };
        const thirdPoint = {
            x: pointslist[endId].mLaneMarkXYZW.x / scaleCorrection,
            y: pointslist[endId].mLaneMarkXYZW.y / scaleCorrection,
            z: pointslist[endId].mLaneMarkXYZW.z / scaleCorrection
        };

        const targetIndex = (finalQuadraticCurveIndex - index).toString(16);

        const appId = `QuadraticSpline - ${targetIndex}`;

        const ids = `fixed id: road ${targetIndex} ${obj.mRoadID} ${obj.mLanes[0].mLaneID} ${obj.mLanes[0].mStartPos} ${obj.mLanes[0].mEndPos} `;

        newDXF.tables.addAppId(`QuadraticSpline - ${targetIndex}`);

        const quadraticSpline = getQuadraticSpline(
            targetIndex,
            "Quadratic spline roads",
            firstPoint,
            secondPoint,
            thirdPoint,
            appId,
            ids
        );

        const tailPart = quadraticSpline + (index !== quadraticCurveLines.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");


    const cubicSplines = cubicCurveLines?.reduce((accum: any, obj: any, index: number) => {

        const startId = obj.mLanes[0].mStartPos;
        const endId = obj.mLanes[0].mEndPos;

        const firstPoint = {
            x: pointslist[startId].mLaneMarkXYZW.x / scaleCorrection,
            y: pointslist[startId].mLaneMarkXYZW.y / scaleCorrection,
            z: pointslist[startId].mLaneMarkXYZW.z / scaleCorrection
        };
        const secondPoint = {
            x: obj.mLanes[0].m_BezierControl1.x / scaleCorrection,
            y: obj.mLanes[0].m_BezierControl1.y / scaleCorrection,
            z: obj.mLanes[0].m_BezierControl1.z / scaleCorrection,
        };
        const thirdPoint = {
            x: obj.mLanes[0].m_BezierControl2.x / scaleCorrection,
            y: obj.mLanes[0].m_BezierControl2.y / scaleCorrection,
            z: obj.mLanes[0].m_BezierControl2.z / scaleCorrection,
        };
        const fourthPoint = {
            x: pointslist[endId].mLaneMarkXYZW.x / scaleCorrection,
            y: pointslist[endId].mLaneMarkXYZW.y / scaleCorrection,
            z: pointslist[endId].mLaneMarkXYZW.z / scaleCorrection,
        };

        const targetIndex = (finalCubicCurveIndex - index).toString(16);

        const appId = `CubicSpline - ${targetIndex}`;

        const ids = `fixed id: road ${targetIndex} ${obj.mRoadID} ${obj.mLanes[0].mLaneID} ${obj.mLanes[0].mStartPos} ${obj.mLanes[0].mEndPos} `;

        newDXF.tables.addAppId(`CubicSpline - ${targetIndex}`);

        const cubicSpline = getCubicSpline(
            targetIndex,
            "Cubic spline roads",
            firstPoint,
            secondPoint,
            thirdPoint,
            fourthPoint,
            appId,
            ids
        );

        const tailPart = cubicSpline + (index !== cubicCurveLines.length - 1 ? "\n" : "");

        return accum += tailPart;

    }, "");

    const targetQuadraticSplines = quadraticSplines ? `\n${quadraticSplines}` : "";
    const targetCubicSplines = cubicSplines ? `\n${cubicSplines}` : "";

    return `ENTITIES\n0${targetQuadraticSplines}${targetCubicSplines}`
}