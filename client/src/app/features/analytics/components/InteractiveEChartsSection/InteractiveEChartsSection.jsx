import { useEffect, useRef, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import {
    TrendingUp,
    BarChart3,
    PieChart,
    Download,
    Layers,
} from 'lucide-react';
import './InteractiveEChartsSection.scss';

export function InteractiveEChartsSection({ analytics, timeframe = '30d' }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [activeView, setActiveView] = useState('growth'); // 'growth' | 'destinations' | 'status' | 'financials'
    const [chartType, setChartType] = useState('area'); // 'area' | 'bar'


    const timeSeriesData = useMemo(() => {
        return analytics?.timeSeries || [];
    }, [analytics]);

    const popularCities = useMemo(() => {
        return analytics?.catalog?.popularCities || [];
    }, [analytics]);

    const tripsByStatus = useMemo(() => {
        return analytics?.trips?.byStatus || {};
    }, [analytics]);

    const expensesByCategory = useMemo(() => {
        return analytics?.financials?.expensesByCategory || [];
    }, [analytics]);

    // Initialize or Update EChart Option
    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        const myChart = chartInstance.current;
        let option = {};

        if (activeView === 'growth') {
            const xLabels = timeSeriesData.length > 0
                ? timeSeriesData.map((d) => d.label)
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const tripsSeries = timeSeriesData.length > 0
                ? timeSeriesData.map((d) => d.trips)
                : [120, 180, 240, 310, 290, 380, 450];
            const usersSeries = timeSeriesData.length > 0
                ? timeSeriesData.map((d) => d.users)
                : [45, 62, 85, 110, 95, 130, 160];
            const bookmarksSeries = timeSeriesData.length > 0
                ? timeSeriesData.map((d) => d.bookmarks)
                : [210, 320, 410, 520, 480, 610, 750];

            option = {
                color: ['#e11d48', '#7c3aed', '#059669'],
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'transparent',
                    textStyle: { color: '#ffffff', fontSize: 12 },
                    padding: [10, 14],
                    axisPointer: {
                        type: 'cross',
                        crossStyle: { color: '#cbd5e1' },
                    },
                },
                legend: {
                    data: ['Trips Created', 'New Users', 'Bookmarks'],
                    top: 10,
                    right: 20,
                    textStyle: { color: '#475569', fontWeight: 500 },
                    icon: 'circle',
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '8%',
                    top: '18%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: chartType === 'bar',
                    data: xLabels,
                    axisLine: { lineStyle: { color: '#e2e8f0' } },
                    axisLabel: { color: '#64748b', fontWeight: 500 },
                },
                yAxis: {
                    type: 'value',
                    splitLine: { lineStyle: { color: '#f1f5f9' } },
                    axisLabel: { color: '#64748b' },
                },
                series: [
                    {
                        name: 'Trips Created',
                        type: chartType === 'bar' ? 'bar' : 'line',
                        smooth: true,
                        showSymbol: false,
                        areaStyle: chartType === 'area' ? {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(225, 29, 72, 0.28)' },
                                { offset: 1, color: 'rgba(225, 29, 72, 0.01)' },
                            ]),
                        } : undefined,
                        lineStyle: { width: 3 },
                        data: tripsSeries,
                    },
                    {
                        name: 'New Users',
                        type: chartType === 'bar' ? 'bar' : 'line',
                        smooth: true,
                        showSymbol: false,
                        areaStyle: chartType === 'area' ? {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(124, 58, 237, 0.22)' },
                                { offset: 1, color: 'rgba(124, 58, 237, 0.01)' },
                            ]),
                        } : undefined,
                        lineStyle: { width: 2.5 },
                        data: usersSeries,
                    },
                    {
                        name: 'Bookmarks',
                        type: chartType === 'bar' ? 'bar' : 'line',
                        smooth: true,
                        showSymbol: false,
                        areaStyle: chartType === 'area' ? {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(5, 150, 105, 0.20)' },
                                { offset: 1, color: 'rgba(5, 150, 105, 0.01)' },
                            ]),
                        } : undefined,
                        lineStyle: { width: 2.5 },
                        data: bookmarksSeries,
                    },
                ],
            };
        } else if (activeView === 'destinations') {
            const cityNames = popularCities.slice(0, 8).map((c) => c.name);
            const cityVisits = popularCities.slice(0, 8).map((c) => c.visitCount || 1);

            option = {
                color: ['#e11d48'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    textStyle: { color: '#ffffff' },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '8%',
                    top: '12%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    data: cityNames.length > 0 ? cityNames : ['Jaipur', 'Goa', 'Udaipur', 'Manali', 'Kerala', 'Varanasi'],
                    axisLabel: { color: '#475569', rotate: 20, fontWeight: 500 },
                    axisLine: { lineStyle: { color: '#e2e8f0' } },
                },
                yAxis: {
                    type: 'value',
                    name: 'Itinerary Stops',
                    splitLine: { lineStyle: { color: '#f1f5f9' } },
                    axisLabel: { color: '#64748b' },
                },
                series: [
                    {
                        name: 'Itinerary Visits',
                        type: 'bar',
                        barWidth: '38%',
                        itemStyle: {
                            borderRadius: [6, 6, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#e11d48' },
                                { offset: 1, color: '#fda4af' },
                            ]),
                        },
                        data: cityVisits.length > 0 ? cityVisits : [340, 290, 240, 210, 180, 150],
                    },
                ],
            };
        } else if (activeView === 'status') {
            const statusEntries = Object.entries(tripsByStatus);
            const pieData = statusEntries.length > 0
                ? statusEntries.map(([k, v]) => ({
                      name: k.charAt(0).toUpperCase() + k.slice(1),
                      value: Number(v),
                  }))
                : [
                      { name: 'Planned', value: 420 },
                      { name: 'Ongoing', value: 180 },
                      { name: 'Completed', value: 560 },
                      { name: 'Draft', value: 90 },
                  ];

            option = {
                color: ['#3b82f6', '#10b981', '#8b5cf6', '#94a3b8', '#ef4444'],
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    textStyle: { color: '#ffffff' },
                    formatter: '{b}: {c} trips ({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    right: 30,
                    top: 'center',
                    textStyle: { color: '#475569', fontWeight: 500 },
                    icon: 'circle',
                },
                series: [
                    {
                        name: 'Trip Status',
                        type: 'pie',
                        radius: ['45%', '72%'],
                        center: ['40%', '50%'],
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
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#1e293b',
                            },
                        },
                        data: pieData,
                    },
                ],
            };
        } else if (activeView === 'financials') {
            const catNames = expensesByCategory.map((c) => c.category.toUpperCase());
            const catAmounts = expensesByCategory.map((c) => Number(c.totalAmount || 0));

            option = {
                color: ['#7c3aed'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    textStyle: { color: '#ffffff' },
                    formatter: (params) => {
                        const p = params[0];
                        return `${p.name}: ₹${Number(p.value).toLocaleString()}`;
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '8%',
                    top: '12%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    data: catNames.length > 0 ? catNames : ['TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL'],
                    axisLabel: { color: '#475569', fontWeight: 600 },
                    axisLine: { lineStyle: { color: '#e2e8f0' } },
                },
                yAxis: {
                    type: 'value',
                    name: 'Amount (INR)',
                    splitLine: { lineStyle: { color: '#f1f5f9' } },
                    axisLabel: { color: '#64748b' },
                },
                series: [
                    {
                        name: 'Expenses',
                        type: 'bar',
                        barWidth: '42%',
                        itemStyle: {
                            borderRadius: [6, 6, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#7c3aed' },
                                { offset: 1, color: '#c4b5fd' },
                            ]),
                        },
                        data: catAmounts.length > 0 ? catAmounts : [450000, 680000, 320000, 210000],
                    },
                ],
            };
        }

        myChart.setOption(option, true);

        const handleResize = () => {
            if (chartInstance.current) {
                chartInstance.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeView, chartType, timeSeriesData, popularCities, tripsByStatus, expensesByCategory]);

    const handleExportPng = () => {
        if (chartInstance.current) {
            const url = chartInstance.current.getDataURL({
                type: 'png',
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });
            const link = document.createElement('a');
            link.href = url;
            link.download = `globetrotter_analytics_${activeView}_${timeframe}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="interactive-echarts-card">
            <div className="echarts-header-toolbar">
                <div className="view-selector-tabs">
                    <button
                        type="button"
                        className={`view-tab-btn ${activeView === 'growth' ? 'active' : ''}`}
                        onClick={() => setActiveView('growth')}
                    >
                        <TrendingUp size={15} />
                        <span>Platform Growth</span>
                    </button>

                    <button
                        type="button"
                        className={`view-tab-btn ${activeView === 'destinations' ? 'active' : ''}`}
                        onClick={() => setActiveView('destinations')}
                    >
                        <BarChart3 size={15} />
                        <span>Destinations</span>
                    </button>

                    <button
                        type="button"
                        className={`view-tab-btn ${activeView === 'status' ? 'active' : ''}`}
                        onClick={() => setActiveView('status')}
                    >
                        <PieChart size={15} />
                        <span>Status Composition</span>
                    </button>

                    <button
                        type="button"
                        className={`view-tab-btn ${activeView === 'financials' ? 'active' : ''}`}
                        onClick={() => setActiveView('financials')}
                    >
                        <Layers size={15} />
                        <span>Financial Breakdown</span>
                    </button>
                </div>

                <div className="echarts-action-controls">
                    {activeView === 'growth' && (
                        <div className="chart-type-toggle">
                            <button
                                type="button"
                                className={`type-btn ${chartType === 'area' ? 'active' : ''}`}
                                onClick={() => setChartType('area')}
                                title="Smooth Area Gradient"
                            >
                                Area
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${chartType === 'bar' ? 'active' : ''}`}
                                onClick={() => setChartType('bar')}
                                title="Bar Chart"
                            >
                                Bar
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        className="export-chart-btn"
                        onClick={handleExportPng}
                        title="Download Chart Image (PNG)"
                    >
                        <Download size={14} />
                        <span>Save Chart</span>
                    </button>
                </div>
            </div>

            <div className="echarts-canvas-container" ref={chartRef} />
        </div>
    );
}

export default InteractiveEChartsSection;
