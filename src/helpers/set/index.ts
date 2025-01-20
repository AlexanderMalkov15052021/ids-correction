import { scaleCorrection } from "@/constants";
import { MooeDoc } from "@/types";
import { DxfWriter } from "@tarikjabiri/dxf";

export const setRectangle = (dxf: DxfWriter, mooe: MooeDoc) => {
    dxf.addRectangle(
        {
            x: (mooe?.mSceneMap?.mMapAttr?.mMapOrigin?.x ?? 1) / scaleCorrection
                + (mooe?.mSceneMap?.mMapAttr?.mMapLength ?? 1) / scaleCorrection,
            y: (mooe?.mSceneMap?.mMapAttr?.mMapOrigin?.y ?? 1) / scaleCorrection
        },
        {
            x: (mooe?.mSceneMap?.mMapAttr?.mMapOrigin?.x ?? 1) / scaleCorrection,
            y: (mooe?.mSceneMap?.mMapAttr?.mMapOrigin?.y ?? 1) / scaleCorrection
                + (mooe?.mSceneMap?.mMapAttr?.mMapWidth ?? 1) / scaleCorrection
        },
        { layerName: "Layer" }
    );
}