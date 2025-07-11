import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Calculate score
    Object.values(checks).forEach(check => {
      if (check) score += 1;
    });

    // Determine strength
    if (score < 3) return { score, label: 'Weak', color: 'error', checks };
    if (score < 4) return { score, label: 'Fair', color: 'warning', checks };
    if (score < 5) return { score, label: 'Good', color: 'accent', checks };
    return { score, label: 'Strong', color: 'success', checks };
  };

  const strength = getPasswordStrength(password);

  const requirements = [
    { key: 'length', label: 'At least 8 characters', icon: 'Hash' },
    { key: 'lowercase', label: 'One lowercase letter', icon: 'Type' },
    { key: 'uppercase', label: 'One uppercase letter', icon: 'Type' },
    { key: 'number', label: 'One number', icon: 'Hash' },
    { key: 'special', label: 'One special character', icon: 'AtSign' }
  ];

  return (
    <div className="mt-3">
      {/* Strength Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-text-tertiary">Password Strength</span>
          <span className={`text-xs font-medium text-${strength.color}`}>
            {strength.label}
          </span>
        </div>
        <div className="w-full bg-background-secondary rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-${strength.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${(strength.score / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center space-x-2">
            <Icon
              name={strength.checks?.[req.key] ? 'CheckCircle' : 'Circle'}
              size={12}
              className={
                strength.checks?.[req.key]
                  ? 'text-success' :'text-text-quaternary'
              }
            />
            <span
              className={`text-xs ${
                strength.checks?.[req.key]
                  ? 'text-success' :'text-text-tertiary'
              }`}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;