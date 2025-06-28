import React from 'react';
import '../css/Pricing.css';

const Pricing = () => {

  const pricingPlans = [
    {
      name: 'Anonymous',
      description: 'Use signal analysis tools without registration',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Access to our state of the art AI model',
        'Basic signal analysis',
        'Unlimited Signal generation',
        'No account required'
      ],
      limitations: [
        'Results and data not saved',
        'No Visualization tools',
        'No sharing options',
        'Limited advanced features'
      ],
      buttonText: 'Start Anonymous',
      buttonClass: 'btn-outline-primary',
      popular: false
    },
    {
      name: 'Registered',
      description: 'Full access with account registration',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Access to our state of the art AI model',
        'Advanced signal analysis',
        'Unlimited signal generation',
        'Account required',
        'Save and manage analyses',
        'Advanced visualization and plots',
        'Public and private sharing options',
        'Password-protected sharing',
        'Data retrieval options (CSV)',
        'Analysis history',
        'Profile management'
      ],
      limitations: [],
      buttonText: 'Register Free',
      buttonClass: 'btn-primary',
      popular: true
    }
  ];

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
            {/* Header Section */}
            <div className="text-center mb-5">
              <div
                className="mb-4"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)",
                  borderRadius: "50%",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  border: "2px solid rgba(255, 193, 7, 0.2)",
                }}
              >
                <i
                  className="fas fa-chart-line"
                  style={{
                    fontSize: "2.5rem",
                    color: "#ffc107",
                  }}
                />
              </div>
              <h1 
                className="text-light mb-3"
                style={{ 
                  fontSize: "2.5rem", 
                  fontWeight: "700",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
                }}
              >
                Choose Your <span style={{ color: "#ffc107" }}>Signal Analysis</span> Plan
              </h1>
              <p 
                className="text-muted fs-5 mb-0"
                style={{ maxWidth: "600px", margin: "0 auto" }}
              >
                All features are free - choose based on your preferences
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="row justify-content-center g-4">
              {pricingPlans.map((plan) => (
                <div key={plan.name} className="col-lg-5 col-xl-4">
                  <div 
                    className="h-100 pricing-card-hover"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(10px)",
                      border: plan.popular ? "2px solid rgba(255, 193, 7, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "25px",
                      boxShadow: plan.popular 
                        ? "0 20px 40px rgba(255, 193, 7, 0.2)" 
                        : "0 20px 40px rgba(0, 0, 0, 0.3)",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {plan.popular && (
                      <div 
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "20px",
                          background: "linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)",
                          color: "#000",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          boxShadow: "0 4px 15px rgba(255, 193, 7, 0.4)"
                        }}
                      >
                        Most Popular
                      </div>
                    )}
                  
                    <div className="p-4 text-center">
                      {/* Plan Icon */}
                      <div
                        className="mb-4"
                        style={{
                          background: plan.popular 
                            ? "linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 193, 7, 0.08) 100%)"
                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                          borderRadius: "50%",
                          width: "80px",
                          height: "80px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                          border: plan.popular 
                            ? "2px solid rgba(255, 193, 7, 0.3)"
                            : "2px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <i
                          className={plan.name === 'Anonymous' ? 'fas fa-user-secret' : 'fas fa-user-check'}
                          style={{
                            fontSize: "2rem",
                            color: plan.popular ? "#ffc107" : "#fff",
                          }}
                        />
                      </div>

                      {/* Plan Name */}
                      <h3 
                        className="text-light mb-2"
                        style={{ 
                          fontSize: "1.8rem", 
                          fontWeight: "700" 
                        }}
                      >
                        {plan.name}
                      </h3>
                      
                      {/* Plan Description */}
                      <p className="text-muted mb-4">
                        {plan.description}
                      </p>
                      
                      {/* Price */}
                      <div className="mb-4">
                        <div 
                          style={{ 
                            fontSize: "3rem", 
                            fontWeight: "700", 
                            color: plan.popular ? "#ffc107" : "#fff" 
                          }}
                        >
                          <span style={{ fontSize: "1.5rem" }}>$</span>0<span 
                            style={{ 
                              fontSize: "1rem", 
                              color: "#888", 
                              fontWeight: "400" 
                            }}
                          >
                            /free
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="px-4 pb-4">
                      <ul className="list-unstyled">
                        {plan.features.map((feature, featureIndex) => (
                          <li 
                            key={`${plan.name}-feature-${featureIndex}`} 
                            className="d-flex align-items-center mb-3"
                          >
                            <i 
                              className="fas fa-check-circle me-3"
                              style={{ 
                                color: "#22c55e", 
                                fontSize: "1.1rem" 
                              }}
                            />
                            <span className="text-light">{feature}</span>
                          </li>
                        ))}
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li 
                            key={`${plan.name}-limit-${limitIndex}`} 
                            className="d-flex align-items-center mb-3"
                          >
                            <i 
                              className="fas fa-times-circle me-3"
                              style={{ 
                                color: "#ef4444", 
                                fontSize: "1.1rem" 
                              }}
                            />
                            <span className="text-muted">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 pt-0">
                      {/* Buttons removed */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
