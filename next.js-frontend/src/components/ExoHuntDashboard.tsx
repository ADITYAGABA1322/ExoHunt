'use client'

import { useState } from 'react'
import { Search, Sparkles, BarChart3, Database, Info, CheckCircle2, XCircle } from 'lucide-react'

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

export default function ExoHuntDashboard() {
  const [formData, setFormData] = useState({
    period: '3.52',
    duration: '2.8',
    depth: '615.0',
    prad: '2.26',
    teq: '1540.0',
    insol: '340.0',
    steff: '5455.0',
    slogg: '4.467',
    srad: '0.927'
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://exohunt.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: parseFloat(formData.period),
          duration: parseFloat(formData.duration),
          depth: parseFloat(formData.depth),
          prad: parseFloat(formData.prad),
          teq: parseFloat(formData.teq),
          insol: parseFloat(formData.insol),
          steff: parseFloat(formData.steff),
          slogg: parseFloat(formData.slogg),
          srad: parseFloat(formData.srad)
        })
      })

      if (!response.ok) throw new Error('Prediction failed')
      
      const data = await response.json()
      setPrediction(data)
    } catch (err) {
      setError('Failed to get prediction. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: 'exoplanet' | 'non-exoplanet') => {
    if (example === 'exoplanet') {
      setFormData({
        period: '3.52',
        duration: '2.8',
        depth: '615.0',
        prad: '2.26',
        teq: '1540.0',
        insol: '340.0',
        steff: '5455.0',
        slogg: '4.467',
        srad: '0.927'
      })
    } else {
      setFormData({
        period: '19.89',
        duration: '1.78',
        depth: '10829.0',
        prad: '14.6',
        teq: '638.0',
        insol: '39.3',
        steff: '5853.0',
        slogg: '4.544',
        srad: '0.868'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-purple-400" />
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              ExoHunt
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-Powered Exoplanet Discovery Platform
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="px-4 py-2 bg-green-500/20 rounded-full border border-green-500/50">
              <span className="text-green-400 font-semibold">✓ 90.44% Accuracy</span>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/50">
              <span className="text-blue-400 font-semibold">🚀 Stacking Ensemble</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Input Parameters</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              {Object.entries({
                period: 'Orbital Period (days)',
                duration: 'Transit Duration (hours)',
                depth: 'Transit Depth (ppm)',
                prad: 'Planet Radius (Earth radii)',
                teq: 'Equilibrium Temperature (K)',
                insol: 'Insolation Flux (Earth flux)',
                steff: 'Stellar Temperature (K)',
                slogg: 'Stellar Surface Gravity',
                srad: 'Stellar Radius (Solar radii)'
              }).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              ))}

              {/* Quick load buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => loadExample('exoplanet')}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 font-medium transition"
                >
                  Load Exoplanet Example
                </button>
                <button
                  type="button"
                  onClick={() => loadExample('non-exoplanet')}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 font-medium transition"
                >
                  Load Non-Exoplanet
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Predict Exoplanet
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {prediction ? (
              <>
                {/* Main Result Card */}
                <div className={`p-8 rounded-2xl border-2 ${
                  prediction.is_exoplanet 
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50' 
                    : 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/50'
                } backdrop-blur-lg`}>
                  <div className="flex items-center gap-4 mb-4">
                    {prediction.is_exoplanet ? (
                      <CheckCircle2 className="w-16 h-16 text-green-400" />
                    ) : (
                      <XCircle className="w-16 h-16 text-red-400" />
                    )}
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">
                        {prediction.is_exoplanet ? 'Exoplanet Detected!' : 'Not an Exoplanet'}
                      </h3>
                      <p className="text-xl text-gray-300">{prediction.classification}</p>
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Confidence</span>
                      <span className="font-bold">{(prediction.confidence * 100).toFixed(2)}%</span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          prediction.is_exoplanet ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Probability Breakdown */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    Probability Breakdown
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-400">Exoplanet</span>
                        <span className="text-white font-bold">
                          {(prediction.probability_exoplanet * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                          style={{ width: `${prediction.probability_exoplanet * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-red-400">Non-Exoplanet</span>
                        <span className="text-white font-bold">
                          {(prediction.probability_non_exoplanet * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                          style={{ width: `${prediction.probability_non_exoplanet * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Model Metrics */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-purple-400" />
                    Model Performance
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">
                        {(prediction.model_metrics.accuracy * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {(prediction.model_metrics.f1_score * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400 mt-1">F1 Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-400">
                        {(prediction.model_metrics.roc_auc * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400 mt-1">ROC-AUC</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Discover</h3>
                <p className="text-gray-400">Enter parameters and click predict to discover exoplanets</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}