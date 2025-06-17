'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function VolumeChart() {
  // Mock data - replace with real data
  const data = [
    { time: '00:00', volume: 1200 },
    { time: '04:00', volume: 1800 },
    { time: '08:00', volume: 2400 },
    { time: '12:00', volume: 3200 },
    { time: '16:00', volume: 2800 },
    { time: '20:00', volume: 3600 },
    { time: '24:00', volume: 4200 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{`Time: ${label}`}</p>
          <p className="text-blue-400 font-semibold">
            {`Volume: $${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Volume Chart</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-300">24h Volume</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="volume" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-white">$12.4K</div>
          <div className="text-sm text-gray-400">Total Volume</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">+15.3%</div>
          <div className="text-sm text-gray-400">24h Change</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">1,234</div>
          <div className="text-sm text-gray-400">Transactions</div>
        </div>
      </div>
    </div>
  )
}