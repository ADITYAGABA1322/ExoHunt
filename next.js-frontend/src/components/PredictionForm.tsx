// // // 'use client'

// // // import { useState } from 'react'
// // // import { motion } from 'framer-motion'
// // // import { Search, Sparkles, CheckCircle, XCircle, BarChart3, Info } from 'lucide-react'

// // // interface Props {
// // //   prediction: any
// // //   setPrediction: (pred: any) => void
// // //   loading: boolean
// // //   setLoading: (loading: boolean) => void
// // // }

// // // export default function PredictionForm({ prediction, setPrediction, loading, setLoading }: Props) {
// // //   const [formData, setFormData] = useState({
// // //     period: '3.52',
// // //     duration: '2.8',
// // //     depth: '615.0',
// // //     prad: '2.26',
// // //     teq: '1540.0',
// // //     insol: '340.0',
// // //     steff: '5455.0',
// // //     slogg: '4.467',
// // //     srad: '0.927'
// // //   })

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault()
// // //     setLoading(true)

// // //     try {
// // //       const response = await fetch('http://localhost:8000/predict', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({
// // //           period: parseFloat(formData.period),
// // //           duration: parseFloat(formData.duration),
// // //           depth: parseFloat(formData.depth),
// // //           prad: parseFloat(formData.prad),
// // //           teq: parseFloat(formData.teq),
// // //           insol: parseFloat(formData.insol),
// // //           steff: parseFloat(formData.steff),
// // //           slogg: parseFloat(formData.slogg),
// // //           srad: parseFloat(formData.srad)
// // //         })
// // //       })

// // //       const data = await response.json()
// // //       setPrediction(data)
// // //     } catch (err) {
// // //       console.error(err)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const loadExample = (type: 'exoplanet' | 'non-exoplanet') => {
// // //     if (type === 'exoplanet') {
// // //       setFormData({
// // //         period: '3.52', duration: '2.8', depth: '615.0',
// // //         prad: '2.26', teq: '1540.0', insol: '340.0',
// // //         steff: '5455.0', slogg: '4.467', srad: '0.927'
// // //       })
// // //     } else {
// // //       setFormData({
// // //         period: '19.89', duration: '1.78', depth: '10829.0',
// // //         prad: '14.6', teq: '638.0', insol: '39.3',
// // //         steff: '5853.0', slogg: '4.544', srad: '0.868'
// // //       })
// // //     }
// // //   }

// // //   return (
// // //     <div className="grid lg:grid-cols-2 gap-8">
// // //       {/* Input Form */}
// // //       <motion.div
// // //         initial={{ opacity: 0, x: -50 }}
// // //         animate={{ opacity: 1, x: 0 }}
// // //         className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
// // //       >
// // //         <div className="flex items-center gap-3 mb-6">
// // //           <Sparkles className="w-6 h-6 text-blue-400" />
// // //           <h2 className="text-2xl font-bold">Input Transit Parameters</h2>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="space-y-4">
// // //           {Object.entries({
// // //             period: { label: 'Orbital Period', unit: 'days', icon: '🌍' },
// // //             duration: { label: 'Transit Duration', unit: 'hours', icon: '⏱️' },
// // //             depth: { label: 'Transit Depth', unit: 'ppm', icon: '📉' },
// // //             prad: { label: 'Planet Radius', unit: 'Earth radii', icon: '🪐' },
// // //             teq: { label: 'Equilibrium Temperature', unit: 'K', icon: '🌡️' },
// // //             insol: { label: 'Insolation Flux', unit: 'Earth flux', icon: '☀️' },
// // //             steff: { label: 'Stellar Temperature', unit: 'K', icon: '⭐' },
// // //             slogg: { label: 'Stellar Surface Gravity', unit: 'log(cm/s²)', icon: '⚖️' },
// // //             srad: { label: 'Stellar Radius', unit: 'Solar radii', icon: '🌟' }
// // //           }).map(([key, meta]) => (
// // //             <div key={key} className="group">
// // //               <label className="block text-sm font-medium text-gray-300 mb-2">
// // //                 <span className="mr-2">{meta.icon}</span>
// // //                 {meta.label} <span className="text-gray-500">({meta.unit})</span>
// // //               </label>
// // //               <input
// // //                 type="number"
// // //                 step="any"
// // //                 value={formData[key as keyof typeof formData]}
// // //                 onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
// // //                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:bg-white/10"
// // //                 required
// // //               />
// // //             </div>
// // //           ))}

