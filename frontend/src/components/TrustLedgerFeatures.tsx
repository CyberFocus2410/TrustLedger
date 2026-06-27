import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Calculator, Send } from 'lucide-react';

/**
 * FEATURE 1 — Score Breakdown Panel
 * 
 * Renders a weighted breakdown of how the underwriting score was calculated.
 * The score is determined by 5 weighted components:
 * - Transaction Volume Consistency: 30%
 * - Payment Failure Rate: 25%
 * - Revenue Growth Trend: 20%
 * - Average Ticket Size: 15%
 * - Settlement Regularity: 10%
 */
export interface ScoreBreakdownProps {
  scores: {
    volume: number;
    failureRate: number;
    growth: number;
    ticketSize: number;
    settlement: number;
  };
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ scores }) => {
  const { volume, failureRate, growth, ticketSize, settlement } = scores;

  // Compute the weighted total score (0-100)
  const weightedTotal = Math.round(
    volume * 0.3 + 
    failureRate * 0.25 + 
    growth * 0.2 + 
    ticketSize * 0.15 + 
    settlement * 0.1
  );

  // Helper to resolve bar colors based on score value
  const getProgressBarColor = (val: number) => {
    if (val > 70) return 'bg-emerald-500';
    if (val >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getTextColor = (val: number) => {
    if (val > 70) return 'text-emerald-400';
    if (val >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  // Helper to generate dynamic factor-specific underwriting insights
  const getInsightText = (factor: string, val: number) => {
    switch (factor) {
      case 'volume':
        if (val > 70) return 'Highly consistent and predictable transaction volume.';
        if (val >= 40) return 'Moderate volume consistency with minor seasonal variations.';
        return 'Highly irregular transaction volume patterns observed.';
      case 'failureRate':
        if (val > 70) return `Low failure rate of ${(100 - val).toFixed(1)}% detected.`;
        if (val >= 40) return `Acceptable failure rate of ${(100 - val).toFixed(1)}%.`;
        return `Critical failure rate of ${(100 - val).toFixed(1)}% detected.`;
      case 'growth':
        if (val > 70) return 'Strong positive MoM revenue growth trend.';
        if (val >= 40) return 'Stable, flat MoM revenue trajectory.';
        return 'Negative revenue growth trajectory over the past month.';
      case 'ticketSize':
        if (val > 70) return 'Premium average ticket size indicates high value customers.';
        if (val >= 40) return 'Healthy average ticket size, standard merchant profile.';
        return 'Micro-transaction average ticket size penalty applied.';
      case 'settlement':
        if (val > 70) return 'Prompt settlement cycle verified (T+0 / T+1).';
        if (val >= 40) return 'Minor settlement delays detected, typical liquidity locks.';
        return 'Highly irregular or volatile settlement cycles.';
      default:
        return '';
    }
  };

  const factors = [
    { key: 'volume', name: 'Transaction Volume Consistency', weight: 30, val: volume },
    { key: 'failureRate', name: 'Payment Failure Rate', weight: 25, val: failureRate },
    { key: 'growth', name: 'Revenue Growth Trend', weight: 20, val: growth },
    { key: 'ticketSize', name: 'Average Ticket Size', weight: 15, val: ticketSize },
    { key: 'settlement', name: 'Settlement Regularity', weight: 10, val: settlement },
  ];

  return (
    <div className="w-full bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 mt-6 text-left">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weighted Score Breakdown</h4>
        <span className={`text-sm font-bold ${getTextColor(weightedTotal)}`}>
          Weighted Total: {weightedTotal}/100
        </span>
      </div>

      <div className="space-y-4">
        {factors.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-gray-300">
              <span>{f.name} ({f.weight}%)</span>
              <span className={getTextColor(f.val)}>{f.val}%</span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(f.val)}`}
                style={{ width: `${f.val}%` }}
              />
            </div>

            {/* Subtext Insight */}
            <p className="text-[10px] text-gray-500 italic">
              {getInsightText(f.key, f.val)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};


/**
 * FEATURE 2 — Demo Mode Banner
 * 
 * Replaces hardcoded file layout reminders with a clean indicator.
 * Provides preset merchant files loader triggers (Excellent, Good, Poor)
 * styled as pill buttons.
 */
export interface DemoModeBannerProps {
  onPresetLoad: (profile: 'excellent' | 'good' | 'poor') => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ onPresetLoad }) => {
  return (
    <div className="w-full bg-blue-950/20 border border-blue-500/10 rounded-xl p-4 mb-4 text-left">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <span className="bg-blue-500 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
            DEMO MODE ACTIVE
          </span>
          <span className="text-xs text-blue-400 font-bold">
            Load a sample merchant profile instantly
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onPresetLoad('excellent')}
            className="py-1.5 px-4 rounded-full text-xs font-bold transition duration-200 cursor-pointer bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Excellent Profile
          </button>
          <button
            onClick={() => onPresetLoad('good')}
            className="py-1.5 px-4 rounded-full text-xs font-bold transition duration-200 cursor-pointer bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Good Profile
          </button>
          <button
            onClick={() => onPresetLoad('poor')}
            className="py-1.5 px-4 rounded-full text-xs font-bold transition duration-200 cursor-pointer bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            Poor Profile
          </button>
          <button
            onClick={() => onPresetLoad('injection')}
            className="py-1.5 px-4 rounded-full text-xs font-bold transition duration-200 cursor-pointer bg-rose-950/20 border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center space-x-1.5"
          >
            <AlertTriangle className="h-3 w-3 animate-pulse text-rose-400" />
            <span>CSV Injection Demo</span>
          </button>
        </div>
        <div className="text-[10px] text-gray-400/80 font-semibold mt-2 pt-2 border-t border-blue-500/5">
          Interested in more credit scoring protocols?{' '}
          <a 
            href="https://agentfield.ai/?utm_source=luma" 
            target="_blank" 
            rel="noreferrer" 
            className="text-blue-400 hover:text-blue-300 hover:underline font-bold transition duration-200"
          >
            Explore the AI Agent ecosystem on Agentfield
          </a>
        </div>
      </div>
    </div>
  );
};


/**
 * FEATURE 3 — Lender Loan Offer Flow
 * 
 * Displayed below the credit report card inside the Lender Portal.
 * Enables lenders to input variables, calculate monthly payments (EMI),
 * and submit cryptographic loan offers back to the merchant on-chain.
 */
export interface LoanOfferPanelProps {
  verificationStatus: 'VALID' | 'INVALID' | string;
  merchantAddress: string;
  merchantScore: number;
}

export const LoanOfferPanel: React.FC<LoanOfferPanelProps> = ({
  verificationStatus,
  merchantAddress,
  merchantScore: _merchantScore,
}) => {
  const [loanAmount, setLoanAmount] = useState<string>('500000');
  const [interestRate, setInterestRate] = useState<string>('12.5');
  const [tenure, setTenure] = useState<number>(12); // months
  const [computedEMI, setComputedEMI] = useState<number | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  if (verificationStatus !== 'VALID') return null;

  const handleCalculateEMI = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const n = tenure;

    if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate < 0) {
      alert("Please enter valid positive values for Loan Amount and Interest Rate.");
      return;
    }

    const r = (annualRate / 12) / 100;
    let emi = 0;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    setComputedEMI(Math.round(emi));
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!computedEMI) {
      // Calculate automatically on submit if not calculated already
      const P = parseFloat(loanAmount);
      const annualRate = parseFloat(interestRate);
      const n = tenure;
      if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate < 0) {
        alert("Please enter valid positive values for Loan Amount and Interest Rate.");
        return;
      }
      const r = (annualRate / 12) / 100;
      const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setComputedEMI(Math.round(emi));
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-3xl p-8 mt-6 text-left shadow-2xl relative">
      <div className="flex items-center space-x-2.5 mb-4 border-b border-gray-700/50 pb-4">
        <Calculator className="h-5 w-5 text-blue-400" />
        <h3 className="text-md font-bold text-white uppercase tracking-wider">
          Draft Credit Loan Offer
        </h3>
      </div>

      {showToast && (
        <div className="absolute top-4 right-8 bg-blue-600 border border-blue-400 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg flex items-center space-x-2 animate-bounce z-50">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Offer submitted to blockchain ✓</span>
        </div>
      )}

      <form onSubmit={handleSubmitOffer} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Loan Amount Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Loan Amount (Principal)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-bold text-sm">₹</span>
              <input
                type="number"
                placeholder="500000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 rounded-xl py-2 pl-7 pr-3 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Interest Rate Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Interest Rate (p.a.)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                placeholder="12.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 rounded-xl py-2 pl-3 pr-8 text-sm text-white focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 font-bold text-sm">%</span>
            </div>
          </div>

          {/* Tenure Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Tenure Duration
            </label>
            <select
              value={tenure}
              onChange={(e) => setTenure(parseInt(e.target.value))}
              className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 rounded-xl py-2 px-3 text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
              <option value={24}>24 months</option>
            </select>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={handleCalculateEMI}
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-700/60 border border-gray-700 text-gray-200 text-xs font-bold py-2.5 px-6 rounded-xl transition duration-200 cursor-pointer focus:outline-none"
          >
            Calculate EMI
          </button>

          {computedEMI !== null && (
            <div className="flex-grow flex items-center space-x-3 w-full bg-gray-900/60 border border-gray-700/30 rounded-xl py-2 px-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Monthly EMI Payback:
              </span>
              <span className="text-md font-extrabold text-emerald-400">
                ₹{computedEMI.toLocaleString('en-IN')} / month
              </span>
            </div>
          )}
        </div>

        {/* Submit Offer CTA */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl transition duration-200 hover:scale-[1.01] shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2 cursor-pointer focus:outline-none"
        >
          <Send className="h-4 w-4" />
          <span>Submit Offer to Merchant ({merchantAddress.slice(0, 6)}...{merchantAddress.slice(-4)})</span>
        </button>
      </form>
    </div>
  );
};


/**
 * FEATURE 4 — Risk Flag Section
 * 
 * Checks for operational metrics violations and warns underwriters of risk exposure.
 * Rendered in the Merchant Dashboard below the Top Credit Factors.
 */
export interface RiskFlagsProps {
  volumeConsistency: number;
  failureRate: number; // Raw failure percentage (e.g. 15 for 15% failed transactions)
  growth: number;
}

export const RiskFlags: React.FC<RiskFlagsProps> = ({
  volumeConsistency,
  failureRate,
  growth,
}) => {
  const flags: string[] = [];

  // Derive risk signals from score parameters
  if (growth < 50) {
    flags.push("Flat or declining revenue trend detected");
  }
  if (volumeConsistency < 60) {
    flags.push("Irregular transaction volume pattern");
  }
  if (failureRate > 30) {
    flags.push("Above-average payment failure rate");
  }

  return (
    <div className="w-full bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50 mt-6 text-left">
      <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-4">
        Risk Signals
      </span>

      {flags.length > 0 ? (
        <div className="space-y-3">
          {flags.map((flag, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 border-l-4 border-l-amber-500 text-xs font-bold"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
              <span className="leading-relaxed text-gray-300">{flag}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-start space-x-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 border-l-4 border-l-emerald-500 text-xs font-bold text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
          <span className="leading-relaxed">No significant risk signals detected</span>
        </div>
      )}
    </div>
  );
};
