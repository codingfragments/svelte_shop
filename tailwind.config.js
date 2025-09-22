/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Catppuccin Macchiato Theme
				base: '#24273a',
				mantle: '#1e2030',
				crust: '#181926',
				surface0: '#363a4f',
				surface1: '#494d64',
				surface2: '#5b6078',
				overlay0: '#6e738d',
				overlay1: '#8087a2',
				overlay2: '#939ab7',
				subtext0: '#a5adcb',
				subtext1: '#b8c0e0',
				text: '#cad3f5',
				
				// Accent colors
				rosewater: '#f4dbd6',
				flamingo: '#f0c6c6',
				pink: '#f5bde6',
				mauve: '#c6a0f6',
				red: '#ed8796',
				maroon: '#ee99a0',
				peach: '#f5a97f',
				yellow: '#eed49f',
				green: '#a6da95',
				teal: '#8bd5ca',
				sky: '#91d7e3',
				sapphire: '#7dc4e4',
				blue: '#8aadf4',
				lavender: '#b7bdf8',
				
				// Semantic colors
				primary: '#c6a0f6', // mauve
				secondary: '#b7bdf8', // lavender
				accent: '#f5bde6', // pink
				success: '#a6da95', // green
				warning: '#eed49f', // yellow
				error: '#ed8796', // red
				
				// Background variants
				'bg-primary': '#24273a', // base
				'bg-secondary': '#1e2030', // mantle
				'bg-tertiary': '#181926', // crust
				'bg-elevated': '#363a4f', // surface0
				'bg-card': '#494d64', // surface1
				'bg-hover': '#5b6078', // surface2
				
				// Text variants
				'text-primary': '#cad3f5', // text
				'text-secondary': '#b8c0e0', // subtext1
				'text-muted': '#a5adcb', // subtext0
			},
			fontFamily: {
				'mono': ['Fira Code', 'JetBrains Mono', 'Monaco', 'Cascadia Code', 'monospace'],
				'sans': ['Inter', 'system-ui', 'sans-serif']
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			backdropBlur: {
				xs: '2px'
			},
			borderRadius: {
				'2xl': '1rem',
				'3xl': '1.5rem'
			}
		}
	},
	plugins: []
};