// // //           {/* Quick Load Buttons */}
// // //           <div className="grid grid-cols-2 gap-3 pt-4">
// // //             <motion.button
// // //               type="button"
// // //               onClick={() => loadExample('exoplanet')}
// // //               whileHover={{ scale: 1.02 }}
// // //               whileTap={{ scale: 0.98 }}
// // //               className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-xl text-green-400 font-medium transition-all"
// // //             >
// // //               🌍 Load Exoplanet
// // //             </motion.button>
// // //             <motion.button
// // //               type="button"
// // //               onClick={() => loadExample('non-exoplanet')}
// // //               whileHover={{ scale: 1.02 }}
// // //               whileTap={{ scale: 0.98 }}
// // //               className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-red-400 font-medium transition-all"
// // //             >
// // //               ⭕ Load Non-Planet
// // //             </motion.button>
// // //           </div>

// // //           {/* Submit Button */}
// // //           <motion.button
// // //             type="submit"
// // //             disabled={loading}
// // //             whileHover={{ scale: 1.02 }}
// // //             whileTap={{ scale: 0.98 }}
// // //             className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-blue-500/50"
// // //           >
// // //             {loading ? (
// // //               <>
// // //                 <motion.div
// // //                   animate={{ rotate: 360 }}
// // //                   transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// // //                   className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
// // //                 />
// // //                 Analyzing...
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <Search className="w-5 h-5" />
// // //                 Discover Exoplanet
// // //               </>
// // //             )}
// // //           </motion.button>
// // //         </form>
// // //       </motion.div>

// // //       {/* Results Panel */}
// // //       <motion.div
// // //         initial={{ opacity: 0, x: 50 }}
// // //         animate={{ opacity: 1, x: 0 }}
// // //         className="space-y-6"
// // //       >
// // //         {prediction ? (
// // //           <>
// // //             {/* Main Result Card */}
// // //             <motion.div
// // //               initial={{ opacity: 0, scale: 0.9 }}
// // //               animate={{ opacity: 1, scale: 1 }}
// // //               className={`p-8 rounded-3xl border-2 ${
// // //                 prediction.is_exoplanet
// // //                   ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
// // //                   : 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/50'
// // //               } backdrop-blur-xl`}
// // //             >
// // //               <div className="flex items-center gap-4 mb-4">
// // //                 {prediction.is_exoplanet ? (
// // //                   <CheckCircle className="w-16 h-16 text-green-400" />
// // //                 ) : (
// // //                   <XCircle className="w-16 h-16 text-red-400" />
// // //                 )}
// // //                 <div>
// // //                   <h3 className="text-3xl font-bold mb-1">
// // //                     {prediction.is_exoplanet ? 'Exoplanet Detected!' : 'Not an Exoplanet'}
// // //                   </h3>
// // //                   <p className="text-xl text-gray-300">{prediction.classification}</p>
// // //                 </div>
// // //               </div>

// // //               {/* Confidence Meter */}
// // //               <div className="mt-6">
// // //                 <div className="flex justify-between text-sm text-gray-300 mb-2">
// // //                   <span>Confidence</span>
// // //                   <span className="font-bold">{(prediction.confidence * 100).toFixed(2)}%</span>
// // //                 </div>
// // //                 <div className="h-4 bg-white/10 rounded-full overflow-hidden">
// // //                   <motion.div
// // //                     initial={{ width: 0 }}
// // //                     animate={{ width: `${prediction.confidence * 100}%` }}
// // //                     transition={{ duration: 1 }}
// // //                     className={`h-full ${
// // //                       prediction.is_exoplanet
// // //                         ? 'bg-gradient-to-r from-green-500 to-emerald-500'
// // //                         : 'bg-gradient-to-r from-red-500 to-orange-500'
// // //                     }`}
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </motion.div>

