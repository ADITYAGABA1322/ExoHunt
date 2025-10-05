'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Upload, Download, FileText, BarChart2, TrendingUp } from 'lucide-react'

export default function DataExplorer() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dataStats, setDataStats] = useState({
    totalSamples: 10612,
    exoplanets: 3185,
    nonExoplanets: 7427,
    datasets: ['Kepler', 'K2', 'TESS']
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
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
          Data Explorer
        </h2>
        <p className="text-gray-400">Upload and analyze exoplanet datasets</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold">Upload New Data</h3>
          </div>

          <div className="space-y-6">
            {/* Drag & Drop Zone */}
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-all cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-300 mb-2">
                  Drop CSV file here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports Kepler, K2, and TESS formats
                </p>
              </label>
            </div>

            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-semibold text-green-400">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-green-500/30 hover:bg-green-500/50 rounded-lg text-green-400 font-semibold"
                  >
                    Process
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Supported Formats */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-400">Supported Datasets</h4>
              {['NASA Kepler Mission', 'K2 Extended Mission', 'TESS Survey'].map((dataset, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-300">{dataset}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Dataset Statistics */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Stats Overview */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-6">
              <BarChart2 className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">Dataset Statistics</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Total Samples</span>
                  <span className="text-2xl font-bold text-blue-400">{dataStats.totalSamples.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-full" />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Confirmed Exoplanets</span>
                  <span className="text-2xl font-bold text-green-400">{dataStats.exoplanets.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `${(dataStats.exoplanets / dataStats.totalSamples) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Non-Exoplanets</span>
                  <span className="text-2xl font-bold text-red-400">{dataStats.nonExoplanets.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                    style={{ width: `${(dataStats.nonExoplanets / dataStats.totalSamples) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Download Options */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-3xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-green-400" />
              <h4 className="text-lg font-bold">Export Data</h4>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-xl text-green-400 font-semibold"
              >
                Download Processed Dataset (CSV)
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-xl text-blue-400 font-semibold"
              >
                Download Training Report (PDF)
              </motion.button>
            </div>
          </div>

          {/* Feature Distribution */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h4 className="text-lg font-bold">Feature Distribution</h4>
            </div>

            <div className="space-y-3">
              {['Orbital Period', 'Transit Depth', 'Planet Radius', 'Stellar Temperature'].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-32">{feature}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${60 + Math.random() * 40}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}