export interface PasswordCriteria {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeAmbiguous: boolean
}

export interface PasswordStrength {
  score: number
  label: string
  color: string
  percentage: number
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const AMBIGUOUS = 'il1Lo0O'

export function generatePassword(criteria: PasswordCriteria): string {
  let charset = ''
  const required: string[] = []

  if (criteria.includeUppercase) {
    const chars = criteria.excludeAmbiguous
      ? UPPERCASE.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
      : UPPERCASE
    charset += chars
    if (chars.length > 0) {
      required.push(chars[Math.floor(Math.random() * chars.length)])
    }
  }

  if (criteria.includeLowercase) {
    const chars = criteria.excludeAmbiguous
      ? LOWERCASE.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
      : LOWERCASE
    charset += chars
    if (chars.length > 0) {
      required.push(chars[Math.floor(Math.random() * chars.length)])
    }
  }

  if (criteria.includeNumbers) {
    const chars = criteria.excludeAmbiguous
      ? NUMBERS.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
      : NUMBERS
    charset += chars
    if (chars.length > 0) {
      required.push(chars[Math.floor(Math.random() * chars.length)])
    }
  }

  if (criteria.includeSymbols) {
    charset += SYMBOLS
    required.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
  }

  if (charset === '') {
    throw new Error('At least one character type must be selected')
  }

  if (required.length > criteria.length) {
    throw new Error('Password length is too short for selected criteria')
  }

  const password: string[] = [...required]

  for (let i = required.length; i < criteria.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password.push(charset[randomIndex])
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[password[i], password[j]] = [password[j], password[i]]
  }

  return password.join('')
}

export function calculatePasswordStrength(password: string, criteria: PasswordCriteria): PasswordStrength {
  let charsetSize = 0
  
  if (criteria.includeUppercase) charsetSize += criteria.excludeAmbiguous ? 24 : 26
  if (criteria.includeLowercase) charsetSize += criteria.excludeAmbiguous ? 24 : 26
  if (criteria.includeNumbers) charsetSize += criteria.excludeAmbiguous ? 8 : 10
  if (criteria.includeSymbols) charsetSize += 24

  const entropy = password.length * Math.log2(charsetSize)

  let score: number
  let label: string
  let color: string

  if (entropy < 40) {
    score = 1
    label = 'Weak'
    color = 'strength-meter-weak'
  } else if (entropy < 60) {
    score = 2
    label = 'Fair'
    color = 'strength-meter-fair'
  } else if (entropy < 80) {
    score = 3
    label = 'Good'
    color = 'strength-meter-good'
  } else {
    score = 4
    label = 'Strong'
    color = 'strength-meter-strong'
  }

  const percentage = Math.min(100, (entropy / 100) * 100)

  return { score, label, color, percentage }
}