// // //             {/* Probability Breakdown */}
// // //             <motion.div
// // //               initial={{ opacity: 0, y: 20 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               transition={{ delay: 0.2 }}
// // //               className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20"
// // //             >
// // //               <div className="flex items-center gap-3 mb-4">
// // //                 <BarChart3 className="w-5 h-5 text-purple-400" />
// // //                 <h4 className="text-lg font-bold">Probability Breakdown</h4>
// // //               </div>

// // //               <div className="space-y-4">
// // //                 <div>
// // //                   <div className="flex justify-between text-sm mb-2">
// // //                     <span className="text-green-400">Exoplanet</span>
// // //                     <span className="font-bold">
// // //                       {(prediction.probability_exoplanet * 100).toFixed(2)}%
// // //                     </span>
// // //                   </div>
// // //                   <div className="h-3 bg-white/10 rounded-full overflow-hidden">
// // //                     <motion.div
// // //                       initial={{ width: 0 }}
// // //                       animate={{ width: `${prediction.probability_exoplanet * 100}%` }}
// // //                       transition={{ duration: 1, delay: 0.3 }}
// // //                       className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div>
// // //                   <div className="flex justify-between text-sm mb-2">
// // //                     <span className="text-red-400">Non-Exoplanet</span>
// // //                     <span className="font-bold">
// // //                       {(prediction.probability_non_exoplanet * 100).toFixed(2)}%
// // //                     </span>
// // //                   </div>
// // //                   <div className="h-3 bg-white/10 rounded-full overflow-hidden">
// // //                     <motion.div
// // //                       initial={{ width: 0 }}
// // //                       animate={{ width: `${prediction.probability_non_exoplanet * 100}%` }}
// // //                       transition={{ duration: 1, delay: 0.4 }}
// // //                       className="h-full bg-gradient-to-r from-red-500 to-orange-500"
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </motion.div>

// // //             {/* Model Info */}
// // //             <motion.div
// // //               initial={{ opacity: 0, y: 20 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               transition={{ delay: 0.4 }}
// // //               className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
// // //             >
// // //               <div className="flex items-center gap-3 mb-4">
// // //                 <Info className="w-5 h-5 text-blue-400" />
// // //                 <h4 className="text-lg font-bold">Model Information</h4>
// // //               </div>

// // //               <div className="space-y-3">
// // //                 <div className="flex justify-between">
// // //                   <span className="text-gray-400">Model Type</span>
// // //                   <span className="font-semibold text-blue-400">Stacking Ensemble</span>
// // //                 </div>
// // //                 <div className="flex justify-between">
// // //                   <span className="text-gray-400">Base Learners</span>
// // //                   <span className="font-semibold text-purple-400">5 Models</span>
// // //                 </div>
// // //                 <div className="flex justify-between">
// // //                   <span className="text-gray-400">Features Used</span>
// // //                   <span className="font-semibold text-green-400">30 Engineered</span>
// // //                 </div>
// // //               </div>
// // //             </motion.div>
// // //           </>
// // //         ) : (
// // //           <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center h-full flex flex-col items-center justify-center">
// // //             <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
// // //             <h3 className="text-2xl font-bold mb-2">Ready to Discover</h3>
// // //             <p className="text-gray-400">Enter parameters and click predict to discover exoplanets</p>
// // //           </div>
// // //         )}
// // //       </motion.div>
// // //     </div>
// // //   )
// // // }

// // 'use client'

// // import { useState } from 'react'
// // import { motion } from 'framer-motion'
// // import { Search, Sparkles, CheckCircle, XCircle, BarChart3, TrendingUp, Zap } from 'lucide-react'

// // interface Props {
// //   prediction: any
// //   setPrediction: (pred: any) => void
// //   loading: boolean
// //   setLoading: (loading: boolean) => void
// // }

// // export default function PredictionForm({ prediction, setPrediction, loading, setLoading }: Props) {
// //   const [formData, setFormData] = useState({
// //     period: '3.52',
// //     duration: '2.8',
// //     depth: '615.0',
// //     prad: '2.26',
// //     teq: '1540.0',
// //     insol: '340.0',
// //     steff: '5455.0',
// //     slogg: '4.467',
// //     srad: '0.927'
// //   })

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setLoading(true)

