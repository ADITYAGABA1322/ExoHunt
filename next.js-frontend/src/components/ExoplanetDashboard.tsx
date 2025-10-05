'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { 
  Search, Database, BarChart3, Settings, Upload, 
  Cpu, Orbit, Sparkles, TrendingUp, FileUp, Download
} from 'lucide-react'
import SpaceBackground from './SpaceBackground'
import PredictionForm from './PredictionForm'
import DataExplorer from './DataExplorer'
import ModelConfig from './ModelConfig'
import ResultsVisualization from './ResultsVisualization'

interface PredictionResult {
  is_exoplanet: boolean
  confidence: number
  probability_exoplanet: number
  probability_non_exoplanet: number
  classification: string
  model_metrics: {
    accuracy: number
    f1_score: number
    roc_auc: number
  }
}

export default function ExoplanetDashboard() {
  const [activeTab, setActiveTab] = useState('discover')
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <SpaceBackground />
      
      {/* Navigation Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-20 border-b border-white/10 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Orbit className="w-10 h-10 text-blue-500" />
                <motion.div
                  className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  EXOHUNT
                </h1>
                <p className="text-xs text-gray-400">NASA Exoplanet Discovery Platform</p>
              </div>
            </motion.div>

            {/* Model Info Badge */}
            <div className="flex items-center gap-4">
              <motion.div 
                className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/50"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-semibold">Stacking Ensemble AI</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/50"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400 font-semibold">Multi-Dataset Trained</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="flex gap-4 p-2 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 mb-8">
            {[
              { id: 'discover', icon: Search, label: 'Discover Exoplanets' },
              { id: 'data', icon: Database, label: 'Data Explorer' },
              { id: 'visualize', icon: BarChart3, label: 'Visualization' },
              { id: 'config', icon: Settings, label: 'Model Config' }
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="discover">
                <PredictionForm 
                  prediction={prediction}
                  setPrediction={setPrediction}
                  loading={loading}
                  setLoading={setLoading}
                />
              </TabsContent>

              <TabsContent value="data">
                <DataExplorer />
              </TabsContent>

              <TabsContent value="visualize">
                <ResultsVisualization prediction={prediction} />
              </TabsContent>

              <TabsContent value="config">
                <ModelConfig />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">About ExoHunt</h3>
              <p className="text-sm text-gray-400">
                Advanced AI-powered exoplanet discovery platform utilizing NASA's Kepler, K2, and TESS datasets.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">Data Sources</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• NASA Kepler Mission</li>
                <li>• K2 Extended Mission</li>
                <li>• TESS Survey</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">Model Type</h3>
              <p className="text-sm text-gray-400">
                Advanced Stacking Ensemble combining Random Forest, XGBoost, LightGBM, CatBoost, and Extra Trees classifiers.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
            <p>© 2025 ExoHunt | Powered by Advanced Machine Learning | NASA Space Apps Challenge</p>
          </div>
        </div>
      </footer>
    </div>
  )
}