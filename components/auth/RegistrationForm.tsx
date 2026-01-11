/**
 * Registration Form Component
 * 
 * User-friendly registration form with validation
 * Plain language, educational, privacy-focused
 */

import React, { useState } from 'react';
import authService, { RegisterRequest } from '../../services/auth/AuthService';
import { loggingService } from '../../services/logging/LoggingService';
import notificationService from '../../services/notification/NotificationService';

interface RegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    full_name: '',
    password: '',
    create_system_user: true,
    role: 'viewer'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  /**
   * Calculate password strength
   */
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'password') {
      setFormData({ ...formData, [name]: value });
      setPasswordStrength(calculatePasswordStrength(value));
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain lowercase letters, numbers, _ and -';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak. Use a mix of letters, numbers, and symbols.';
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms of service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notificationService.warning('Please fix the errors', 'Check the form and try again', 3000);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await authService.register(formData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      loggingService.error('Registration failed', err, { username: formData.username });
      setErrors({ submit: err.message });
      notificationService.error('Registration Failed', err.message, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get password strength label
   */
  const getPasswordStrengthLabel = (): string => {
    if (passwordStrength === 0) return 'No password';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Fair';
    if (passwordStrength === 4) return 'Good';
    return 'Strong';
  };

  /**
   * Get password strength color
   */
  const getPasswordStrengthColor = (): string => {
    if (passwordStrength <= 2) return 'text-red-400';
    if (passwordStrength === 3) return 'text-yellow-400';
    if (passwordStrength === 4) return 'text-blue-400';
    return 'text-green-400';
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-obsidian-900 rounded-lg border border-obsidian-800">
      <h2 className="text-2xl font-bold mb-4 text-white">Create Account</h2>
      <p className="text-obsidian-300 mb-6 text-sm">
        Join VectorFORGE and start creating amazing designs with AI-powered tools.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1 text-obsidian-200">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-obsidian-800 border rounded-lg text-white ${
              errors.username ? 'border-red-500' : 'border-obsidian-700'
            }`}
            placeholder="johndoe"
            required
          />
          {errors.username && (
            <p className="text-red-400 text-xs mt-1">{errors.username}</p>
          )}
          <p className="text-obsidian-400 text-xs mt-1">
            Lowercase letters, numbers, _ and - only
          </p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-obsidian-200">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-obsidian-800 border rounded-lg text-white ${
              errors.email ? 'border-red-500' : 'border-obsidian-700'
            }`}
            placeholder="john@example.com"
            required
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium mb-1 text-obsidian-200">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-obsidian-800 border rounded-lg text-white ${
              errors.full_name ? 'border-red-500' : 'border-obsidian-700'
            }`}
            placeholder="John Doe"
            required
          />
          {errors.full_name && (
            <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-obsidian-200">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-obsidian-800 border rounded-lg text-white ${
              errors.password ? 'border-red-500' : 'border-obsidian-700'
            }`}
            placeholder="••••••••"
            required
          />
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-obsidian-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      passwordStrength <= 2 ? 'bg-red-500' :
                      passwordStrength === 3 ? 'bg-yellow-500' :
                      passwordStrength === 4 ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                  {getPasswordStrengthLabel()}
                </span>
              </div>
            </div>
          )}
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
          <p className="text-obsidian-400 text-xs mt-1">
            At least 8 characters, mix of letters, numbers, and symbols
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-obsidian-200">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: '' });
              }
            }}
            className={`w-full px-4 py-2 bg-obsidian-800 border rounded-lg text-white ${
              errors.confirmPassword ? 'border-red-500' : 'border-obsidian-700'
            }`}
            placeholder="••••••••"
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms of Service */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              if (errors.terms) {
                setErrors({ ...errors, terms: '' });
              }
            }}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-obsidian-300">
            I accept the{' '}
            <a href="/terms" target="_blank" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-red-400 text-xs">{errors.terms}</p>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-obsidian-700 hover:bg-obsidian-600 rounded-lg font-medium text-white"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;

