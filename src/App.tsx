import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightning, Copy, CheckCircle, Eye, EyeSlash, Clock, Shuffle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { generatePassword, calculatePasswordStrength, type PasswordCriteria } from '@/lib/password-generator'

interface HistoryItem {
  id: string
  password: string
  timestamp: number
  length: number
}

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
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [autoGenerate, setAutoGenerate] = useKV<boolean>('auto-generate', false)

  const strength = password && criteria ? calculatePasswordStrength(password, criteria) : null

  const hasValidCriteria = criteria ? (
    criteria.includeUppercase || 
    criteria.includeLowercase || 
    criteria.includeNumbers || 
    criteria.includeSymbols
  ) : false

  useEffect(() => {
    if (!password) {
      handleGenerate()
    }
  }, [])

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
      
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        password: newPassword,
        timestamp: Date.now(),
        length: newPassword.length,
      }
      
      setHistory((prev) => [historyItem, ...prev].slice(0, 10))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate password')
    }
  }

  const handleCopy = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id || 'main')
      toast.success('Password copied to clipboard')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('Failed to copy password')
    }
  }

  const updateCriteria = (updates: Partial<PasswordCriteria>) => {
    if (!criteria) return
    setCriteria({ ...criteria, ...updates })
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  if (!criteria) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-2 tracking-tight">
            Secure Password Generator
          </h1>
          <p className="text-muted-foreground text-base">
            Create cryptographically strong passwords tailored to your needs
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-2 border-border/50">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Generated Password
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-8 w-8 p-0"
                    >
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-muted rounded-lg p-4 pr-14 border border-border">
                      <p className="font-mono text-2xl md:text-3xl text-foreground break-all select-all">
                        {showPassword ? password : '•'.repeat(password.length)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleCopy(password)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0"
                      variant="ghost"
                      disabled={!password}
                    >
                      <AnimatePresence mode="wait">
                        {copiedId === 'main' ? (
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

            <Card className="p-6 border-2 border-border/50">
              <div className="space-y-6">
                <h3 className="font-heading font-semibold text-xl text-foreground">
                  Customize Password
                </h3>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">
                        Password Length
                      </label>
                      <Badge variant="outline" className="font-mono text-base px-3">
                        {criteria.length}
                      </Badge>
                    </div>
                    <Slider
                      value={[criteria.length]}
                      onValueChange={([value]) => updateCriteria({ length: value })}
                      min={4}
                      max={64}
                      step={1}
                      className="cursor-pointer"
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

          <div className="lg:col-span-1">
            <Card className="p-6 border-2 border-border/50 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-muted-foreground" />
                <h3 className="font-heading font-semibold text-xl text-foreground">
                  History
                </h3>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">
                    No passwords generated yet
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {history.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="group relative p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-mono text-sm text-foreground break-all flex-1 select-all">
                              {item.password}
                            </p>
                            <Button
                              onClick={() => handleCopy(item.password, item.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedId === item.id ? (
                                <CheckCircle size={16} weight="fill" className="text-green-500" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.length} characters</span>
                            <span>{formatTimestamp(item.timestamp)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
