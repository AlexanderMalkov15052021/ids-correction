export type laneMark = {
    mAvoidPointID?: null;
    mBindRoadGroups?: never[];
    mID?: null;
    mIsJockeyEndpoint: boolean;
    mLaneMarkDescript: string;
    mLaneMarkEnName: string;
    mLaneMarkID: number;
    mLaneMarkName: string;
    mLaneMarkSize?: { height: number; length: number; width: number; } |
    { height: number; length: number; width: number; } |
    { height: number; length: number; width: number; };
    mLaneMarkType: number;
    mLaneMarkWidth: number;
    mLaneMarkXYZW: { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; } |
    { w: number; x: any; y: any; z: number; };
    mMapName?: string;
    mPrepointID?: null;
    mTaskListName?: string;
    neighborsID: never[];
}

export type Roads = {
    mBelongJunctionID: number;
    mEndPosition: { x: any; y: any; z: number; } |
    { x: number; y: number; z: number; };
    mLForbiddenLine: never[];
    mLForbiddenLineID: number;
    mLaneCount: number;
    mLanes: {
        mAssistedDrawFlag: boolean;
        mAvoidObstacle: boolean;
        mBindMarkAreaID: number;
        mBorder: {
            roadwidth_left: number;
            roadwidth_right: number;
        };
        mDelta: number;
        mDirection: number;
        mEndPos: number;
        mGoalAgain: boolean;
        mLaneDescript: string;
        mLaneID: number;
        mLaneName: string;
        mLanePro: number;
        mLaneType: number;
        mLeftAvoidanceArea: number;
        mLength: number;
        mObstacleDistance: number;
        mObstacleWidth: number;
        mPlannerAgain: boolean;
        mPointOfInterest: never[];
        mPosID: number;
        mRightAvoidanceArea: number;
        mSpeed: number;
        mStartPos: number;
        mWidth: number;
        usesensor: {
            fall_arrest_system: boolean;
            use_bottom_laser: boolean;
            use_front_realsense: boolean;
            use_front_realsense_rgb: boolean;
        };
    }[] |
    {
        mAssistedDrawFlag: boolean;
        mAvoidObstacle: boolean;
        mBindMarkAreaID: number;
        mBorder: { roadwidth_left: number; roadwidth_right: number; };
        mDelta: number;
        mDirection: number;
        mEndPos: number;
        mGoalAgain: boolean;
        mLaneDescript: string;
        mLaneID: number;
        mLaneName: string;
        mLanePro: number;
        mLaneType: number;
        mLeftAvoidanceArea: number;
        mLength: number;
        mObstacleDistance: number;
        mObstacleWidth: number;
        mPlannerAgain: boolean;
        mPointOfInterest: never[];
        mPosID: number;
        mRightAvoidanceArea: number;
        mSpeed: number;
        mStartPos: number;
        mWidth: number;
        usesensor: {
            fall_arrest_system: boolean;
            use_bottom_laser: boolean;
            use_front_realsense: boolean;
            use_front_realsense_rgb: boolean;
        };
    }[];
    mLength: number;
    mRForbiddenLine: never[];
    mRForbiddenLineID: number;
    mRoadID: number;
    mRoadName: string;
    mStartPosition: { x: any; y: any; z: number; }
    | { x: any; y: any; z: number; };
}

export type MooeDoc = {
    mAreas: {
        mAreaRect: {
            bottomLeftPoint: {
                x: number;
                y: number;
                z: number;
            },
            bottomRightPoint: {
                x: number;
                y: number;
                z: number;
            },
            topLeftPoint: {
                x: number;
                y: number;
                z: number;
            },
            topRightPoint: {
                x: number;
                y: number;
                z: number;
            },
        }
    }[];
    mLaneMarks: laneMark[];
    mRoads: Roads[];
    mapRotateAngle: number;
    mSceneMap: {
        mMapAttr: {
            mMapLength: number;
            mMapWidth: number;
            mMapOrigin: {
                x: number;
                y: number;
                z: number;
            }
        }
    }
} | null;

export type FieldType = {
    targetID: string;
    replaceableID: string;
};

export type Coords = {
    id: number; x: number; y: number
};

export type Coords2D = {
    x: number; y: number
};

export type Points = {
    palletPoints: laneMark[],
    targetPalletPoints: laneMark[],
    turningPalletPoints: laneMark[],
    cachePalletPoints: laneMark[],
    restPoints: laneMark[],
    targetRestPoints: laneMark[],
    turningRestPoints: laneMark[],
    chargePoints: laneMark[],
    targetChargePoints: laneMark[],
    turningChargePoints: laneMark[],
    locationPoints: laneMark[],
};

