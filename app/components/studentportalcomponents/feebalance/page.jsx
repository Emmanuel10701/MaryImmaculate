'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Wallet, 
  ArrowUpRight,
  Download,
  Info,
  User,
  GraduationCap,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { CircularProgress } from '@mui/material';

const FeesView = ({ student, token }) => {
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      if (!student?.admissionNumber) {
        setError('No admission number found');
        setLoading(false);
        return;
      }
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/feebalances/${student.admissionNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setFeeData(data.data);
        } else {
          throw new Error(data.message || 'No fee data found');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        toast.error('Failed to load fees');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFees();
  }, [student?.admissionNumber, token]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status based on balance with new logic
  const getPaymentStatus = (fee) => {
    if (fee.balance === 0) {
      return {
        status: 'completed',
        label: 'completed',
        description: 'Fees completed',
        icon: <CheckCircle size={24} />
      };
    } else if (fee.balance < 0) {
      return {
        status: 'overpaid',
        label: 'overpaid',
        description: `Overpaid by ${formatCurrency(Math.abs(fee.balance))}`,
        icon: <DollarSign size={24} />
      };
    } else if (fee.amountPaid > 0) {
      return {
        status: 'partial',
        label: 'partial',
        description: `${((fee.amountPaid / fee.amount) * 100).toFixed(1)}% paid`,
        icon: <Clock size={24} />
      };
    }
    return {
      status: 'pending',
      label: 'pending',
      description: 'Payment pending',
      icon: <Clock size={24} />
    };
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'overpaid':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'partial':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-rose-100 text-rose-700 border-rose-200';
    }
  };

  // Get icon container style
  const getIconContainerStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 border-emerald-100 text-emerald-500';
      case 'overpaid':
        return 'bg-purple-50 border-purple-100 text-purple-500';
      case 'partial':
        return 'bg-amber-50 border-amber-100 text-amber-500';
      default:
        return 'bg-rose-50 border-rose-100 text-rose-500';
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="mx-auto bg-slate-50 p-4 md:p-8 font-sans text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} className="mb-4" />
          <p className="text-slate-600">Loading fee information...</p>
          <p className="text-sm text-slate-400 mt-2">
            Admission: {student?.admissionNumber || 'Not found'}
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Fees</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No Data State
  if (!feeData?.feeBalances?.length) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Fee Records</h3>
            <p className="text-slate-600">No fee statements found for your account.</p>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  const { feeBalances, summary } = feeData;
  const firstStudent = feeBalances[0]?.student || student;
  const paidPercentage = summary?.totalAmount > 0 
    ? (summary.totalPaid / summary.totalAmount) * 100 
    : 0;

  return (
    <div className=" bg-slate-50 p-4 md:p-2 font-sans text-slate-900 mb-1">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800"> Your Fee Statement</h1>
            <p className="text-slate-500 flex items-center gap-2 mt-1">
              <GraduationCap size={18} />
              {firstStudent?.firstName} {firstStudent?.lastName} • Adm: {firstStudent?.admissionNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Progress */}
        <div className="lg:col-span-1 space-y-6">
          {/* Total Balance Card */}
          <div className="bg-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
            <div className="relative z-10">
              <p className="text-indigo-200 text-sm font-medium mb-1">Total Outstanding Balance</p>
              <h2 className="text-3xl font-bold mb-6">
                {summary?.totalBalance >= 0 
                  ? formatCurrency(summary.totalBalance)
                  : `(${formatCurrency(Math.abs(summary.totalBalance))})`}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-indigo-200">Payment Progress</span>
                  <span>{paidPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-indigo-800/50 rounded-full h-2">
                  <div 
                    className="bg-indigo-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(paidPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between pt-2 border-t border-indigo-800">
                  <div>
                    <p className="text-[10px] text-indigo-300 uppercase tracking-wider">Total Billed</p>
                    <p className="text-sm font-semibold">{formatCurrency(summary.totalAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-indigo-300 uppercase tracking-wider">Total Paid</p>
                    <p className="text-sm font-semibold">{formatCurrency(summary.totalPaid)}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-800/30 rounded-full blur-2xl"></div>
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Info size={16} className="text-indigo-500" />
              Student Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-tight">Current Class</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {firstStudent?.form} {firstStudent?.stream || ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-tight">Payment Account</p>
                  <p className="text-sm font-semibold text-slate-700">M-PESA / Bank Transfer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fee Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-800">Fee Breakdowns</h3>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
              {feeBalances.length} Records
            </span>
          </div>

          {feeBalances.map((fee) => {
            const paymentStatus = getPaymentStatus(fee);
            const showOverpaymentNote = fee.balance < 0;
            
            return (
              <div 
                key={fee.id || fee._id} 
                className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-indigo-100 transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${getIconContainerStyle(paymentStatus.status)}`}>
                    {paymentStatus.icon}
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusStyle(paymentStatus.status)}`}>
                        {paymentStatus.label}
                      </span>
                      <span className="text-xs text-slate-400">• {fee.academicYear}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      {fee.term} - {fee.form}
                    </h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> Due {formatDate(fee.dueDate)}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <CreditCard size={12} /> Adm: {fee.admissionNumber}
                      </p>
                    </div>
                    
                    {/* Overpayment Note */}
                    {showOverpaymentNote && (
                      <div className="mt-2 p-2 bg-purple-50 border border-purple-100 rounded-lg">
                        <p className="text-xs text-purple-700 flex items-center gap-1">
                          <Info size={12} />
                          Overpayment of {formatCurrency(Math.abs(fee.balance))} will reflect in your portal in next term
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Amount Section */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50 gap-2">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {fee.balance === 0 ? 'Status' : 
                         fee.balance < 0 ? 'Overpayment' : 'Balance'}
                      </p>
                      <p className={`text-lg font-bold leading-tight ${
                        fee.balance === 0 
                          ? 'text-emerald-600'
                          : fee.balance < 0 
                          ? 'text-purple-600'
                          : 'text-slate-900'
                      }`}>
                        {fee.balance === 0 
                          ? 'Completed' 
                          : fee.balance < 0 
                          ? `+${formatCurrency(Math.abs(fee.balance))}`
                          : formatCurrency(fee.balance)
                        }
                      </p>
                      <div className="mt-1">
                        <p className="text-[10px] text-slate-500 font-medium">
                          Total: {formatCurrency(fee.amount)}
                        </p>
                        {fee.amountPaid > 0 && (
                          <p className="text-[10px] text-emerald-600 font-medium">
                            Paid: {formatCurrency(fee.amountPaid)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                  </div>
                </div>
                
                {/* Progress bar for partial payments */}
                {fee.amountPaid > 0 && fee.balance > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Payment Progress</span>
                      <span>{((fee.amountPaid / fee.amount) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div 
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{ width: `${(fee.amountPaid / fee.amount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Information Footer */}
          <div className="mt-8 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
              <CreditCard size={24} />
            </div>
            <h5 className="text-sm font-bold text-slate-600">Need help with payments?</h5>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              {summary?.totalBalance < 0 
                ? 'Your overpayment will be automatically applied to your next term fees.'
                : 'If you notice any discrepancies in your fee balance, please contact the accounts office.'
              }
            </p>
         <button
  onClick={() => window.location.href = 'tel:+254700123456'}
  className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
>
  Contact Support
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesView;