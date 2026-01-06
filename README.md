# Secure Password Generator

A modern, cryptographically secure password generator built with React, TypeScript, and Tailwind CSS. Generate strong, customizable passwords with real-time strength analysis and persistent user preferences.

## Features

- **Cryptographic Security**: Uses `crypto.getRandomValues()` for truly random password generation
- **Real-time Strength Meter**: Visual feedback on password strength with entropy calculation
- **Customizable Criteria**:
  - Adjustable length (4-64 characters)
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special symbols (!@#$%^&*)
  - Option to exclude ambiguous characters (i, l, 1, L, o, 0, O)
- **Persistent Settings**: User preferences saved across sessions using KV storage
- **Auto-generate Mode**: Automatically regenerate passwords when criteria changes
- **One-click Copy**: Quick clipboard copy with visual confirmation
- **Password Visibility Toggle**: Show/hide generated passwords
- **Responsive Design**: Fully responsive layout optimized for desktop and mobile
- **Dark Theme**: Modern cybersecurity-inspired dark color scheme

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Phosphor Icons
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast notifications)
- **State Management**: React hooks + KV persistence

## Project Structure

```
src/
├── App.tsx                      # Main application component
├── components/
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── password-generator.ts    # Password generation & strength logic
│   └── utils.ts                 # Utility functions
├── index.css                    # Global styles and theme variables
└── main.tsx                     # Application entry point
```

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Password Generation Algorithm

The password generator uses the Web Crypto API (`crypto.getRandomValues()`) to ensure cryptographically secure randomness. The algorithm:

1. Builds a character set based on user-selected criteria
2. Excludes ambiguous characters if requested
3. Generates random indices using `crypto.getRandomValues()`
4. Ensures at least one character from each selected character type is included
5. Shuffles the result using Fisher-Yates algorithm for additional randomization

### Strength Calculation

Password strength is calculated based on:
- **Entropy**: `log2(character_set_size ^ password_length)`
- **Character diversity**: Bonus for using multiple character types
- **Length**: Additional points for passwords over 12 characters

Strength ratings:
- **Weak**: < 40 bits of entropy
- **Fair**: 40-59 bits
- **Good**: 60-79 bits
- **Strong**: ≥ 80 bits

## Customization

### Theme

The color scheme can be customized in `src/index.css` using CSS custom properties:

```css
:root {
  --background: oklch(0.25 0.02 240);
  --foreground: oklch(0.95 0.01 240);
  --primary: oklch(0.45 0.12 210);
  --accent: oklch(0.75 0.15 200);
  /* ... more variables */
}
```

### Fonts

Current font stack (defined in `index.html`):
- **Headings**: Space Grotesk (bold, technical feel)
- **Body**: Inter (clean, readable)
- **Monospace**: JetBrains Mono (password display)

## Security Considerations

- Passwords are generated client-side only - nothing is sent to a server
- Uses `crypto.getRandomValues()` for cryptographically secure randomness
- No password storage or logging
- Clipboard operations use the modern Clipboard API
- All data persistence is local to the user's browser

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+

Requires support for:
- Web Crypto API
- CSS Custom Properties
- ES2020+ features

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Inspired by modern security best practices and NIST password guidelines
