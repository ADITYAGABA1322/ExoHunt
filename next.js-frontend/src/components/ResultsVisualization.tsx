'use client'

import { motion } from 'framer-motion'
import { BarChart3, PieChart, TrendingUp, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell } from 'recharts'

interface Props {
  prediction: any
}

export default function ResultsVisualization({ prediction }: Props) {
  // Sample data for charts
  const performanceData = [
    { name: 'Accuracy', value: 90.44 },
    { name: 'Precision', value: 90.47 },
    { name: 'Recall', value: 90.39 },
    { name: 'F1 Score', value: 90.43 },
    { name: 'ROC-AUC', value: 96.56 }
  ]

  const confusionData = [
    { name: 'True Positives', value: 959, color: '#10b981' },
    { name: 'True Negatives', value: 961, color: '#3b82f6' },
    { name: 'False Positives', value: 101, color: '#f59e0b' },
    { name: 'False Negatives', value: 102, color: '#ef4444' }
  ]

  const trainingHistory = [
    { epoch: 1, loss: 0.652, accuracy: 75.2 },
    { epoch: 2, loss: 0.520, accuracy: 82.1 },
    { epoch: 3, loss: 0.438, accuracy: 86.5 },
    { epoch: 4, loss: 0.385, accuracy: 88.9 },
    { epoch: 5, loss: 0.329, accuracy: 90.4 }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Model Performance Visualization
        </h2>
        <p className="text-gray-400">Advanced analytics and insights</p>
      </motion.div>

      {prediction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-3xl border-2 ${
            prediction.is_exoplanet
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
              : 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/50'
          } backdrop-blur-xl`}
        >
          <div className="flex items-center gap-4 mb-4">
            {prediction.is_exoplanet ? (
              <CheckCircle className="w-16 h-16 text-green-400" />
            ) : (
              <XCircle className="w-16 h-16 text-red-400" />
            )}
            <div>
              <h3 className="text-3xl font-bold mb-1">
                {prediction.is_exoplanet ? 'Exoplanet Detected!' : 'Not an Exoplanet'}
              </h3>
              <p className="text-xl text-gray-300">{prediction.classification}</p>
              <p className="text-lg text-gray-400 mt-2">
                Confidence: <span className="font-bold">{(prediction.confidence * 100).toFixed(2)}%</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Performance Metrics Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold">Model Metrics</h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Confusion Matrix */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold">Confusion Matrix</h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={confusionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {confusionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Training History */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-3xl p-6 border border-green-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold">Training History</h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trainingHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="epoch" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Feature Importance */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold">Top Feature Importance</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Transit Depth', importance: 95 },
            { name: 'Planet Radius', importance: 88 },
            { name: 'Orbital Period', importance: 82 },
            { name: 'Stellar Temperature', importance: 76 },
            { name: 'Insolation Flux', importance: 71 },
            { name: 'Duration/Period Ratio', importance: 65 }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-300">{feature.name}</span>
                <span className="text-xs font-bold text-blue-400">{feature.importance}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${feature.importance}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}