import React, { useEffect, useCallback, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { EChart } from 'echarts-taro3-react'
// export default function FundDetail() {
//   const router = useRouter()
//   useEffect(() => {
    
//     Taro.request({
//       method: 'GET',
//       url: `https://fundmobapi.eastmoney.com/FundMApi/FundNetDiagram.ashx?FCODE=${router.params.code}&RANGE=y&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=${Date.now()}`
//     }).then(rawData => {
//       console.log(rawData)
//     })
//   }, [])
//   const refEChatEl = useRef<any>({})
//   const refEChat = useCallback((node) => {
//     console.log('node', node);
    
//     refEChatEl.current = node
//     const defautOption = {
//       xAxis: {
//         type: "category",
//         data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//       },
//       yAxis: {
//         type: "value",
//       },
//       series: [
//         {
//           data: [120, 200, 150, 80, 70, 110, 130],
//           type: "bar",
//           showBackground: true,
//           backgroundStyle: {
//             color: "rgba(220, 220, 220, 0.8)",
//           },
//         },
//       ],
//     };
//     node.refresh(defautOption)
//   }, [])
//   return (
//     <View>
//       <EChart ref={refEChat} canvasId='bar-canvas'/>
//     </View>
//   )
// }
export default class FundDetail extends React.Component {
  constructor(p) {
    super(p)
  }
  barChart: any;

  refBarChart = (node) => (this.barChart = node);
  componentDidMount() {
    const defautOption = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(220, 220, 220, 0.8)",
          },
        },
      ],
    };
    this.barChart.refresh(defautOption);
  }
  render() {
    return (
      <View>
        <View>123</View>
        {/* <EChart ref={this.refBarChart} canvasId='bar-canvas'></EChart> */}
      </View>
    )
  }
}