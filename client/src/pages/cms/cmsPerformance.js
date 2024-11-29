import React, { useState, useEffect } from 'react';
import { Loader } from 'semantic-ui-react';
import { apiServiceAdmin } from '../../services/api';

const CMSPerformance = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await apiServiceAdmin.performance()
        setPerformanceData(response.data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (duration) => {
    return `${duration.toFixed(2)}ms`;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader active inline='centered' />
        <p>Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className="col p-4" style={{width: 'calc(100% - 280px)' }}>
      <h2 className="mb-4">Performance Metrics</h2>
      
      {/* Top Row with Two Tables Side by Side */}
      <div className="row mb-4">
        {/* Request Statistics Table */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-warning">
              <h4 className="mb-0">Request Statistics</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive" style={{ height: '400px', overflowY: 'auto' }}>
                <table className="table table-striped table-hover">
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
                    <tr>
                      <th className="table-warning" width="40%">Endpoint</th>
                      <th className="table-warning text-center" width="15%">Count</th>
                      <th className="table-warning text-center" width="20%">Avg Duration</th>
                      <th className="table-warning text-center" width="25%">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData && Object.entries(performanceData.requests).map(([endpoint, data]) => (
                      <tr key={endpoint}>
                        <td><code>{endpoint}</code></td>
                        <td className="text-center">{data.count}</td>
                        <td className="text-center">{formatDuration(data.avgDuration)}</td>
                        <td className="text-center">
                          {Object.entries(data.statusCodes).map(([code, count]) => (
                            <span key={code} className={`badge ${
                              code.startsWith('2') ? 'bg-success' : 
                              code.startsWith('3') ? 'bg-info' : 
                              'bg-danger'
                            } me-1`}>
                              {code}: {count}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Slow Requests Table */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">Slow Requests ({performanceData?.slowRequests.length})</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive" style={{ height: '400px', overflowY: 'auto' }}>
                <table className="table table-striped table-hover">
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
                    <tr>
                      <th className="table-danger" width="35%">Path</th>
                      <th className="table-danger text-center" width="15%">Method</th>
                      <th className="table-danger text-center" width="25%">Duration</th>
                      <th className="table-danger text-center" width="25%">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData?.slowRequests.map((request, index) => (
                      <tr key={index}>
                        <td><code>{request.path}</code></td>
                        <td className="text-center">{request.method}</td>
                        <td className="text-center">{formatDuration(request.duration)}</td>
                        <td className="text-center">{formatTimestamp(request.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server Info Card (Centered) */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">Server Information</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Server Uptime:</strong> {Math.floor(performanceData?.uptime / 60)} minutes</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Last Updated:</strong> {formatTimestamp(performanceData?.timestamp)}</p>
                </div>
              </div>
              {Object.keys(performanceData?.errors || {}).length > 0 && (
                <div className="row mt-3">
                  <div className="col-12">
                    <h5 className="text-danger">Errors</h5>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <pre>{JSON.stringify(performanceData.errors, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSPerformance; 