// //     try {
// //       const response = await fetch('http://localhost:8000/predict', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           period: parseFloat(formData.period),
// //           duration: parseFloat(formData.duration),
// //           depth: parseFloat(formData.depth),
// //           prad: parseFloat(formData.prad),
// //           teq: parseFloat(formData.teq),
// //           insol: parseFloat(formData.insol),
// //           steff: parseFloat(formData.steff),
// //           slogg: parseFloat(formData.slogg),
// //           srad: parseFloat(formData.srad)
// //         })
// //       })

// //       const data = await response.json()
// //       setPrediction(data)
// //     } catch (err) {
// //       console.error(err)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const loadExample = (type: 'exoplanet' | 'non-exoplanet') => {
// //     if (type === 'exoplanet') {
// //       setFormData({
// //         period: '3.52', duration: '2.8', depth: '615.0',
// //         prad: '2.26', teq: '1540.0', insol: '340.0',
// //         steff: '5455.0', slogg: '4.467', srad: '0.927'
// //       })
// //     } else {
// //       setFormData({
// //         period: '19.89', duration: '1.78', depth: '10829.0',
// //         prad: '14.6', teq: '638.0', insol: '39.3',
// //         steff: '5853.0', slogg: '4.544', srad: '0.868'
// //       })
// //     }
// //   }

// //   const parameters = [
// //     { key: 'period', label: 'Orbital Period', unit: 'days', icon: '🌍', color: 'blue' },
// //     { key: 'duration', label: 'Transit Duration', unit: 'hours', icon: '⏱️', color: 'purple' },
// //     { key: 'depth', label: 'Transit Depth', unit: 'ppm', icon: '📉', color: 'pink' },
// //     { key: 'prad', label: 'Planet Radius', unit: 'Earth radii', icon: '🪐', color: 'indigo' },
// //     { key: 'teq', label: 'Equilibrium Temperature', unit: 'K', icon: '🌡️', color: 'orange' },
// //     { key: 'insol', label: 'Insolation Flux', unit: 'Earth flux', icon: '☀️', color: 'yellow' },
// //     { key: 'steff', label: 'Stellar Temperature', unit: 'K', icon: '⭐', color: 'red' },
// //     { key: 'slogg', label: 'Stellar Gravity', unit: 'log(cm/s²)', icon: '⚖️', color: 'green' },
// //     { key: 'srad', label: 'Stellar Radius', unit: 'Solar radii', icon: '🌟', color: 'cyan' }
// //   ]

// //   return (
// //     <div className="grid lg:grid-cols-5 gap-8">
// //       {/* Input Form - 3 columns */}
// //       <motion.div
// //         initial={{ opacity: 0, x: -30 }}
// //         animate={{ opacity: 1, x: 0 }}
// //         transition={{ duration: 0.5 }}
// //         className="lg:col-span-3"
// //       >
// //         <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
// //           <div className="flex items-center gap-3 mb-8">
// //             <div className="p-3 bg-blue-500/20 rounded-xl">
// //               <Sparkles className="w-6 h-6 text-blue-400" />
// //             </div>
// //             <div>
// //               <h2 className="text-2xl font-bold">Transit Parameters</h2>
// //               <p className="text-sm text-gray-400">Enter exoplanet observation data</p>
// //             </div>
// //           </div>

// //           <form onSubmit={handleSubmit} className="space-y-5">
// //             {parameters.map((param, idx) => (
// //               <motion.div
// //                 key={param.key}
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ delay: idx * 0.05 }}
// //               >
// //                 <label className="block text-sm font-semibold text-gray-300 mb-2">
// //                   <span className="mr-2">{param.icon}</span>
// //                   {param.label}
// //                   <span className="ml-2 text-xs text-gray-500">({param.unit})</span>
// //                 </label>
// //                 <input
// //                   type="number"
// //                   step="any"
// //                   value={formData[param.key as keyof typeof formData]}
// //                   onChange={(e) => setFormData({ ...formData, [param.key]: e.target.value })}
// //                   className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/10"
// //                   required
// //                 />
// //               </motion.div>
// //             ))}

