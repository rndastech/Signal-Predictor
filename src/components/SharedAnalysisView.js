import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { signalAPI } from '../services/api';

const SharedAnalysisView = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);
  useEffect(() => {
    fetchSharedAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId]);

  const fetchSharedAnalysis = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await signalAPI.getSharedAnalysis(analysisId);
      
      if (response.data.requires_password) {
        setRequiresPassword(true);
      } else {
        setAnalysis(response.data.analysis);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load shared analysis');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingPassword(true);
      setError('');
      
      const response = await signalAPI.accessPasswordProtectedAnalysis(analysisId, password);
      setAnalysis(response.data.analysis);
      setRequiresPassword(false);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Access denied');
    } finally {
      setSubmittingPassword(false);
    }
  };

  // Helper function to format fitted function with proper spacing
  const formatFittedFunction = (fittedFunction) => {
    if (!fittedFunction) return 'Loading...';
    
    return fittedFunction
      // Add spaces around operators
      .replace(/\+/g, ' + ')
      .replace(/-/g, ' - ')
      .replace(/\*/g, ' * ')
      // Add spaces around parentheses for better readability
      .replace(/\(/g, '(')
      .replace(/\)/g, ')')
      // Add space after π
      .replace(/π/g, 'π * ')
      // Clean up any double spaces
      .replace(/\s+/g, ' ')
      // Fix cases where we might have created "π * *" patterns
      .replace(/π \* \*/g, 'π *')
      // Fix negative signs that might have gotten extra spaces
      .replace(/\+ -/g, '- ')
      .trim();
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "120px", background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}
      >
        <div className="text-center">
          <div className="spinner-border text-warning mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-light fs-5">Loading shared analysis...</p>
        </div>
      </div>
    );
  }
  if (requiresPassword) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "120px", background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className="card"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div className="card-header border-0 bg-transparent py-4">
                <h5 className="text-light d-flex align-items-center gap-3">
                  <i className="fas fa-lock" style={{ color: "#ffc107" }}></i>
                  PASSWORD REQUIRED
                </h5>
              </div>
              <div className="card-body p-4">
                {error && (
                  <div
                    className="alert p-3 rounded-3 mb-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%)",
                      border: "1px solid rgba(220, 53, 69, 0.3)",
                      color: "#f8d7da",
                    }}
                  >
                    <i className="fas fa-exclamation-triangle me-2"></i> {error}
                  </div>
                )}
                
                <p className="text-light mb-4">This analysis is password-protected. Please enter the password to view it:</p>
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label text-light mb-2">Password</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "15px",
                        color: "white",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-lg w-100"
                    disabled={submittingPassword}
                    style={{
                      background: "transparent",
                      border: submittingPassword ? "2px solid rgba(108, 117, 125, 0.5)" : "2px solid #ffc107",
                      borderRadius: "15px",
                      color: submittingPassword ? "rgba(108, 117, 125, 0.5)" : "#ffc107",
                      fontWeight: "700",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {submittingPassword ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-unlock me-2"></i>
                        Submit
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error && !analysis) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "80px", background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}
      >
        <div className="text-center">
          <div
            className="alert p-4 rounded-3"
            style={{
              background: "linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%)",
              border: "1px solid rgba(220, 53, 69, 0.3)",
              color: "#f8d7da",
            }}
          >
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button 
            className="btn px-4 py-2 mt-3"
            onClick={() => navigate('/')}
            style={{
              background: "transparent",
              border: "2px solid #6c757d",
              borderRadius: "25px",
              color: "#6c757d",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  if (!analysis) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ paddingTop: "80px", background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}
      >
        <div className="text-center">
          <p className="text-light fs-5 mb-4">No analysis data available.</p>
          <button 
            className="btn px-4 py-2"
            onClick={() => navigate('/')}
            style={{
              background: "transparent",
              border: "2px solid #6c757d",
              borderRadius: "25px",
              color: "#6c757d",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className="min-vh-100"
      style={{
        paddingTop: "80px",
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div className="container-fluid px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            {/* Header Card */}
            <div
              className="card mb-4"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(255, 193, 7, 0.4)"
                e.currentTarget.style.border = "1px solid rgba(255, 193, 7, 0.5)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)"
                e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div className="card-header border-0 bg-transparent py-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
                  <div>
                    <h1
                      className="mb-2 text-light d-flex align-items-center gap-3"
                      style={{ fontSize: "2.5rem", fontWeight: "700" }}
                    >
                      <i
                        className="fas fa-share-alt"
                        style={{
                          color: "#ffc107",
                          textShadow: "0 0 20px rgba(255, 193, 7, 0.5)",
                        }}
                      ></i>
                      SHARED ANALYSIS
                    </h1>
                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                      <small className="text-muted fs-6">
                        ({analysis?.display_name || analysis?.name || `Analysis #${analysis?.id}`})
                      </small>
                      <span
                        className="badge px-3 py-2"
                        style={{
                          background: "linear-gradient(45deg, #17a2b8, #138496)",
                          borderRadius: "25px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        <i className="fas fa-share-alt me-1"></i> SHARED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fitted Function Card */}
            <div
              className="card mb-4"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(255, 193, 7, 0.4)"
                e.currentTarget.style.border = "1px solid rgba(255, 193, 7, 0.5)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)"
                e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div className="card-body p-4">
                <h3 className="text-light mb-4 d-flex align-items-center gap-3">
                  <i className="fas fa-function" style={{ color: "#007bff" }}></i>
                  FITTED FUNCTION
                </h3>
                <div
                  className="p-4 rounded-3"
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "2px solid rgba(255, 193, 7, 0.3)",
                    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <code
                    className="fs-5 fw-bold"
                    style={{
                      color: "#ffc107",
                      textShadow: "0 0 10px rgba(255, 193, 7, 0.3)",
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      wordBreak: "break-all",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.4",
                    }}
                  >
                    {formatFittedFunction(analysis?.fitted_function)}
                  </code>
                </div>
              </div>
            </div>

            {/* Parameters and Frequencies Row */}
            <div className="row g-4 mb-4">
              {/* Model Parameters */}
              <div className="col-lg-6">
                <div
                  className="card h-100"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(255, 193, 7, 0.2)"
                    e.currentTarget.style.border = "1px solid rgba(255, 193, 7, 0.3)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)"
                    e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <div className="card-body p-4">
                    <h4 className="text-light mb-4 d-flex align-items-center gap-3">
                      <i className="fas fa-cog" style={{ color: "#ffc107" }}></i>
                      MODEL PARAMETERS
                    </h4>
                    {analysis?.parameters?.sinusoidal_components &&
                    Array.isArray(analysis.parameters.sinusoidal_components) &&
                    analysis.parameters.sinusoidal_components.length > 0 ? (
                      <div className="d-flex flex-column gap-3">
                        {analysis.parameters.sinusoidal_components.map((comp, index) => (
                          <div
                            key={`comp-${index}`}
                            className="p-3 rounded-3"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(0, 123, 255, 0.05) 100%)",
                              border: "1px solid rgba(0, 123, 255, 0.2)",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)"
                              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 123, 255, 0.3)"
                              e.currentTarget.style.border = "1px solid rgba(0, 123, 255, 0.5)"
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = "translateY(0)"
                              e.currentTarget.style.boxShadow = "none"
                              e.currentTarget.style.border = "1px solid rgba(0, 123, 255, 0.2)"
                            }}
                          >
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <span
                                className="badge px-2 py-1"
                                style={{
                                  background: "linear-gradient(45deg, #007bff, #0056b3)",
                                  borderRadius: "15px",
                                  fontSize: "0.7rem",
                                }}
                              >
                                Component {index + 1}
                              </span>
                            </div>
                            <div className="row g-2 text-light">
                              <div className="col-4">
                                <small className="text-muted d-block">Amplitude</small>
                                <span className="fw-bold">
                                  {comp.amplitude !== undefined ? comp.amplitude.toFixed(4) : "N/A"}
                                </span>
                              </div>
                              <div className="col-4">
                                <small className="text-muted d-block">Frequency</small>
                                <span className="fw-bold">
                                  {comp.frequency !== undefined ? comp.frequency.toFixed(4) : "N/A"}
                                </span>
                              </div>
                              <div className="col-4">
                                <small className="text-muted d-block">Phase</small>
                                <span className="fw-bold">
                                  {comp.phase !== undefined ? comp.phase.toFixed(4) : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {analysis.parameters.offset !== undefined && (
                          <div
                            className="p-3 rounded-3"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%)",
                              border: "1px solid rgba(40, 167, 69, 0.2)",
                            }}
                          >
                            <div className="text-light">
                              <small className="text-muted d-block">Offset</small>
                              <span className="fw-bold fs-5">{analysis.parameters.offset.toFixed(4)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="p-4 rounded-3 text-center"
                        style={{
                          background: "rgba(108, 117, 125, 0.1)",
                          border: "1px solid rgba(108, 117, 125, 0.2)",
                        }}
                      >
                        <i className="fas fa-info-circle text-muted mb-2 fs-4"></i>
                        <p className="text-muted mb-0">No model parameters available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dominant Frequencies */}
              <div className="col-lg-6">
                <div
                  className="card h-100"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(255, 193, 7, 0.4)"
                    e.currentTarget.style.border = "1px solid rgba(255, 193, 7, 0.5)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)"
                    e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <div className="card-body p-4">
                    <h4 className="text-light mb-4 d-flex align-items-center gap-3">
                      <i className="fas fa-wave-square" style={{ color: "#17a2b8" }}></i>
                      DOMINANT FREQUENCIES
                    </h4>
                    {analysis?.dominant_frequencies &&
                    Array.isArray(analysis.dominant_frequencies) &&
                    analysis.dominant_frequencies.length > 0 ? (
                      <div className="d-flex flex-column gap-3">
                        {analysis.dominant_frequencies.map((freq, index) => (
                          <div
                            key={`freq-${index}`}
                            className="p-3 rounded-3"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(23, 162, 184, 0.1) 0%, rgba(23, 162, 184, 0.05) 100%)",
                              border: "1px solid rgba(23, 162, 184, 0.2)",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)"
                              e.currentTarget.style.boxShadow = "0 8px 25px rgba(23, 162, 184, 0.3)"
                              e.currentTarget.style.border = "1px solid rgba(23, 162, 184, 0.5)"
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = "translateY(0)"
                              e.currentTarget.style.boxShadow = "none"
                              e.currentTarget.style.border = "1px solid rgba(23, 162, 184, 0.2)"
                            }}
                          >
                            <div className="row g-2 text-light">
                              <div className="col-6">
                                <small className="text-muted d-block">Frequency</small>
                                <span className="fw-bold">
                                  {Array.isArray(freq) && freq[0] !== undefined ? freq[0].toFixed(4) : "N/A"} Hz
                                </span>
                              </div>
                              <div className="col-6">
                                <small className="text-muted d-block">Amplitude</small>
                                <span className="fw-bold">
                                  {Array.isArray(freq) && freq[1] !== undefined ? freq[1].toFixed(4) : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="p-4 rounded-3 text-center"
                        style={{
                          background: "rgba(108, 117, 125, 0.1)",
                          border: "1px solid rgba(108, 117, 125, 0.2)",
                        }}
                      >
                        <i className="fas fa-info-circle text-muted mb-2 fs-4"></i>
                        <p className="text-muted mb-0">No dominant frequencies detected</p>
                      </div>
                    )}

                    {analysis?.mse !== undefined && analysis?.mse !== null && (
                      <div className="mt-4">
                        <h5 className="text-light mb-3 d-flex align-items-center gap-2">
                          <i className="fas fa-chart-bar" style={{ color: "#28a745" }}></i>
                          Model Quality
                        </h5>
                        <div
                          className="p-3 rounded-3"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%)",
                            border: "1px solid rgba(40, 167, 69, 0.2)",
                          }}
                        >
                          <div className="text-light">
                            <small className="text-muted d-block">Mean Squared Error</small>
                            <span className="fw-bold fs-5">{analysis.mse.toFixed(6)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visualizations */}
            {(analysis?.has_visualizations || analysis?.original_signal_plot || analysis?.fitted_signal_plot || analysis?.frequency_analysis_plot) && (
              <div
                className="card mb-4"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)"
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(255, 193, 7, 0.4)"
                  e.currentTarget.style.border = "1px solid rgba(255, 193, 7, 0.5)"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)"
                  e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                <div className="card-body p-4">
                  <h4 className="text-light mb-4 d-flex align-items-center gap-3">
                    <i className="fas fa-chart-area" style={{ color: "#6f42c1" }}></i>
                    VISUALIZATIONS
                  </h4>
                  <div className="row g-4">
                    {analysis?.frequency_analysis_plot && (
                      <div className="col-lg-6">
                        <div
                          className="p-3 rounded-3"
                          style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <h6 className="text-light mb-3">Frequency Spectrum</h6>
                          <img
                            src={analysis.frequency_analysis_plot}
                            alt="Frequency Spectrum"
                            className="img-fluid rounded-3"
                            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
                          />
                        </div>
                      </div>
                    )}
                    {analysis?.original_signal_plot && (
                      <div className="col-lg-6">
                        <div
                          className="p-3 rounded-3"
                          style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <h6 className="text-light mb-3">Training vs Testing Performance</h6>
                          <img
                            src={analysis.original_signal_plot}
                            alt="Training vs Testing"
                            className="img-fluid rounded-3"
                            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
                          />
                        </div>
                      </div>
                    )}
                    {analysis?.fitted_signal_plot && (
                      <div className="col-12">
                        <div
                          className="p-3 rounded-3"
                          style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <h6 className="text-light mb-3">Original vs Reconstructed Signal</h6>
                          <img
                            src={analysis.fitted_signal_plot}
                            alt="Original vs Reconstructed"
                            className="img-fluid rounded-3"
                            style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Data Preview */}
            {analysis?.data_preview && analysis.data_preview.length > 0 && (
              <div
                className="card mb-4"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)"
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(255, 193, 7, 0.4)"
                  e.currentTarget.style.border = "1px solid rgba(255, 193, 7, 0.5)"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)"
                  e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                    <h4 className="text-light mb-0 d-flex align-items-center gap-3">
                      <i className="fas fa-table" style={{ color: "#17a2b8" }}></i>
                      DATA PREVIEW
                      <span
                        className="badge ms-2 px-2 py-1"
                        style={{
                          background: "rgba(23, 162, 184, 0.2)",
                          color: "#17a2b8",
                          borderRadius: "15px",
                          fontSize: "0.7rem",
                        }}
                      >
                        First 10 rows
                      </span>
                    </h4>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-dark table-hover">
                      <thead>
                        <tr style={{ borderBottom: "2px solid rgba(23, 162, 184, 0.3)" }}>
                          <th className="py-3 px-4" style={{ background: "rgba(23, 162, 184, 0.1)" }}>
                            X
                          </th>
                          <th className="py-3 px-4" style={{ background: "rgba(23, 162, 184, 0.1)" }}>
                            Y
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.data_preview.slice(0, 10).map((row, index) => (
                          <tr
                            key={`data-row-${index}`}
                            style={{
                              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <td className="py-2 px-4 font-monospace">{typeof row.x === 'number' ? row.x.toFixed(3) : row.x}</td>
                            <td className="py-2 px-4 font-monospace">{typeof row.y === 'number' ? row.y.toFixed(3) : row.y}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div
              className="card mb-4"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <div className="card-body p-4 text-center">
                <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                  <button 
                    className="btn px-4 py-2"
                    onClick={() => navigate('/')}
                    style={{
                      background: "transparent",
                      border: "2px solid #6c757d",
                      borderRadius: "25px",
                      color: "#6c757d",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-2px)"
                      e.target.style.boxShadow = "0 8px 25px rgba(108, 117, 125, 0.4)"
                      e.target.style.textShadow = "0 0 10px rgba(108, 117, 125, 0.6)"
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)"
                      e.target.style.boxShadow = "none"
                      e.target.style.textShadow = "none"
                    }}
                  >
                    <i className="fas fa-home me-2"></i> HOME
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedAnalysisView;
