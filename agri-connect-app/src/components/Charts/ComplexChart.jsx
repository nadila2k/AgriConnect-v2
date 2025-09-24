

import React from 'react';
import ReactECharts from 'echarts-for-react';

const textStyle = {
  color: '#000',
  fontSize: 15,
};

const ComplexChart = ({
  barNames,
  barValues,
  markLine = [{ cropName: '', yearWeightEstimate: 0 }]
}) => {
  // Check if there's no data
  if (barNames.length === 0 || barValues.length === 0) {
    return <div>No data available to display the chart.</div>;
  }

  const markLineData = markLine.map(el => ({
    yAxis: el.yearWeightEstimate,
    name: el.cropName
  }));

  console.log("markLineData ", markLineData);
  

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      textStyle,
    },
    xAxis: {
      type: 'category',
      data: barNames,
      axisLine: {
        show: true,
      },
      axisLabel: {
        show: true,
        textStyle,
      },
    },
    yAxis: {
      type: 'value',
      max: Math.max(Math.max(...barValues), ...markLine.map(el => el.yearWeightEstimate)),
      name: 'Metric Ton (T)',
      nameTextStyle: {
        ...textStyle,
        fontWeight: 'bold',
      },
      nameLocation: 'end',
      nameGap: 20,
      axisLine: {
        show: true,
      },
      axisLabel: {
        show: true,
        textStyle,
      },
    },
    series: [
      {
        data: barValues,
        type: 'bar',
        itemStyle: {
          color: '#288bb1',
        },
        markLine: {
          data: markLineData,
          label: {
            show: true,
            formatter: '{b}',
            textStyle,
          },
          lineStyle: {
            color: 'red',
            width: 2,
            type: 'dashed'
          }
        }
      }
    ]
  };

  return (
    <div>
      <ReactECharts option={option} style={{ width: '100%', height: '600px' }} />
    </div>
  );
};

export default ComplexChart;