// //             {/* Quick Load Buttons */}
// //             <div className="grid grid-cols-2 gap-4 pt-6">
// //               <motion.button
// //                 type="button"
// //                 onClick={() => loadExample('exoplanet')}
// //                 whileHover={{ scale: 1.02, y: -2 }}
// //                 whileTap={{ scale: 0.98 }}
// //                 className="px-6 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 font-semibold transition-all"
// //               >
// //                 🌍 Exoplanet Example
// //               </motion.button>
// //               <motion.button
// //                 type="button"
// //                 onClick={() => loadExample('non-exoplanet')}
// //                 whileHover={{ scale: 1.02, y: -2 }}
// //                 whileTap={{ scale: 0.98 }}
// //                 className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 font-semibold transition-all"
// //               >
// //                 ⭕ Non-Planet Example
// //               </motion.button>
// //             </div>

// //             {/* Submit Button */}
// //             <motion.button
// //               type="submit"
// //               disabled={loading}
// //               whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
// //               whileTap={{ scale: 0.98 }}
// //               className="w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-xl text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/50 mt-8"
// //             >
// //               {loading ? (
// //                 <>
// //                   <motion.div
// //                     animate={{ rotate: 360 }}
// //                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// //                     className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
// //                   />
// //                   <span>Analyzing Transit Data...</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <Search className="w-6 h-6" />
// //                   <span>Discover Exoplanet</span>
// //                 </>
// //               )}
// //             </motion.button>
// //           </form>
// //         </div>
// //       </motion.div>

// //       {/* Results Panel - 2 columns */}
// //       <motion.div
// //         initial={{ opacity: 0, x: 30 }}
// //         animate={{ opacity: 1, x: 0 }}
// //         transition={{ duration: 0.5, delay: 0.2 }}
// //         className="lg:col-span-2 space-y-6"
// //       >
// //         {prediction ? (
// //           <>
// //             {/* Main Result */}
// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.95 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               className={`
// //                 p-8 rounded-3xl border-2 backdrop-blur-2xl shadow-2xl
// //                 ${prediction.is_exoplanet
// //                   ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-emerald-500/50 shadow-emerald-500/20'
// //                   : 'bg-gradient-to-br from-red-500/20 to-orange-500/10 border-red-500/50 shadow-red-500/20'
// //                 }
// //               `}
// //             >
// //               <div className="flex items-start gap-4 mb-6">
// //                 {prediction.is_exoplanet ? (
// //                   <div className="p-4 bg-emerald-500/20 rounded-2xl">
// //                     <CheckCircle className="w-12 h-12 text-emerald-400" />
// //                   </div>
// //                 ) : (
// //                   <div className="p-4 bg-red-500/20 rounded-2xl">
// //                     <XCircle className="w-12 h-12 text-red-400" />
// //                   </div>
// //                 )}
// //                 <div className="flex-1">
// //                   <h3 className="text-3xl font-black mb-2">
// //                     {prediction.is_exoplanet ? 'Exoplanet Detected!' : 'Not an Exoplanet'}
// //                   </h3>
// //                   <p className="text-lg text-gray-300 mb-4">{prediction.classification}</p>
                  
// //                   {/* Confidence Bar */}
// //                   <div className="space-y-2">
// //                     <div className="flex justify-between text-sm font-semibold">
// //                       <span>Confidence Level</span>
// //                       <span className="text-lg">{(prediction.confidence * 100).toFixed(1)}%</span>
// //                     </div>
// //                     <div className="h-3 bg-black/30 rounded-full overflow-hidden">
// //                       <motion.div
// //                         initial={{ width: 0 }}
// //                         animate={{ width: `${prediction.confidence * 100}%` }}
// //                         transition={{ duration: 1.5, ease: "easeOut" }}
// //                         className={`h-full ${
// //                           prediction.is_exoplanet
// //                             ? 'bg-gradient-to-r from-emerald-400 to-green-500'
// //                             : 'bg-gradient-to-r from-red-400 to-orange-500'
// //                         }`}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </motion.div>

// //             {/* Probability Breakdown */}
// //             <motion.div
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: 0.3 }}
// //               className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10"
// //             >
// //               <div className="flex items-center gap-2 mb-5">
// //                 <BarChart3 className="w-5 h-5 text-purple-400" />
// //                 <h4 className="font-bold text-lg">Probability Analysis</h4>
// //               </div>

