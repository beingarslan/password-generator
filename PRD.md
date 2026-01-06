# Planning Guide

A secure password generator that creates customizable, cryptographically strong passwords based on user-defined criteria including length, character types, and special requirements.

**Experience Qualities**:
1. **Trustworthy** - Users need to feel confident that generated passwords are truly random and secure, with clear visual feedback about password strength
2. **Efficient** - Password generation should be instantaneous with quick controls for adjusting criteria and one-click copying
3. **Empowering** - Users should understand what makes passwords secure through visual strength indicators and helpful guidance

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused utility with several interactive controls (sliders, toggles, checkboxes) and state management for password criteria, generation history, and user preferences, but doesn't require complex routing or data persistence beyond preferences.

## Essential Features

**Password Generation**
- Functionality: Creates random passwords using cryptographic randomness based on selected criteria (length, uppercase, lowercase, numbers, symbols)
- Purpose: Provide users with secure, unpredictable passwords that meet their specific requirements
- Trigger: Click "Generate" button or adjust any criteria with auto-generate enabled
- Progression: User sets criteria → Clicks generate → Password appears instantly → Strength indicator updates → Ready to copy
- Success criteria: Password meets all selected criteria, contains truly random characters, and displays within 100ms

**Criteria Customization**
- Functionality: Interactive controls for password length (slider), character types (toggles), exclude ambiguous characters (checkbox), and additional options
- Purpose: Allow users to match password requirements for different services and personal preferences
- Trigger: User adjusts any control (slider, toggle, checkbox)
- Progression: User modifies control → Visual feedback shows change → If auto-generate enabled, new password generates → Strength indicator updates
- Success criteria: All criteria correctly applied to generated passwords, controls are intuitive and responsive

**Password Strength Visualization**
- Functionality: Real-time visual indicator showing password strength based on entropy, length, and character diversity
- Purpose: Educate users about password security and help them create stronger passwords
- Trigger: Automatic whenever password changes
- Progression: Password generates → Entropy calculated → Strength bar fills with color-coded indicator → Strength label updates
- Success criteria: Strength calculation is accurate and updates within 50ms of password change

**One-Click Copy**
- Functionality: Copy generated password to clipboard with single click
- Purpose: Streamline workflow when creating accounts or updating passwords
- Trigger: Click copy button
- Progression: User clicks copy → Password copied to clipboard → Success toast notification appears → Button shows brief confirmation state
- Success criteria: Password reliably copied to clipboard, clear feedback provided

**Generation History**
- Functionality: Displays last 5-10 generated passwords with timestamps and ability to copy previous passwords
- Purpose: Allow users to retrieve recently generated passwords they may have lost
- Trigger: Automatic whenever new password is generated
- Progression: Password generates → Added to top of history list → Oldest password removed if limit reached → Each entry copyable
- Success criteria: History persists during session, displays clearly, allows copying of any historical password

## Edge Case Handling

- **No Character Types Selected**: Display clear error message and disable generate button until at least one character type is enabled
- **Impossible Criteria**: If required characters exceed password length, automatically adjust length or show warning
- **Very Long Passwords**: Support passwords up to 128 characters with proper display truncation and scroll
- **Rapid Clicking**: Debounce generation to prevent performance issues while still feeling responsive
- **Copy Failure**: Gracefully handle clipboard API failures with fallback message
- **Weak Settings**: Show warning badge when criteria would produce weak passwords (length < 8, single character type)

## Design Direction

The design should evoke precision, security, and technical sophistication—like a professional tool used by security experts. It should feel modern and scientific with clean lines, purposeful animations, and a color palette that communicates trust and reliability without being sterile.

## Color Selection

A sophisticated cybersecurity-inspired palette with deep teals and electric blues that communicates technical precision and digital security.

- **Primary Color**: Deep Teal (oklch(0.45 0.12 210)) - Represents security, trust, and digital protection with professional authority
- **Secondary Colors**: 
  - Dark Slate (oklch(0.25 0.02 240)) for backgrounds - Creates depth and focus
  - Soft Slate (oklch(0.35 0.03 240)) for elevated surfaces - Subtle hierarchy
