function AnalyticsCardValue({ value, trend, isPositive, subTitle }) {
    return (
        <>
            <div className="card-value-row">
                <span className="large-value">{value}</span>
                <span className={`trend-badge ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '↑' : '↓'} {trend}
                </span>
            </div>

            <div className="card-subtitle-line">
                <span className="dashed-underline">{subTitle}</span>
            </div>
        </>
    );
}

export default AnalyticsCardValue;