// //               <div className="space-y-5">
// //                 {[
// //                   { label: 'Exoplanet', value: prediction.probability_exoplanet, color: 'emerald' },
// //                   { label: 'Non-Exoplanet', value: prediction.probability_non_exoplanet, color: 'red' }
// //                 ].map((item, idx) => (
// //                   <div key={idx}>
// //                     <div className="flex justify-between text-sm font-semibold mb-2">
// //                       <span className={`text-${item.color}-400`}>{item.label}</span>
// //                       <span>{(item.value * 100).toFixed(2)}%</span>
// //                     </div>
// //                     <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
// //                       <motion.div
// //                         initial={{ width: 0 }}
// //                         animate={{ width: `${item.value * 100}%` }}
// //                         transition={{ duration: 1, delay: 0.4 + idx * 0.1 }}
// //                         className={`h-full bg-gradient-to-r ${
// //                           item.color === 'emerald'
// //                             ? 'from-emerald-500 to-green-500'
// //                             : 'from-red-500 to-orange-500'
// //                         }`}
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </motion.div>

// //             {/* Model Info */}
// //             <motion.div
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: 0.5 }}
// //               className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10"
// //             >
// //               <div className="flex items-center gap-2 mb-5">
// //                 <Zap className="w-5 h-5 text-blue-400" />
// //                 <h4 className="font-bold text-lg">Model Architecture</h4>
// //               </div>

// //               <div className="space-y-3">
// //                 {[
// //                   { label: 'Model Type', value: 'Stacking Ensemble', color: 'blue' },
// //                   { label: 'Base Learners', value: '5 Classifiers', color: 'purple' },
// //                   { label: 'Features', value: '30 Engineered', color: 'pink' }
// //                 ].map((item, idx) => (
// //                   <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
// //                     <span className="text-sm text-gray-400">{item.label}</span>
// //                     <span className={`text-sm font-bold text-${item.color}-400`}>{item.value}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </motion.div>
// //           </>
// //         ) : (
// //           <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/10 text-center h-full flex flex-col items-center justify-center min-h-[600px]">
// //             <motion.div
// //               animate={{ 
// //                 scale: [1, 1.1, 1],
// //                 rotate: [0, 5, -5, 0]
// //               }}
// //               transition={{ repeat: Infinity, duration: 4 }}
// //             >
// //               <Sparkles className="w-20 h-20 text-purple-400 mx-auto mb-6" />
// //             </motion.div>
// //             <h3 className="text-2xl font-bold mb-3">Ready to Discover</h3>
// //             <p className="text-gray-400 max-w-sm">Enter transit parameters and click discover to analyze potential exoplanets</p>
// //           </div>
// //         )}
// //       </motion.div>
// //     </div>
// //   )
// // }

// 'use client'

// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { Search, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

// interface Props {
//   prediction: any
//   setPrediction: (pred: any) => void
//   loading: boolean
//   setLoading: (loading: boolean) => void
// }

