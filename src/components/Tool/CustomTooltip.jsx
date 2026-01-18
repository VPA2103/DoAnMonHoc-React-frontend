const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border rounded shadow-sm small">
                <p className="mb-0 fw-bold">{payload[0].name}</p>
                <p className="mb-0">
                    Số lượng: <span className="fw-bold">{payload[0].value}</span>
                </p>
                <p className="mb-0 text-muted small">
                    {(payload[0].percent * 100).toFixed(1)}%
                </p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;