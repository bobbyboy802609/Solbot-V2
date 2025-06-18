'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, RefreshCw, Send, Eye, EyeOff, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

interface WalletManagerProps {
  sessionId: string | null
}

export function WalletManager({ sessionId }: WalletManagerProps) {
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)

  const [isCreating, setIsCreating] = useState(false)
  const [distributionAmount, setDistributionAmount] = useState('')

  // Load wallets on component mount and when sessionId changes
  useEffect(() => {
    loadWallets()
  }, [sessionId])

  const loadWallets = async () => {
    if (!sessionId) {
      setWallets([])
      setLoading(false)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/sessions/${sessionId}/wallets`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallets')
      }
      
      const data = await response.json()
      
      setWallets(data.map(wallet => ({
        ...wallet,
        privateKeyVisible: false
      })))
    } catch (error) {
      console.error('Failed to load wallets:', error)
      toast.error('Failed to load wallets')
      setWallets([])
    } finally {
      setLoading(false)
    }
  }

  const createWallet = async () => {
    if (!sessionId) {
      toast.error('Please start a trading session first to create wallets')
      return
    }
    
    toast.info('Wallets are automatically created when you start a trading session')
  }

  const deleteWallet = (id: string) => {
    setWallets(wallets.filter(w => w.id !== id))
    toast.success('Wallet deleted')
  }

  const togglePrivateKey = (id: string) => {
    setWallets(wallets.map(w => 
      w.id === id ? { ...w, privateKeyVisible: !w.privateKeyVisible } : w
    ))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const distributeSol = async () => {
    if (!distributionAmount || Number(distributionAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      // Simulate SOL distribution
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const amountPerWallet = Number(distributionAmount) / wallets.length
      setWallets(wallets.map(w => ({
        ...w,
        solBalance: w.solBalance + amountPerWallet,
        isActive: true
      })))
      
      setDistributionAmount('')
      toast.success(`Distributed ${distributionAmount} SOL to ${wallets.length} wallets`)
    } catch (error) {
      toast.error('Failed to distribute SOL')
    }
  }

  const refreshBalances = async () => {
    try {
      await loadWallets()
      toast.success('Balances refreshed')
    } catch (error) {
      toast.error('Failed to refresh balances')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-300">Loading wallets...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Wallet Manager</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshBalances}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={createWallet}
            disabled={isCreating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            {isCreating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Create Wallet</span>
          </button>
        </div>
      </div>

      {/* Distribution Controls */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">SOL Distribution</h3>
        <div className="flex space-x-4">
          <input
            type="number"
            value={distributionAmount}
            onChange={(e) => setDistributionAmount(e.target.value)}
            placeholder="Amount to distribute (SOL)"
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={distributeSol}
            disabled={!distributionAmount}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
            <span>Distribute</span>
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          This will distribute SOL equally among all {wallets.length} wallets
        </p>
      </div>

      {/* Wallets List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Trading Wallets ({wallets.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-700">
          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-700/30 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${wallet.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span className="text-white font-medium">Wallet #{index + 1}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      wallet.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {wallet.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm w-20">Address:</span>
                      <span className="text-white font-mono text-sm">{wallet.address}</span>
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm w-20">Private:</span>
                      <span className="text-white font-mono text-sm">
                        {wallet.privateKeyVisible ? 
                          '5KJp9mNxQr7Lm24kPqHj9wXz3Nt82bYv6cMw8Hj95cMw...' : 
                          '••••••••••••••••••••••••••••••••••••••••••••••••'
                        }
                      </span>
                      <button
                        onClick={() => togglePrivateKey(wallet.id)}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {wallet.privateKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-white font-semibold">{wallet.solBalance.toFixed(6)} SOL</div>
                    <div className="text-gray-400 text-sm">{wallet.tokenBalance.toFixed(2)} Tokens</div>
                  </div>
                  
                  <button
                    onClick={() => deleteWallet(wallet.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {wallets.length === 0 && (
        <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
          <div className="text-gray-400 mb-4">
            {sessionId ? 'No wallets found for this session' : 'No active trading session'}
          </div>
          <div className="text-gray-500 text-sm mb-6">
            {sessionId ? 'Wallets should be automatically created with the session' : 'Start a trading session to create wallets automatically'}
          </div>
          <button
            onClick={createWallet}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>{sessionId ? 'Refresh Wallets' : 'Start Trading Session'}</span>
          </button>
        </div>
      )}
    </div>
  )
}