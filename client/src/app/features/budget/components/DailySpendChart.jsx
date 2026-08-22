import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export function DailySpendChart({ dailySpend = [], dailyBudgetLimit = 0, currency = 'USD' }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        const dates = dailySpend.map((d) => d.date);
        const totals = dailySpend.map((d) => d.totalCost);

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
                formatter: (params) => {
                    const param = params[0];
                    return `<strong>${param.name}</strong><br/>Spend: ${currency} ${param.value}`;
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: dates.length > 0 ? dates : ['Day 1', 'Day 2', 'Day 3'],
                axisLine: { lineStyle: { color: '#DDDDDD' } },
                axisLabel: { color: '#6A6A6A', fontSize: 11 },
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#DDDDDD' } },
                splitLine: { lineStyle: { color: '#F7F7F7' } },
                axisLabel: { color: '#6A6A6A' },
            },
            series: [
                {
                    name: 'Daily Cost',
                    type: 'bar',
                    barWidth: '35%',
                    data: totals.length > 0 ? totals : [0, 0, 0],
                    itemStyle: {
                        borderRadius: [6, 6, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#FF385C' },
                            { offset: 1, color: '#E00B41' },
                        ]),
                    },
                    ...(dailyBudgetLimit > 0
                        ? {
                              markLine: {
                                  data: [
                                      {
                                          yAxis: dailyBudgetLimit,
                                          name: 'Daily Budget Limit',
                                          lineStyle: {
                                              color: '#FF9500',
                                              type: 'dashed',
                                              width: 2,
                                          },
                                          label: {
                                              formatter: `Daily Target (${currency} ${dailyBudgetLimit})`,
                                              position: 'end',
                                              color: '#FF9500',
                                              fontSize: 10,
                                          },
                                      },
                                  ],
                              },
                          }
                        : {}),
                },
            ],
        };

        chartInstance.current.setOption(option);

        const handleResize = () => {
            chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, [dailySpend, dailyBudgetLimit, currency]);

    return (
        <div className="echarts-wrapper" style={{ width: '100%', height: '320px' }}>
            <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}

export default DailySpendChart;