- **Accent Color**: Electric Cyan (oklch(0.75 0.15 200)) - Attention-grabbing highlight for CTAs and important elements like the generate button and copy actions
- **Foreground/Background Pairings**:
  - Background Dark Slate (oklch(0.25 0.02 240)): Soft White text (oklch(0.95 0.01 240)) - Ratio 11.2:1 ✓
  - Primary Deep Teal (oklch(0.45 0.12 210)): White text (oklch(0.99 0 0)) - Ratio 5.1:1 ✓
  - Accent Electric Cyan (oklch(0.75 0.15 200)): Dark Slate text (oklch(0.25 0.02 240)) - Ratio 6.8:1 ✓
  - Success (oklch(0.65 0.15 150)): White text (oklch(0.99 0 0)) - Ratio 4.7:1 ✓
  - Warning (oklch(0.7 0.15 70)): Dark text (oklch(0.2 0.02 240)) - Ratio 8.9:1 ✓

## Font Selection

Typefaces should convey technical precision and modern clarity, balancing monospace for passwords with clean sans-serif for interface elements.

- **Typographic Hierarchy**:
  - App Title: Space Grotesk Bold/32px/tight tracking - Technical yet approachable
  - Section Headers: Space Grotesk Semibold/20px/normal tracking - Clear hierarchy
  - Body Text: Inter Medium/15px/relaxed leading - Readable controls and labels
  - Password Display: JetBrains Mono Regular/28px/monospace - Each character clearly distinguishable
  - Small Labels: Inter Regular/13px/wide tracking uppercase - Control labels and strength indicators
  - History Items: JetBrains Mono Regular/14px/monospace - Consistent password display

## Animations

Animations should feel precise and immediate—like a well-engineered machine responding to input. Focus on micro-interactions that confirm actions (button presses, successful copies) and smooth transitions for strength indicators. The generate button should have a satisfying press animation, and the strength meter should fill smoothly using easing that feels purposeful, not decorative.

- Generate button: Scale down slightly on press with electric glow effect
- Strength meter: Smooth fill animation with 300ms ease-out
- Password appearance: Subtle fade-in with slight upward movement (200ms)
- Copy confirmation: Brief scale pulse on success
- History items: Slide in from top when new password added
- Toggle switches: Smooth 150ms transition with slight bounce on the knob

## Component Selection

- **Components**:
  - Card: Main container for password generator with elevated appearance
  - Slider: Password length control with visible track and custom thumb
  - Switch: Character type toggles (uppercase, lowercase, numbers, symbols)
  - Button: Primary action for generate, secondary for copy with icon
  - Badge: Display password strength level and warnings
  - Checkbox: Additional options like "exclude ambiguous characters"
  - Progress: Visual strength indicator bar
  - ScrollArea: For generation history list
  - Tooltip: Explanatory text for strength calculations and criteria
  
- **Customizations**:
  - Custom password display area with monospace font and copy button integrated
  - Custom strength meter with gradient colors (red → yellow → green) based on strength
  - Custom history card component showing timestamp and password preview
  - Animated generate button with glow effect on hover
  
- **States**:
  - Generate button: Default (cyan gradient), Hover (brighter glow), Active (pressed down), Disabled (muted when no criteria selected)
  - Copy button: Default (ghost), Hover (subtle background), Success (green with checkmark, 2s duration)
  - Slider: Default track, Active thumb with shadow, Dragging with scale
  - Switches: Off (muted), On (accent color), Disabled (greyed out)
  
- **Icon Selection**:
  - Lightning bolt (Lightning): Generate action - conveys speed and power
  - Copy (Copy): Copy to clipboard action
  - CheckCircle: Copy success confirmation
  - Shield: Security/strength indicator
  - Clock: Generation history timestamp
  - Shuffle: Randomization/regenerate
  - Eye/EyeSlash: Show/hide password toggle
  
- **Spacing**:
  - Container padding: p-6 (24px) on desktop, p-4 (16px) on mobile
  - Section gaps: gap-6 (24px) between major sections
  - Control groups: gap-4 (16px) within related controls
  - Inline elements: gap-2 (8px) for buttons and labels
  - Card elevation: Subtle shadow with border
  
- **Mobile**:
  - Stack controls vertically with full-width inputs
  - Reduce password font size to 20px for better fit
  - Collapse history to show 3 most recent on mobile
  - Touch-friendly slider with larger thumb (minimum 44px hit area)
  - Bottom-fixed generate button on mobile for easy thumb access
  - Single column layout with generous spacing
