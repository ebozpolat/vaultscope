import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Icon from 'components/AppIcon';
import SocialAuthSection from './components/SocialAuthSection';
import WalletConnectionSection from './components/WalletConnectionSection';
import AuthToggle from './components/AuthToggle';
import PasswordStrengthIndicator from './components/PasswordStrengthIndicator';

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // TODO: Implement actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API call
      
      if (isLogin) {
        console.log('Login data:', data);
        // Handle login
      } else {
        console.log('Register data:', data);
        // Handle registration
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-surface rounded-xl shadow-elevation-3 p-8 border border-border"
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Icon name="Shield" size={32} className="text-primary mr-2" />
              <h1 className="text-2xl font-bold text-text-primary">VaultScope</h1>
            </div>
            <p className="text-text-secondary text-sm">
              Crypto Risk Surveillance Platform
            </p>
          </div>

          {/* Auth Toggle */}
          <AuthToggle isLogin={isLogin} onToggle={toggleMode} />

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name - Only for Registration */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className={errors.fullName ? 'border-error' : ''}
                />
                {errors.fullName && (
                  <p className="text-error text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={errors.email ? 'border-error' : ''}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Company - Only for Registration */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Company
                </label>
                <Input
                  type="text"
                  placeholder="Enter your company name"
                  {...register('company', {
                    required: 'Company name is required'
                  })}
                  className={errors.company ? 'border-error' : ''}
                />
                {errors.company && (
                  <p className="text-error text-sm mt-1">{errors.company.message}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  className={errors.password ? 'border-error pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
              {!isLogin && password && (
                <PasswordStrengthIndicator password={password} />
              )}
            </div>

            {/* Terms and Conditions - Only for Registration */}
            {!isLogin && (
              <div className="flex items-start">
                <Input
                  type="checkbox"
                  {...register('acceptTerms', {
                    required: 'You must accept the terms and conditions'
                  })}
                  className="mt-1"
                />
                <label className="ml-2 text-sm text-text-secondary">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}
            {errors.acceptTerms && (
              <p className="text-error text-sm">{errors.acceptTerms.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              className="mt-6"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Forgot Password - Only for Login */}
            {isLogin && (
              <div className="text-center mt-4">
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-tertiary">Or continue with</span>
            </div>
          </div>

          {/* Social Authentication */}
          <SocialAuthSection />

          {/* Wallet Connection */}
          <WalletConnectionSection />
        </motion.div>
      </div>
    </div>
  );
};

export default Authentication;