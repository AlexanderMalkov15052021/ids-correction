import { fontSize, scaleCorrection } from "@/constants";
import { laneMark } from "@/types";
import { DxfWriter } from "@tarikjabiri/dxf";

type GetTmpStr = { text: string, pointId: number }

const getTmpStr = (arg: GetTmpStr) => `fixed id: point ${arg.text} ${arg.pointId} `

export const addLayers = (dxf: DxfWriter) => {
    dxf.addLayer("Straight roads", 5);
    dxf.addLayer("Quadratic spline roads", 3);
    dxf.addLayer("Cubic spline roads", 12);
    dxf.addLayer("Pallet points", 1);
    dxf.addLayer("Rest points", 30);
    dxf.addLayer("Charge points", 210);
    dxf.addLayer("Pallet roads", 2);
    dxf.addLayer("Rest roads", 6);
    dxf.addLayer("Charge roads", 8);
    dxf.addLayer("Layer", 22);
    dxf.addLayer("Target points", 70);
    dxf.addLayer("Bidirectional roads", 120);
    dxf.addLayer("Target charge points", 100);
    dxf.addLayer("Turning charge points", 90);
    dxf.addLayer("Target pallet points", 100);
    dxf.addLayer("Target rest points", 100);
    dxf.addLayer("Cache pallet points", 164);
    dxf.addLayer("Turning pallet points", 90);
    dxf.addLayer("Turning rest points", 90);
}

export const addDXFText = (dxf: DxfWriter, layerName: string, point: laneMark) => {
    const text = dxf.addMText(
        { x: point.mLaneMarkXYZW.x / scaleCorrection, y: point.mLaneMarkXYZW.y / scaleCorrection, z: 0 },
        fontSize,
        point.mLaneMarkName ?? "",
        { layerName }
    );

    const appTargetId = dxf.tables.addAppId(`text - ${text.handle}`);

    const xTargetIdData = text.addXData(appTargetId.name);

    const str = getTmpStr({ text: text.handle, pointId: point.mLaneMarkID });

    xTargetIdData.string(str);
}