'use client';
import { dummyMetrics } from './data/dummyData'; // Adjusted path
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, BookOpen, ShoppingCart, User, FileText, Calendar } from 'lucide-react';

export default function DashboardOverview() {
  const chartData = [
    { name: 'Monthly Revenue', value: dummyMetrics.monthlyRevenue || 0, color: '#2563eb' },
    { name: 'Weekly Revenue', value: dummyMetrics.weeklyRevenue || 0, color: '#059669' },
    { name: 'Total Bookings', value: (dummyMetrics.totalBookings || 0) * 1000, color: '#d97706' },
    { name: 'Purchasing Requests', value: (dummyMetrics.totalPurchasingRequests || 0) * 1000, color: '#dc2626' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 container max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 tracking-tight">
        Dashboard Overview
      </h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Monthly Revenue</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                LKR {(dummyMetrics.monthlyRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Weekly Revenue</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                LKR {(dummyMetrics.weeklyRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Bookings</h3>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {dummyMetrics.totalBookings || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Purchasing Requests</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {dummyMetrics.totalPurchasingRequests || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">
        Revenue & Activity Breakdown
      </h3>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
              labelLine={true}
              animationDuration={1000}
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="none"
                  fillOpacity={0.9}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) =>
                name === 'Monthly Revenue' || name === 'Weekly Revenue'
                  ? `LKR ${value.toLocaleString()}`
                  : Number(value) / 1000
              }
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                color: '#1f2937',
                padding: '8px 12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              itemStyle={{ color: '#1f2937' }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={12}
              wrapperStyle={{ paddingTop: '1.5rem', fontSize: '14px', color: '#1f2937' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Insights Section */}
      <h3 className="text-2xl font-bold mb-6 mt-10 text-gray-900 dark:text-gray-100 tracking-tight">
        Quick Insights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Latest User</h4>
              <p className="text-gray-700 dark:text-gray-300">{dummyMetrics.latestUser?.username || 'N/A'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{dummyMetrics.latestUser?.email || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Latest Content</h4>
              <p className="text-gray-700 dark:text-gray-300">{dummyMetrics.latestContent?.title || 'N/A'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{dummyMetrics.latestContent?.type || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Latest Booking</h4>
              <p className="text-gray-700 dark:text-gray-300">Booking ID: {dummyMetrics.latestBooking?.id || 'N/A'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">User: {dummyMetrics.latestBooking?.user || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}