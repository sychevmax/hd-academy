import React, { useEffect, useState, useMemo } from 'react';
import { fetchValueMeasures } from './DashboardService';
// Chart imports removed as we are switching to table view
import './Dashboard.css';

const DashboardPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedProductType, setSelectedProductType] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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
        const uniqueYears = [...new Set(data.map(item => item.year))];
        const sortedYears = uniqueYears.sort().reverse();

        // Set default year if not set
        if (!selectedYear && sortedYears.length > 0) {
            setSelectedYear(sortedYears[0]);
        }

        return sortedYears;
    }, [data, selectedYear]);

    const productTypes = useMemo(() => {
        const uniqueTypes = [...new Set(data.map(item => item.product_type))];
        return ['All', ...uniqueTypes.sort()];
    }, [data]);

    const sortedData = useMemo(() => {
        let sortableItems = [...data];

        // Filter by year first
        // Filter by year first
        if (selectedYear) {
            sortableItems = sortableItems.filter(item => item.year.toString() === selectedYear.toString());
        }

        // Filter by product type
        if (selectedProductType !== 'All') {
            sortableItems = sortableItems.filter(item => item.product_type === selectedProductType);
        }

        // Then sort
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle numeric comparisons for specific columns if needed, 
                // but the JSON seems to have specific fields like _mid for sorting if we wanted to use them.
                // For now, let's use the display fields or the _mid fields if available for better sorting.
                // Based on the JSON structure seen:
                // acceptance_rate -> acceptance_rate_mid
                // claims_frequency -> claims_frequency_mid
                // complaints_rate -> complaints_rate_mid
                // avg_payout -> avg_payout_mid

                const sortKeyMap = {
                    'acceptance_rate': 'acceptance_rate_mid',
                    'claims_frequency': 'claims_frequency_mid',
                    'complaints_rate': 'complaints_rate_mid',
                    'avg_payout': 'avg_payout_mid'
                };

                const actualKey = sortKeyMap[sortConfig.key] || sortConfig.key;

                aValue = a[actualKey];
                bValue = b[actualKey];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, selectedYear, selectedProductType, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (name) => {
        if (sortConfig.key !== name) {
            return <span className="sort-indicator">⇅</span>;
        }
        return sortConfig.direction === 'ascending' ? <span className="sort-indicator">↑</span> : <span className="sort-indicator">↓</span>;
    };

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
                    <label>Product Type:</label>
                    <select value={selectedProductType} onChange={(e) => setSelectedProductType(e.target.value)}>
                        {productTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="dashboard-table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th onClick={() => requestSort('manufacturer')}>Manufacturer {getSortIndicator('manufacturer')}</th>
                            <th onClick={() => requestSort('product_type')}>Product Type {getSortIndicator('product_type')}</th>
                            <th onClick={() => requestSort('year')}>Year {getSortIndicator('year')}</th>
                            <th onClick={() => requestSort('acceptance_rate')}>Claims Acceptance Rate {getSortIndicator('acceptance_rate')}</th>
                            <th onClick={() => requestSort('claims_frequency')}>Claims Frequency {getSortIndicator('claims_frequency')}</th>
                            <th onClick={() => requestSort('complaints_rate')}>Complaints Rate {getSortIndicator('complaints_rate')}</th>
                            <th onClick={() => requestSort('avg_payout')}>Avg Payout {getSortIndicator('avg_payout')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.manufacturer}</td>
                                <td>{item.product_type}</td>
                                <td>{item.year}</td>
                                <td>{item.acceptance_rate}</td>
                                <td>{item.claims_frequency}</td>
                                <td>{item.complaints_rate}</td>
                                <td>{item.avg_payout || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="dashboard-note">
                <p><strong>Note:</strong> Data source: FCA General Insurance Value Measures. "Advantage Insurance Company Limited" represents Hastings Direct.</p>
            </div>
        </div>
    );
};

export default DashboardPage;
