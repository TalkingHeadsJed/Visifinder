import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, Target, TrendingUp, RefreshCw, ArrowLeft, Trash2, Calendar, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      let url = `${API_URL}/api/ab-stats`;
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${API_URL}/api/ab-reset`, { method: 'POST' });
      const data = await response.json();
      if (data.status === 'reset_complete') {
        setShowResetConfirm(false);
        fetchStats();
      }
    } catch (e) {
      console.error('Failed to reset:', e);
    }
    setResetting(false);
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refetch when dates change
  useEffect(() => {
    if (stats) fetchStats();
  }, [startDate, endDate]);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${color}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </motion.div>
  );

  const VariantCard = ({ variant, data, color, delay = 0 }) => {
    const totalVslVisits = (stats?.variant_a?.vsl_visits || 0) + (stats?.variant_b?.vsl_visits || 0);
    const vslPercentage = totalVslVisits > 0 ? ((data.vsl_visits / totalVslVisits) * 100).toFixed(0) : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-4 h-4 rounded-full ${color}`}></div>
          <h3 className="text-xl font-bold text-gray-900">Variant {variant}</h3>
          <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${color.replace('bg-', 'bg-opacity-20 text-').replace('-500', '-600')}`}>
            {variant === 'A' ? 'Control' : 'Challenger'}
          </span>
        </div>
        
        <div className="space-y-4">
          {/* Landing Page Visits */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Landing Page Visits</span>
              <span className="font-semibold">{data.vsl_visits || 0}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${vslPercentage}%` }}
                transition={{ delay: delay + 0.3, duration: 0.8 }}
                className={`h-full ${color} rounded-full`}
              />
            </div>
          </div>
          
          {/* Schedule Page Visits */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Schedule Page Visits</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">CTR: {data.ctr || '0%'}</span>
                <span className="font-semibold">{data.schedule_visits || 0}</span>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.vsl_visits > 0 ? (data.schedule_visits / data.vsl_visits) * 100 : 0}%` }}
                transition={{ delay: delay + 0.4, duration: 0.8 }}
                className={`h-full ${color} opacity-75 rounded-full`}
              />
            </div>
          </div>

          {/* Bookings */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Bookings (Conversions)</span>
              <span className="font-semibold">{data.conversions || 0}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.schedule_visits > 0 ? (data.conversions / data.schedule_visits) * 100 : 0}%` }}
                transition={{ delay: delay + 0.5, duration: 0.8 }}
                className={`h-full ${color} opacity-50 rounded-full`}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Booking Rate</span>
              <span className={`text-2xl font-bold ${color.replace('bg-', 'text-')}`}>
                {data.conversion_rate || '0%'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
          <div className={`w-4 h-4 rounded-full ${color}`}></div>
          <h3 className="text-xl font-bold text-gray-900">Variant {variant}</h3>
          <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${color.replace('bg-', 'bg-opacity-20 text-').replace('-500', '-600')}`}>
            {variant === 'A' ? 'Control' : 'Challenger'}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Schedule Page Visits</span>
              <span className="font-semibold">{data.visits}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${visitPercentage}%` }}
                transition={{ delay: delay + 0.3, duration: 0.8 }}
                className={`h-full ${color} rounded-full`}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Bookings (Conversions)</span>
              <span className="font-semibold">{data.conversions}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.visits > 0 ? (data.conversions / data.visits) * 100 : 0}%` }}
                transition={{ delay: delay + 0.4, duration: 0.8 }}
                className={`h-full ${color} rounded-full`}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Conversion Rate</span>
              <span className={`text-2xl font-bold ${color.replace('bg-', 'text-')}`}>
                {data.conversion_rate}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reset All Data?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete all visit tracking and conversion data. Use this when starting a new A/B test with different headlines.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset All'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="back-to-vsl"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">A/B Test Dashboard</h1>
                <p className="text-sm text-gray-500">VisiFinder Headline Test</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-sm text-gray-400">Updated: {lastUpdated}</span>
              )}
              <button
                onClick={fetchStats}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#589DFD] text-white rounded-lg hover:bg-[#4a8de8] transition-colors disabled:opacity-50"
                data-testid="refresh-stats"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                data-testid="reset-data"
              >
                <Trash2 className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
          
          {/* Date Filters */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Filter by date:</span>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#589DFD] focus:border-transparent"
              placeholder="Start date"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#589DFD] focus:border-transparent"
              placeholder="End date"
            />
            {(startDate || endDate) && (
              <button
                onClick={clearDateFilter}
                className="text-sm text-[#589DFD] hover:underline"
              >
                Clear filter
              </button>
            )}
            {(startDate || endDate) && (
              <span className="ml-auto text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Filtered view
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && !stats ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-[#589DFD]" />
          </div>
        ) : stats ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Visits"
                value={(stats.variant_a?.visits || 0) + (stats.variant_b?.visits || 0)}
                subtitle="Schedule page"
                icon={Users}
                color="border-blue-500"
                delay={0}
              />
              <StatCard
                title="Total Conversions"
                value={(stats.variant_a?.conversions || 0) + (stats.variant_b?.conversions || 0)}
                subtitle="Bookings made"
                icon={Target}
                color="border-green-500"
                delay={0.1}
              />
              <StatCard
                title="Best Performer"
                value={
                  parseFloat(stats.variant_a?.conversion_rate) > parseFloat(stats.variant_b?.conversion_rate)
                    ? 'Variant A'
                    : parseFloat(stats.variant_b?.conversion_rate) > parseFloat(stats.variant_a?.conversion_rate)
                    ? 'Variant B'
                    : 'Tie'
                }
                subtitle="Higher conversion rate"
                icon={TrendingUp}
                color="border-amber-500"
                delay={0.2}
              />
              <StatCard
                title="Test Status"
                value="Active"
                subtitle="Collecting data"
                icon={BarChart3}
                color="border-purple-500"
                delay={0.3}
              />
            </div>

            {/* Variant Comparison */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Variant Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <VariantCard 
                variant="A" 
                data={stats.variant_a || { visits: 0, conversions: 0, conversion_rate: '0%' }} 
                color="bg-blue-500"
                delay={0.4}
              />
              <VariantCard 
                variant="B" 
                data={stats.variant_b || { visits: 0, conversions: 0, conversion_rate: '0%' }} 
                color="bg-amber-500"
                delay={0.5}
              />
            </div>

            {/* Headline Reference */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Headline Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-500">Variant A (Control)</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  "97% of Your Website Visitors Leave Without a Trace — And You Have No Idea Who They Were."
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-amber-500"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-medium text-gray-500">Variant B (Challenger)</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  "You're Paying for Traffic That Disappears Forever — What If You Could See Your Visitors?"
                </p>
              </motion.div>
            </div>

            {/* Recent Conversions */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Conversions</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {stats.recent_conversions && stats.recent_conversions.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Variant</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Appointment Date</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Booked At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recent_conversions.map((conversion, index) => (
                      <tr key={conversion.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{conversion.customer_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{conversion.customer_email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            conversion.variant === 'A' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            Variant {conversion.variant}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{conversion.appointment_date}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(conversion.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-12 text-center">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No conversions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Bookings will appear here when customers schedule appointments</p>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load stats. Please try again.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-sm text-gray-400">
            VisiFinder A/B Test Dashboard • Data refreshes automatically every 30 seconds
          </p>
        </div>
      </footer>
    </div>
  );
}
