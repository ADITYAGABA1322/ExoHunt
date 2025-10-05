'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Cpu, Sliders, Info, Save, RotateCcw, Zap, Brain } from 'lucide-react'

export default function ModelConfig() {
  const [config, setConfig] = useState({
    n_estimators: 500,
    max_depth: 10,
    learning_rate: 0.05,
    min_samples_split: 5,
    feature_selection: true,
    smote_balance: true
  })

  const [saved, setSaved] = useState(false)

  const resetConfig = () => {
    setConfig({
      n_estimators: 500,
      max_depth: 10,
      learning_rate: 0.05,
      min_samples_split: 5,
      feature_selection: true,
      smote_balance: true
    })
  }

  const saveConfig = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Model Configuration
        </h2>
        <p className="text-gray-400">Fine-tune hyperparameters for optimal performance</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ensemble Architecture */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold">Ensemble Architecture</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Random Forest</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xs text-gray-500">Base Learner 1/5</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">XGBoost</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xs text-gray-500">Base Learner 2/5</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">LightGBM</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xs text-gray-500">Base Learner 3/5</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">CatBoost</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xs text-gray-500">Base Learner 4/5</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Extra Trees</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xs text-gray-500">Base Learner 5/5</div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-purple-400">Gradient Boosting</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xs text-gray-400">Meta-Learner (Stacking)</div>
            </div>
          </div>
        </motion.div>

        {/* Hyperparameters */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sliders className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold">Hyperparameters</h3>
          </div>

          <div className="space-y-6">
            {/* N Estimators */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Number of Estimators</label>
                <span className="text-sm font-bold text-purple-400">{config.n_estimators}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={config.n_estimators}
                onChange={(e) => setConfig({ ...config, n_estimators: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Max Depth */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Max Depth</label>
                <span className="text-sm font-bold text-purple-400">{config.max_depth}</span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                step="1"
                value={config.max_depth}
                onChange={(e) => setConfig({ ...config, max_depth: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Learning Rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Learning Rate</label>
                <span className="text-sm font-bold text-purple-400">{config.learning_rate}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.3"
                step="0.01"
                value={config.learning_rate}
                onChange={(e) => setConfig({ ...config, learning_rate: parseFloat(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Min Samples Split */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Min Samples Split</label>
                <span className="text-sm font-bold text-purple-400">{config.min_samples_split}</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={config.min_samples_split}
                onChange={(e) => setConfig({ ...config, min_samples_split: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-400">Feature Selection</span>
                <input
                  type="checkbox"
                  checked={config.feature_selection}
                  onChange={(e) => setConfig({ ...config, feature_selection: e.target.checked })}
                  className="w-5 h-5 rounded accent-purple-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-400">SMOTE Balancing</span>
                <input
                  type="checkbox"
                  checked={config.smote_balance}
                  onChange={(e) => setConfig({ ...config, smote_balance: e.target.checked })}
                  className="w-5 h-5 rounded accent-purple-500"
                />
              </label>
            </div>
          </div>
        </motion.div>

        {/* Info & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Training Info */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-3xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">Training Info</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Dataset Size</span>
                <span className="text-sm font-bold text-green-400">10,612 samples</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Features</span>
                <span className="text-sm font-bold text-green-400">30 engineered</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">CV Folds</span>
                <span className="text-sm font-bold text-green-400">10-fold</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Training Time</span>
                <span className="text-sm font-bold text-green-400">~8 minutes</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              onClick={saveConfig}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/50"
            >
              <Save className="w-5 h-5" />
              {saved ? 'Configuration Saved!' : 'Save Configuration'}
            </motion.button>

            <motion.button
              onClick={resetConfig}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-gray-300 font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset to Defaults
            </motion.button>
          </div>

          {/* Model Architecture Diagram */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h4 className="text-sm font-bold text-gray-400 mb-4">Architecture Flow</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-transparent" />
                <span className="text-xs text-gray-500">Input Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-transparent" />
                <span className="text-xs text-gray-500">Feature Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full" />
                <div className="flex-1 h-1 bg-gradient-to-r from-pink-500 to-transparent" />
                <span className="text-xs text-gray-500">Base Models (5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-transparent" />
                <span className="text-xs text-gray-500">Meta-Learner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <div className="flex-1 h-1 bg-gradient-to-r from-yellow-500 to-transparent" />
                <span className="text-xs text-gray-500">Prediction</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}