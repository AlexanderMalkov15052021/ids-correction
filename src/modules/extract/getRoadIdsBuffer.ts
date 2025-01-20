import { firstRoadId, valuesRange } from "@/constants";
import { MooeDoc } from "@/types";

export const getRoadIdsBuffer = (mooeDoc: MooeDoc) => {

    const bufferIds = Array.from({ length: valuesRange }, (_, index) => index + firstRoadId);

    const mLaneMarksIds = mooeDoc?.mLaneMarks.map((obj: { mLaneMarkID: number }) => obj.mLaneMarkID);
    const mRoadIds = mooeDoc?.mRoads.map((obj: { mRoadID: number }) => obj.mRoadID);
    const mLaneIds = mooeDoc?.mRoads.map((obj: { mRoadID: number, mLanes: { mLaneID: number }[] }) => obj.mLanes[0].mLaneID);

    const roadIdsBuffer = bufferIds.filter((id: number) => !mRoadIds?.includes(id))
        .filter((id: number) => !mLaneIds?.includes(id))
        .filter((id: number) => !mLaneMarksIds?.includes(id));

    return roadIdsBuffer;
}