import React, { useEffect, useState, useMemo } from 'react';
import { fetchValueMeasures } from './DashboardService';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import './Dashboard.css';

const DashboardPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState('All');
    const [selectedMetric, setSelectedMetric] = useState('Claims acceptance rate');

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchValueMeasures();
                setData(result);
            } catch (err) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const years = useMemo(() => {
        const uniqueYears = [...new Set(data.map(item => item.Year))];
        return ['All', ...uniqueYears.sort()];
    }, [data]);

    const filteredData = useMemo(() => {
        if (selectedYear === 'All') return data;
        return data.filter(item => item.Year.toString() === selectedYear.toString());
    }, [data, selectedYear]);

    // Prepare data for charts
    // Top 10 firms by selected metric
    const topFirmsData = useMemo(() => {
        let sorted = [...filteredData].sort((a, b) => {
            // Handle numeric parsing if needed, assuming data is clean or parsed in backend
            // But based on user request, we might need to parse strings like "95%" or "1000-1500"
            // For now, let's assume the backend or service returns raw strings and we might need to parse here if not done in ETL.
            // The user said "I already generate cleaned dataset... in json format".
            // Let's assume the JSON has numeric values for _mid columns or similar if they exist, or we parse.
            // Looking at the user prompt, they mentioned "Compute or parse numeric metrics...".
            // Let's try to use the numeric columns if they exist.
            // If the JSON has 'Claims acceptance rate', it might be a string.
            // Let's assume we use a simple sort for now or try to parse.

            const valA = parseFloat(String(a[selectedMetric]).replace('%', '')) || 0;
            const valB = parseFloat(String(b[selectedMetric]).replace('%', '')) || 0;
            return valB - valA; // Descending
        });
        return sorted.slice(0, 10);
    }, [filteredData, selectedMetric]);

    if (loading) return <div className="dashboard-loading">Loading market data...</div>;
    if (error) return <div className="dashboard-error">{error}</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Market Value Dashboard</h1>
                <p>Compare General Insurance Value Measures (Motor)</p>
            </header>

            <div className="dashboard-controls">
                <div className="control-group">
                    <label>Year:</label>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="control-group">
                    <label>Metric:</label>
                    <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
                        <option value="Claims acceptance rate">Claims Acceptance Rate</option>
                        <option value="Claims frequency">Claims Frequency</option>
                        <option value="Average claims payout">Average Payout</option>
                        <option value="Complaints">Complaints Rate</option>
                    </select>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-card">
                    <h2>Top 10 Firms by {selectedMetric} ({selectedYear})</h2>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={topFirmsData} layout="vertical" margin={{ left: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="Firm name" type="category" width={150} style={{ fontSize: '12px' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={selectedMetric} fill="#8884d8" name={selectedMetric} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="dashboard-note">
                <p><strong>Note:</strong> Data source: FCA General Insurance Value Measures. "Advantage Insurance Company Limited" represents Hastings Direct.</p>
            </div>
        </div>
    );
};

export default DashboardPage;
