import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Synth Theme Colors
        synth: {
          // Primary background colors
          bg: {
            primary: '#0c0020',      // editor.background
            secondary: '#07071b',    // sideBar.background
            tertiary: '#040015',     // activityBar.background
            card: '#171520DC',       // editorWidget.background
            hover: '#180043',        // list.hoverBackground
            active: '#340f5a',       // list.activeSelectionBackground
          },
          // Text colors
          text: {
            primary: '#dbd4fa',      // editor.foreground
            secondary: '#c89cff',    // foreground
            muted: '#8e85b0',        // sideBar.foreground
            accent: '#9c45ff',       // activityBar.foreground
            bright: '#ffffff',       // tab.activeForeground
          },
          // Neon accent colors
          neon: {
            purple: '#ff7edb',       // terminal.ansiMagenta
            cyan: '#03edf9',         // terminal.ansiCyan
            green: '#72f1b8',        // terminal.ansiGreen
            orange: '#f97e72',       // terminal.ansiRed
            yellow: '#f9f072',       // terminal.ansiYellow
            blue: '#039ff9',         // terminal.ansiBrightBlue
            pink: '#ff3bef',         // Tag attribute
            lime: '#53d49e',         // terminal.ansiBrightYellow
          },
          // Status colors
          status: {
            success: '#72f1b8',      // terminal.ansiGreen
            warning: '#f9f072',      // terminal.ansiYellow
            error: '#fe4450',        // errorForeground
            info: '#03edf9',         // terminal.ansiCyan
          },
          // Border and divider colors
          border: {
            primary: '#6d2980',      // editorGroup.border
            secondary: '#6839d124',  // sideBar.border
            accent: '#495495',       // editorBracketMatch.border
            neon: '#ff7edb99',       // inputOption.activeBorder
          },
          // Jira-specific colors (maintained for compatibility)
          jira: {
            blue: '#0052CC',
            dark: '#172B4D',
            light: '#F4F5F7',
            green: '#36B37E',
            orange: '#FF5630',
            yellow: '#FFAB00',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'neon-pulse': 'neonPulse 1.5s ease-in-out infinite',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #ff7edb, 0 0 10px #ff7edb, 0 0 15px #ff7edb' },
          '100%': { boxShadow: '0 0 10px #ff7edb, 0 0 20px #ff7edb, 0 0 30px #ff7edb' },
        },
        neonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      boxShadow: {
        'neon': '0 0 5px #ff7edb, 0 0 10px #ff7edb, 0 0 15px #ff7edb',
        'neon-lg': '0 0 10px #ff7edb, 0 0 20px #ff7edb, 0 0 30px #ff7edb',
        'neon-cyan': '0 0 5px #03edf9, 0 0 10px #03edf9, 0 0 15px #03edf9',
        'neon-green': '0 0 5px #72f1b8, 0 0 10px #72f1b8, 0 0 15px #72f1b8',
        'neon-orange': '0 0 5px #f97e72, 0 0 10px #f97e72, 0 0 15px #f97e72',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-gradient': 'linear-gradient(45deg, #ff7edb, #03edf9, #72f1b8)',
      },
    },
  },
  plugins: [],
}

export default config
