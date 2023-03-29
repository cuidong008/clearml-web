import dayjs from "dayjs"
import { TaskStatusEnum } from "@/types/enums"

export const option = {
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    top: "3%",
    containLabel: true,
  },
  tooltip: {
    showDelay: 0,
    backgroundColor: "#202432",
    borderColor: "#657099",
    formatter: (params: { value: any[] }) => {
      return `<div style="font-family:Heebo, sans-serif;font-weight: 300">
<div style="color:#dce0ee;font-size: 17px;height:21px">${params.value[2]}</div>
<div style="color:#dce0ee;font-size: 14px;height:30px">${params.value[3]}</div>
<div style="color:#dce0ee;font-size:27px;font-weight: 200">${params.value[1]}</div></div>`
    },
  },
  xAxis: {
    type: "time",
    axisLabel: {
      formatter: (value: number) => {
        return dayjs(value).format("DD/MM/YYYY")
      },
    },
    min: function (value: { min: number }) {
      return value.min - 3600 * 60 * 24 * 2
    },
    max: function (value: { max: number }) {
      return value.max + 3600 * 60 * 24 * 2
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "#aaaaaa",
        type: "dashed",
      },
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      show: true,
    },
    axisLabel: {
      formatter: (value: number) => {
        if ((value < 1 && value > 0) || (value > -1 && value < 0)) {
          return Number(value).toFixed(3)
        }
        return Number(value).toFixed(1)
      },
    },
    scale: true,
    min: function (value: { min: number }) {
      return value.min - 1
    },
    max: function (value: { max: number }) {
      return value.max + 1
    },
    splitLine: {
      lineStyle: {
        color: "#aaaaaa",
        type: "dashed",
      },
    },
  },
  series: {},
}

export function getItemStyle(t: string) {
  return {
    itemStyle: {
      color: statusToColor(t),
    },
    emphasis: {
      scale: 1,
      itemStyle: {
        borderWidth: 10,
        borderColor: statusToColor(t),
        opacity: 0.6,
      },
    },
  }
}

function statusToColor(status: string) {
  switch (status) {
    case `${TaskStatusEnum.Completed} or ${TaskStatusEnum.Stopped}`:
      return "#009aff"
    case TaskStatusEnum.Failed:
      return "#ff001f"
    case TaskStatusEnum.Published:
      return "#d3ff00"
    default:
      return "#50e3c2"
  }
}
