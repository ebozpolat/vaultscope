import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';

const WalletConnectionSection = () => {
  const [walletLoading, setWalletLoading] = useState(null);
  const [connectedWallets, setConnectedWallets] = useState([]);

  const walletOptions = [
    {
      name: 'MetaMask',
      icon: 'Wallet',
      color: '#F6851B',
      description: 'Connect with MetaMask'
    },
    {
      name: 'WalletConnect',
      icon: 'Link',
      color: '#3B99FC',
      description: 'Scan with WalletConnect'
    },
    {
      name: 'Coinbase Wallet',
      icon: 'Coins',
      color: '#0052FF',
      description: 'Connect with Coinbase'
    }
  ];

  const handleWalletConnect = async (walletName) => {
    setWalletLoading(walletName);
    
    try {
      // TODO: Implement actual wallet connection logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock connection
      
      console.log(`${walletName} connection initiated`);
      
      // Mock successful connection
      setConnectedWallets(prev => [...prev, walletName]);
    } catch (error) {
      console.error(`${walletName} connection error:`, error);
    } finally {
      setWalletLoading(null);
    }
  };

  const isWalletConnected = (walletName) => {
    return connectedWallets.includes(walletName);
  };

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">
          Connect Wallet
        </h3>
        <Icon name="Wallet" size={16} className="text-text-tertiary" />
      </div>

      {/* Wallet Options */}
      <div className="space-y-3">
        {walletOptions.map((wallet) => (
          <motion.div
            key={wallet.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={isWalletConnected(wallet.name) ? 'success' : 'outline'}
              fullWidth
              onClick={() => !isWalletConnected(wallet.name) && handleWalletConnect(wallet.name)}
              loading={walletLoading === wallet.name}
              disabled={isWalletConnected(wallet.name)}
              className={`flex items-center justify-between py-3 px-4 ${
                isWalletConnected(wallet.name)
                  ? 'bg-success-50 border-success-200 hover:bg-success-50' :'border-border hover:bg-background-secondary'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: isWalletConnected(wallet.name) 
                      ? '#10B981' 
                      : wallet.color + '20'
                  }}
                >
                  <Icon
                    name={wallet.icon}
                    size={14}
                    className={
                      isWalletConnected(wallet.name)
                        ? 'text-white' :'text-text-primary'
                    }
                    style={{
                      color: isWalletConnected(wallet.name) 
                        ? 'white' 
                        : wallet.color
                    }}
                  />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-text-primary">
                    {wallet.name}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {isWalletConnected(wallet.name) ? 'Connected' : wallet.description}
                  </div>
                </div>
              </div>
              
              {isWalletConnected(wallet.name) && (
                <Icon
                  name="CheckCircle"
                  size={16}
                  className="text-success"
                />
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Connection Status */}
      {connectedWallets.length > 0 && (
        <div className="mt-4 p-3 bg-success-50 rounded-lg border border-success-200">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-success-700">
              {connectedWallets.length} wallet{connectedWallets.length > 1 ? 's' : ''} connected
            </span>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-accent-50 rounded-lg border border-accent-200">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-accent mt-0.5" />
          <div>
            <div className="text-sm font-medium text-accent-700">
              Secure Connection
            </div>
            <div className="text-xs text-accent-600 mt-1">
              Your wallet connection is encrypted and secure. We never store your private keys.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionSection;