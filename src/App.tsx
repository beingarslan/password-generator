import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightning, Copy, CheckCircle, Eye, EyeSlash, Shuffle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { generatePassword, calculatePasswordStrength, type PasswordCriteria } from '@/lib/password-generator'

function App() {
  const [criteria, setCriteria] = useKV<PasswordCriteria>('password-criteria', {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
  })

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [copied, setCopied] = useState(false)
  const [autoGenerate, setAutoGenerate] = useKV<boolean>('auto-generate', false)

  const strength = password && criteria ? calculatePasswordStrength(password, criteria) : null

  const hasValidCriteria = criteria ? (
    criteria.includeUppercase || 
    criteria.includeLowercase || 
    criteria.includeNumbers || 
    criteria.includeSymbols
  ) : false

  useEffect(() => {
    if (!password && criteria) {
      handleGenerate()
    }
  }, [criteria])

  useEffect(() => {
    if (autoGenerate && password && criteria) {
      handleGenerate()
    }
  }, [criteria])

  const handleGenerate = () => {
    if (!hasValidCriteria || !criteria) {
      toast.error('Please select at least one character type')
      return
    }

    try {
      const newPassword = generatePassword(criteria)
      setPassword(newPassword)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate password')
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Password copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy password')
    }
  }

  const updateCriteria = (updates: Partial<PasswordCriteria>) => {
    if (!criteria) return
    setCriteria({ ...criteria, ...updates })
  }

  if (!criteria) {
    return null
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-2 tracking-tight">
            Coduko Password Generator
          </h1>
          <p className="text-muted-foreground text-base">
            Create cryptographically strong passwords tailored to your needs
          </p>
        </motion.header>

        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-6 border-2 border-border/50" role="region" aria-label="Password Generator">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide" htmlFor="generated-password">
                      Generated Password
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-8 w-8 p-0"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-muted rounded-lg p-4 pr-14 border border-border">
                      <p className="font-mono text-2xl md:text-3xl text-foreground break-all select-all" id="generated-password" aria-live="polite">
                        {showPassword ? password : '•'.repeat(password.length)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleCopy(password)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0"
                      variant="ghost"
                      disabled={!password}
                      aria-label="Copy password to clipboard"
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <CheckCircle size={20} weight="fill" className="text-green-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Copy size={20} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                </div>

                {strength && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                    role="status"
                    aria-label="Password strength"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Strength
                      </span>
                      <Badge variant="secondary" className="font-medium">
                        {strength.label}
                      </Badge>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${strength.percentage}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`h-full ${strength.color} rounded-full`}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={!hasValidCriteria}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold generate-button-glow transition-all"
                    size="lg"
                  >
                    <Lightning size={20} weight="fill" className="mr-2" />
                    Generate Password
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleGenerate}
                          disabled={!hasValidCriteria}
                          variant="outline"
                          size="lg"
                          className="px-4"
                        >
                          <Shuffle size={20} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Regenerate</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-border/50" role="region" aria-label="Password Customization Options">
              <div className="space-y-6">
                <h2 className="font-heading font-semibold text-xl text-foreground">
                  Customize Password
                </h2>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground" htmlFor="password-length-slider">
                        Password Length
                      </label>
                      <Badge variant="outline" className="font-mono text-base px-3" aria-live="polite">
                        {criteria.length}
                      </Badge>
                    </div>
                    <Slider
                      id="password-length-slider"
                      value={[criteria.length]}
                      onValueChange={([value]) => updateCriteria({ length: value })}
                      min={4}
                      max={64}
                      step={1}
                      className="cursor-pointer"
                      aria-label="Password length"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>4</span>
                      <span>64</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Character Types
                    </label>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <label htmlFor="uppercase" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                          Uppercase Letters (A-Z)
                        </label>
                        <Switch
                          id="uppercase"
                          checked={criteria.includeUppercase}
                          onCheckedChange={(checked) => updateCriteria({ includeUppercase: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <label htmlFor="lowercase" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                          Lowercase Letters (a-z)
                        </label>
                        <Switch
                          id="lowercase"
                          checked={criteria.includeLowercase}
                          onCheckedChange={(checked) => updateCriteria({ includeLowercase: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <label htmlFor="numbers" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                          Numbers (0-9)
                        </label>
                        <Switch
                          id="numbers"
                          checked={criteria.includeNumbers}
                          onCheckedChange={(checked) => updateCriteria({ includeNumbers: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <label htmlFor="symbols" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                          Symbols (!@#$%^&*)
                        </label>
                        <Switch
                          id="symbols"
                          checked={criteria.includeSymbols}
                          onCheckedChange={(checked) => updateCriteria({ includeSymbols: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Additional Options
                    </label>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <Checkbox
                          id="ambiguous"
                          checked={criteria.excludeAmbiguous}
                          onCheckedChange={(checked) => updateCriteria({ excludeAmbiguous: checked as boolean })}
                        />
                        <label htmlFor="ambiguous" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                          Exclude Ambiguous Characters (i, l, 1, L, o, 0, O)
                        </label>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <Checkbox
                          id="auto-generate"
                          checked={autoGenerate}
                          onCheckedChange={(checked) => setAutoGenerate(checked as boolean)}
                        />
                        <label htmlFor="auto-generate" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                          Auto-generate on criteria change
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
        </div>

        <section className="mt-12 max-w-3xl mx-auto space-y-8 text-muted-foreground" aria-label="Password Security Information">
          <article className="space-y-4">
            <h2 className="font-heading font-semibold text-2xl text-foreground">
              Why Use a Secure Password Generator?
            </h2>
            <p className="leading-relaxed">
              Creating strong, unique passwords for every account is essential for protecting your online identity. Coduko's password generator uses cryptographically secure random number generation to create passwords that are virtually impossible to crack. Unlike human-created passwords, which often contain predictable patterns, generated passwords have true randomness that maximizes security.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="font-heading font-semibold text-2xl text-foreground">
              What Makes a Password Strong?
            </h2>
            <p className="leading-relaxed">
              A strong password combines length with character diversity. We recommend at least 16 characters using a mix of uppercase letters, lowercase letters, numbers, and symbols. The strength meter above calculates entropy - a measure of randomness - to show you exactly how secure your password is. Higher entropy means exponentially more possible combinations, making brute-force attacks impractical.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="font-heading font-semibold text-2xl text-foreground">
              Is This Password Generator Safe?
            </h2>
            <p className="leading-relaxed">
              Absolutely. All passwords are generated entirely in your browser using the Web Crypto API (crypto.getRandomValues()). Nothing is stored, logged, or transmitted to any server. Your generated passwords exist only on your device and in your clipboard when you copy them. This client-side approach ensures complete privacy and security.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="font-heading font-semibold text-2xl text-foreground">
              Password Best Practices
            </h2>
            <ul className="space-y-2 list-disc list-inside leading-relaxed">
              <li>Use unique passwords for every account - never reuse passwords</li>
              <li>Aim for 16+ characters when possible for maximum security</li>
              <li>Enable two-factor authentication (2FA) whenever available</li>
              <li>Store passwords securely in a reputable password manager</li>
              <li>Change passwords immediately if you suspect a breach</li>
              <li>Avoid dictionary words, personal information, and common patterns</li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  )
}

export default App
