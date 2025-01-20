import { correctionCubicSpline, overturn } from "@/constants"

export const getCubicSpline = (
  id: string, layerName: string, firstPoint: any, secondPoint: any, thirdPoint: any, fourthPoint: any, appId: string, ids: string
) => {
  return (
`SPLINE
  5
${id}
330
57
100
AcDbEntity
  8
${layerName}
100
AcDbSpline
210
0.0
220
0.0
230
1.0
 70
     8
 71
     3
 72
     9
 73
     5
 74
     0
 42
0.000000001
 43
0.001
 40
0.0
 40
0.0
 40
0.0
 40
0.0
 40
1.0
 40
2.0
 40
2.0
 40
2.0
 40
2.0
 10
${firstPoint.x}
 20
${firstPoint.y}
 30
0.0
 10
${secondPoint.x / correctionCubicSpline}
 20
${secondPoint.y / correctionCubicSpline * overturn}
 30
0.0
 10
${thirdPoint.x / correctionCubicSpline}
 20
${thirdPoint.y / correctionCubicSpline * overturn}
 30
0.0
 10
${fourthPoint.x}
 20
${fourthPoint.y}
 30
0.0
 10
${fourthPoint.x}
 20
${fourthPoint.y}
 30
0.0
1001
${appId}
1002
{
1000
${ids}
1002
}
  0`
)}