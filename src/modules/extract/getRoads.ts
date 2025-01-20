import { maxDist } from "@/constants";
import { getDistPointToline } from "@/helpers/math";
import { MooeDoc } from "@/types";

export type Roads = {
    palletRoads: any;
    restRoads: any;
    chargeRoads: any;
};

export const getRoads = (mooe: MooeDoc, points: any, pointslist: any) => {

    return mooe?.mRoads.reduce<Roads>(
        (
            roadsAccum: { palletRoads: any, restRoads: any, chargeRoads: any },
            road: any
        ) => {

            const startIndex = road.mLanes[0].mStartPos;
            const endIndex = road.mLanes[0].mEndPos;

            const startPos = pointslist[startIndex].mLaneMarkXYZW;
            const endPos = pointslist[endIndex].mLaneMarkXYZW;

            roadsAccum.palletRoads = points.palletPoints.map((pallet: any, index: number) => {

                const dist = getDistPointToline(
                    pallet.mLaneMarkXYZW.x,
                    pallet.mLaneMarkXYZW.y,
                    startPos.x,
                    startPos.y,
                    endPos.x,
                    endPos.y
                );

                if (!roadsAccum.palletRoads[index]) {

                    const data = {
                        dist: maxDist,
                        road: null,
                    }

                    roadsAccum.palletRoads[index] = data;
                }

                if (dist < roadsAccum.palletRoads[index].dist) {
                    roadsAccum.palletRoads[index].dist = dist;
                    roadsAccum.palletRoads[index].road = road;
                }

                return roadsAccum.palletRoads[index];

            });

            roadsAccum.restRoads = points.restPoints.map((rest: any, index: number) => {

                const dist = getDistPointToline(
                    rest.mLaneMarkXYZW.x,
                    rest.mLaneMarkXYZW.y,
                    startPos.x,
                    startPos.y,
                    endPos.x,
                    endPos.y
                );

                if (!roadsAccum.restRoads[index]) {

                    const data = {
                        dist: maxDist,
                        road: null,
                    }

                    roadsAccum.restRoads[index] = data;
                }

                if (dist < roadsAccum.restRoads[index].dist) {
                    roadsAccum.restRoads[index].dist = dist;
                    roadsAccum.restRoads[index].road = road;
                }

                return roadsAccum.restRoads[index];

            });

            roadsAccum.chargeRoads = points.chargePoints.map((charge: any, index: number) => {

                const dist = getDistPointToline(
                    charge.mLaneMarkXYZW.x,
                    charge.mLaneMarkXYZW.y,
                    startPos.x,
                    startPos.y,
                    endPos.x,
                    endPos.y
                );

                if (!roadsAccum.chargeRoads[index]) {

                    const data = {
                        dist: maxDist,
                        road: null,
                    }

                    roadsAccum.chargeRoads[index] = data;
                }

                if (dist < roadsAccum.chargeRoads[index].dist) {
                    roadsAccum.chargeRoads[index].dist = dist;
                    roadsAccum.chargeRoads[index].road = road;
                }

                return roadsAccum.chargeRoads[index];

            });

            return roadsAccum;

        }, {
        palletRoads: [],
        restRoads: [],
        chargeRoads: []
    });

}