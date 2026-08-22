import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export function CategoryCostChart({ categoryBreakdown, currency = 'USD' }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        const data = [
            { value: categoryBreakdown?.accommodation || 0, name: 'Stay / Lodging' },
            { value: categoryBreakdown?.transport || 0, name: 'Transport' },
            { value: categoryBreakdown?.activities || 0, name: 'Activities' },
            { value: categoryBreakdown?.food || 0, name: 'Food & Dining' },
            { value: categoryBreakdown?.other || 0, name: 'Other / Misc' },
        ].filter((d) => d.value > 0);

        // Fallback placeholder if no data
        const chartData = data.length > 0 ? data : [{ value: 1, name: 'No logged expenses yet' }];

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: `{b}: ${currency} {c} ({d}%)`,
            },
            legend: {
                bottom: '0%',
                left: 'center',
                icon: 'circle',
                textStyle: {
                    color: '#6A6A6A',
                    fontSize: 12,
                },
            },
            color: ['#FF385C', '#460479', '#008558', '#FF9500', '#007AFF'],
            series: [
                {
                    name: 'Expenses',
                    type: 'pie',
                    radius: ['45%', '70%'],
                    center: ['50%', '42%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold',
                            formatter: '{b}\n{d}%',
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: chartData,
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
    }, [categoryBreakdown, currency]);

    return (
        <div className="echarts-wrapper" style={{ width: '100%', height: '320px' }}>
            <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}

export default CategoryCostChart;
