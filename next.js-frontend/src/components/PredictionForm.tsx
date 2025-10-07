'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, XCircle, TrendingUp, Sparkles, Globe } from 'lucide-react'

interface Props {
  prediction: any
  setPrediction: (pred: any) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export default function PredictionForm({ prediction, setPrediction, loading, setLoading }: Props) {
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

  const [selectedExoplanet, setSelectedExoplanet] = useState('custom')

  // Known Exoplanets Database
  const knownExoplanets = [
    {
      id: 'custom',
      name: 'Custom Input',
      description: 'Enter your own parameters',
      data: null
    },
    {
      id: 'kepler-452b',
      name: 'Kepler-452b',
      description: 'Earth\'s Cousin - Habitable Zone',
      data: {
        period: '384.8',
        duration: '10.2',
        depth: '250.0',
        prad: '1.63',
        teq: '265.0',
        insol: '1.1',
        steff: '5757.0',
        slogg: '4.32',
        srad: '1.11'
      }
    },
    {
      id: 'kepler-22b',
      name: 'Kepler-22b',
      description: 'First Confirmed Habitable Zone Planet',
      data: {
        period: '289.9',
        duration: '8.4',
        depth: '492.0',
        prad: '2.4',
        teq: '262.0',
        insol: '1.19',
        steff: '5518.0',
        slogg: '4.45',
        srad: '0.979'
      }
    },
    {
      id: 'kepler-186f',
      name: 'Kepler-186f',
      description: 'Earth-sized in Habitable Zone',
      data: {
        period: '129.9',
        duration: '5.8',
        depth: '180.0',
        prad: '1.17',
        teq: '188.0',
        insol: '0.29',
        steff: '3788.0',
        slogg: '4.68',
        srad: '0.544'
      }
    },
    {
      id: 'hd-209458b',
      name: 'HD 209458 b',
      description: 'Hot Jupiter - First Transiting Exoplanet',
      data: {
        period: '3.52',
        duration: '2.8',
        depth: '615.0',
        prad: '2.26',
        teq: '1540.0',
        insol: '340.0',
        steff: '5455.0',
        slogg: '4.467',
        srad: '0.927'
      }
    },
    {
      id: 'trappist-1e',
      name: 'TRAPPIST-1e',
      description: 'Potentially Habitable Earth-size',
      data: {
        period: '6.1',
        duration: '1.8',
        depth: '320.0',
        prad: '0.92',
        teq: '246.0',
        insol: '0.66',
        steff: '2566.0',
        slogg: '5.24',
        srad: '0.117'
      }
    },
    {
      id: 'proxima-b',
      name: 'Proxima Centauri b',
      description: 'Closest Exoplanet - 4.2 Light Years',
      data: {
        period: '11.2',
        duration: '2.2',
        depth: '150.0',
        prad: '1.07',
        teq: '234.0',
        insol: '0.65',
        steff: '3042.0',
        slogg: '5.05',
        srad: '0.154'
      }
    },
    {
      id: 'false-positive',
      name: 'False Positive Example',
      description: 'Not an Exoplanet - Binary Star',
      data: {
        period: '19.89',
        duration: '1.78',
        depth: '10829.0',
        prad: '14.6',
        teq: '638.0',
        insol: '39.3',
        steff: '5853.0',
        slogg: '4.544',
        srad: '0.868'
      }
    }
  ]

  const handleExoplanetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    setSelectedExoplanet(selected)
    
    const exoplanet = knownExoplanets.find(ex => ex.id === selected)
    if (exoplanet && exoplanet.data) {
      setFormData(exoplanet.data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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

      const data = await response.json()
      setPrediction(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const parameters = [
    { key: 'period', label: 'Orbital Period', unit: 'days' },
    { key: 'duration', label: 'Transit Duration', unit: 'hours' },
    { key: 'depth', label: 'Transit Depth', unit: 'ppm' },
    { key: 'prad', label: 'Planet Radius', unit: 'Earth radii' },
    { key: 'teq', label: 'Equilibrium Temp', unit: 'K' },
    { key: 'insol', label: 'Insolation Flux', unit: 'Earth flux' },
    { key: 'steff', label: 'Stellar Temp', unit: 'K' },
    { key: 'slogg', label: 'Stellar Gravity', unit: 'log(cm/s²)' },
    { key: 'srad', label: 'Stellar Radius', unit: 'Solar radii' }
  ]

  const selectedExoplanetData = knownExoplanets.find(ex => ex.id === selectedExoplanet)

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Clean Input Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exoplanet Selector */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Select Known Exoplanet</h3>
                <p className="text-xs text-white/50">Or use custom parameters</p>
              </div>
            </div>

            <select
              value={selectedExoplanet}
              onChange={handleExoplanetSelect}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium focus:outline-none focus:bg-white/15 focus:border-purple-500/50 transition-all cursor-pointer"
            >
              {knownExoplanets.map((exo) => (
                <option key={exo.id} value={exo.id} className="bg-gray-900 text-white">
                  {exo.name}
                </option>
              ))}
            </select>

            {selectedExoplanetData && selectedExoplanetData.id !== 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-purple-300">{selectedExoplanetData.name}</p>
                    <p className="text-xs text-white/60 mt-1">{selectedExoplanetData.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Transit Parameters */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold mb-6">Transit Parameters</h3>
            
            <div className="space-y-4">
              {parameters.map((param, idx) => (
                <motion.div
                  key={param.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {param.label} <span className="text-white/40">({param.unit})</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData[param.key as keyof typeof formData]}
                    onChange={(e) => {
                      setFormData({ ...formData, [param.key]: e.target.value })
                      setSelectedExoplanet('custom') // Switch to custom if user edits
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                    required
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Clean Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-white text-black rounded-2xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Discover Exoplanet
              </span>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Clean Results */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {prediction ? (
          <div className="space-y-6">
            {/* Main Result Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-start gap-4">
                {prediction.is_exoplanet ? (
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-400" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                    <XCircle className="w-7 h-7 text-red-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">
                    {prediction.is_exoplanet ? 'Exoplanet Detected' : 'Not an Exoplanet'}
                  </h3>
                  <p className="text-white/60 mb-6">{prediction.classification}</p>
                  
                  {/* Confidence Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Confidence</span>
                      <span className="font-semibold">{(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={prediction.is_exoplanet ? 'h-full bg-green-400' : 'h-full bg-red-400'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Probability Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-white/70" />
                <h4 className="font-semibold">Probability Analysis</h4>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Exoplanet', value: prediction.probability_exoplanet, color: 'green' },
                  { label: 'Non-Exoplanet', value: prediction.probability_non_exoplanet, color: 'red' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">{item.label}</span>
                      <span className="font-semibold">{(item.value * 100).toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value * 100}%` }}
                        transition={{ duration: 1, delay: 0.4 + idx * 0.1 }}
                        className={`h-full bg-${item.color}-400`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-white/70" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to discover</h3>
            <p className="text-white/60 text-sm">Select an exoplanet or enter custom parameters</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}