// export default function PredictionForm({ prediction, setPrediction, loading, setLoading }: Props) {
//   const [formData, setFormData] = useState({
//     period: '3.52',
//     duration: '2.8',
//     depth: '615.0',
//     prad: '2.26',
//     teq: '1540.0',
//     insol: '340.0',
//     steff: '5455.0',
//     slogg: '4.467',
//     srad: '0.927'
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const response = await fetch('http://localhost:8000/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           period: parseFloat(formData.period),
//           duration: parseFloat(formData.duration),
//           depth: parseFloat(formData.depth),
//           prad: parseFloat(formData.prad),
//           teq: parseFloat(formData.teq),
//           insol: parseFloat(formData.insol),
//           steff: parseFloat(formData.steff),
//           slogg: parseFloat(formData.slogg),
//           srad: parseFloat(formData.srad)
//         })
//       })

//       const data = await response.json()
//       setPrediction(data)
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const parameters = [
//     { key: 'period', label: 'Orbital Period', unit: 'days' },
//     { key: 'duration', label: 'Transit Duration', unit: 'hours' },
//     { key: 'depth', label: 'Transit Depth', unit: 'ppm' },
//     { key: 'prad', label: 'Planet Radius', unit: 'Earth radii' },
//     { key: 'teq', label: 'Equilibrium Temp', unit: 'K' },
//     { key: 'insol', label: 'Insolation Flux', unit: 'Earth flux' },
//     { key: 'steff', label: 'Stellar Temp', unit: 'K' },
//     { key: 'slogg', label: 'Stellar Gravity', unit: 'log(cm/s²)' },
//     { key: 'srad', label: 'Stellar Radius', unit: 'Solar radii' }
//   ]

//   return (
//     <div className="grid lg:grid-cols-2 gap-8">
//       {/* Clean Input Form */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
//             <h3 className="text-xl font-semibold mb-6">Transit Parameters</h3>
            
//             <div className="space-y-4">
//               {parameters.map((param, idx) => (
//                 <motion.div
//                   key={param.key}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: idx * 0.03 }}
//                 >
//                   <label className="block text-sm font-medium text-white/70 mb-2">
//                     {param.label} <span className="text-white/40">({param.unit})</span>
//                   </label>
//                   <input
//                     type="number"
//                     step="any"
//                     value={formData[param.key as keyof typeof formData]}
//                     onChange={(e) => setFormData({ ...formData, [param.key]: e.target.value })}
//                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
//                     required
//                   />
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           {/* Clean Submit Button */}
//           <motion.button
//             type="submit"
//             disabled={loading}
//             whileHover={{ scale: loading ? 1 : 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full py-4 bg-white text-black rounded-2xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//                   className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
//                 />
//                 Analyzing...
//               </span>
//             ) : (
//               <span className="flex items-center justify-center gap-2">
//                 <Search className="w-5 h-5" />
//                 Discover Exoplanet
//               </span>
//             )}
//           </motion.button>
//         </form>
//       </motion.div>

//       {/* Clean Results */}
//       <motion.div
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//       >
//         {prediction ? (
//           <div className="space-y-6">
//             {/* Main Result Card */}
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
//             >
//               <div className="flex items-start gap-4">
//                 {prediction.is_exoplanet ? (
//                   <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
//                     <CheckCircle className="w-7 h-7 text-green-400" />
//                   </div>
//                 ) : (
//                   <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
//                     <XCircle className="w-7 h-7 text-red-400" />
//                   </div>
//                 )}
                
//                 <div className="flex-1">
//                   <h3 className="text-2xl font-bold mb-1">
//                     {prediction.is_exoplanet ? 'Exoplanet Detected' : 'Not an Exoplanet'}
//                   </h3>
//                   <p className="text-white/60 mb-6">{prediction.classification}</p>
                  
//                   {/* Confidence Bar */}
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-white/60">Confidence</span>
//                       <span className="font-semibold">{(prediction.confidence * 100).toFixed(1)}%</span>
//                     </div>
//                     <div className="h-2 bg-white/10 rounded-full overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${prediction.confidence * 100}%` }}
//                         transition={{ duration: 1.5, ease: "easeOut" }}
//                         className={prediction.is_exoplanet ? 'h-full bg-green-400' : 'h-full bg-red-400'}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Probability Card */}
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
//             >
//               <div className="flex items-center gap-2 mb-6">
//                 <TrendingUp className="w-5 h-5 text-white/70" />
//                 <h4 className="font-semibold">Probability Analysis</h4>
//               </div>

//               <div className="space-y-4">
//                 {[
//                   { label: 'Exoplanet', value: prediction.probability_exoplanet, color: 'green' },
//                   { label: 'Non-Exoplanet', value: prediction.probability_non_exoplanet, color: 'red' }
//                 ].map((item, idx) => (
//                   <div key={idx}>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-white/60">{item.label}</span>
//                       <span className="font-semibold">{(item.value * 100).toFixed(2)}%</span>
//                     </div>
//                     <div className="h-2 bg-white/10 rounded-full overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${item.value * 100}%` }}
//                         transition={{ duration: 1, delay: 0.4 + idx * 0.1 }}
//                         className={`h-full bg-${item.color}-400`}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         ) : (
//           <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center h-full flex flex-col items-center justify-center">
//             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
//               <Search className="w-8 h-8 text-white/70" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Ready to discover</h3>
//             <p className="text-white/60 text-sm">Enter parameters to analyze exoplanet data</p>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   )
// }

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
      const response = await fetch('http://localhost:8000/predict', {
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