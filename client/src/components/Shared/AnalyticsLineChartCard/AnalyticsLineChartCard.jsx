import AnalyticsCardHeader from './components/AnalyticsCardHeader';
import AnalyticsCardValue from './components/AnalyticsCardValue';
import AnalyticsLineChart from './components/AnalyticsLineChart';
import './AnalyticsLineChartCard.scss';

/**
 * ======================================================================================
 * SERVER-SIDE INTEGRATION GUIDE:
 * ======================================================================================
 * In production, this component should fetch data dynamically from the server API
 * based on the `cardId` prop.
 *
 * Example Integration:
 *
 * const [cardData, setCardData] = useState(null)
 * const [isLoading, setIsLoading] = useState(true)
 *
 * useEffect(() => {
 *   async function fetchCardData() {
 *     try {
 *       setIsLoading(true)
 *       const response = await fetch(`/api/analytics/charts/${cardId}`)
 *       const json = await response.json()
 *       setCardData(json)
 *     } catch (err) {
 *       console.error("Failed to load chart data:", err)
 *     } finally {
 *       setIsLoading(false)
 *     }
 *   }
 *   fetchCardData()
 * }, [cardId])
 * ======================================================================================
 */

function AnalyticsLineChartCard({
    cardId = 'total-sales',
    icon,
    showInfo = false,
    title = 'Total Sales',
    value = '$0',
    trend = '0%',
    isPositive = true,
    subTitle = 'Metric Over Time',
    dataPrimary = [],
    dataSecondary = [],
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yTicks = [0, 500, 1000, 1500],
    yMax = 1500,
}) {
    return (
        <div className="analytics-chart-card loaded">
            <AnalyticsCardHeader title={title} icon={icon} showInfo={showInfo} />

            <AnalyticsCardValue
                value={value}
                trend={trend}
                isPositive={isPositive}
                subTitle={subTitle}
            />

            <AnalyticsLineChart
                dataPrimary={dataPrimary}
                dataSecondary={dataSecondary}
                labels={labels}
                yTicks={yTicks}
                yMax={yMax}
            />
        </div>
    );
}

export default AnalyticsLineChartCard;
