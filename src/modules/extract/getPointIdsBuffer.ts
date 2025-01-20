import { firstPointId, valuesRange } from "@/constants";
import { MooeDoc } from "@/types";

export const getPointIdsBuffer = (mooeDoc: MooeDoc) => {

    const bufferIds = Array.from({ length: valuesRange }, (_, index) => index + firstPointId);

    const mLaneMarkIds = mooeDoc?.mLaneMarks.map((obj: { mLaneMarkID: number }) => obj.mLaneMarkID);
    const mRoadIds = mooeDoc?.mRoads.map((obj: { mRoadID: number }) => obj.mRoadID);
    const mLaneIds = mooeDoc?.mRoads.map((obj: { mRoadID: number, mLanes: { mLaneID: number }[] }) => obj.mLanes[0].mLaneID);

    const pointIdsBuffer = bufferIds.filter((id: number) => !mLaneMarkIds?.includes(id))
        .filter((id: number) => !mLaneIds?.includes(id))
        .filter((id: number) => !mRoadIds?.includes(id));


    return pointIdsBuffer;
}