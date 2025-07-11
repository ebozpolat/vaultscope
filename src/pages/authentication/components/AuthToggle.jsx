import React from 'react';
import { motion } from 'framer-motion';

const AuthToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="flex bg-background-secondary rounded-lg p-1 mb-6">
      <motion.button
        type="button"
        onClick={() => !isLogin && onToggle()}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
          isLogin
            ? 'bg-surface text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Sign In
      </motion.button>
      <motion.button
        type="button"
        onClick={() => isLogin && onToggle()}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
          !isLogin
            ? 'bg-surface text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Create Account
      </motion.button>
    </div>
  );
};

export default AuthToggle;