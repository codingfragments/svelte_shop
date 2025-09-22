import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface CartItem {
	id: number;
	name: string;
	slug: string;
	category_slug: string;
	price: number;
	quantity: number;
	image_path?: string;
	in_stock: boolean;
	stock_quantity: number;
}

export interface Cart {
	items: CartItem[];
	total: number;
	itemCount: number;
}

// Create cart store with localStorage persistence
function createCartStore() {
	const initialCart: Cart = {
		items: [],
		total: 0,
		itemCount: 0
	};

	// Load cart from localStorage if in browser
	let savedCart = initialCart;
	if (browser) {
		try {
			const stored = localStorage.getItem('keycraft-cart');
			if (stored) {
				savedCart = JSON.parse(stored);
			}
		} catch (error) {
			console.error('Failed to load cart from localStorage:', error);
		}
	}

	const { subscribe, set, update } = writable<Cart>(savedCart);

	// Calculate totals
	function calculateTotals(items: CartItem[]): Pick<Cart, 'total' | 'itemCount'> {
		const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
		const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
		return { total, itemCount };
	}

	// Save cart to localStorage
	function saveCart(cart: Cart) {
		if (browser) {
			try {
				localStorage.setItem('keycraft-cart', JSON.stringify(cart));
			} catch (error) {
				console.error('Failed to save cart to localStorage:', error);
			}
		}
	}

	return {
		subscribe,
		
		// Add item to cart
		addItem: (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
			update(cart => {
				const existingItemIndex = cart.items.findIndex(item => item.id === product.id);
				
				if (existingItemIndex >= 0) {
					// Update existing item quantity
					const existingItem = cart.items[existingItemIndex];
					const newQuantity = Math.min(
						existingItem.quantity + quantity,
						product.stock_quantity
					);
					cart.items[existingItemIndex] = { ...existingItem, quantity: newQuantity };
				} else {
					// Add new item
					const newQuantity = Math.min(quantity, product.stock_quantity);
					cart.items.push({ ...product, quantity: newQuantity });
				}

				const totals = calculateTotals(cart.items);
				const newCart = { ...cart, ...totals };
				saveCart(newCart);
				return newCart;
			});
		},

		// Update item quantity
		updateQuantity: (productId: number, quantity: number) => {
			update(cart => {
				const itemIndex = cart.items.findIndex(item => item.id === productId);
				if (itemIndex >= 0) {
					const item = cart.items[itemIndex];
					const newQuantity = Math.max(0, Math.min(quantity, item.stock_quantity));
					
					if (newQuantity === 0) {
						// Remove item if quantity is 0
						cart.items.splice(itemIndex, 1);
					} else {
						cart.items[itemIndex] = { ...item, quantity: newQuantity };
					}
				}

				const totals = calculateTotals(cart.items);
				const newCart = { ...cart, ...totals };
				saveCart(newCart);
				return newCart;
			});
		},

		// Remove item from cart
		removeItem: (productId: number) => {
			update(cart => {
				cart.items = cart.items.filter(item => item.id !== productId);
				const totals = calculateTotals(cart.items);
				const newCart = { ...cart, ...totals };
				saveCart(newCart);
				return newCart;
			});
		},

		// Clear entire cart
		clearCart: () => {
			const newCart = initialCart;
			set(newCart);
			saveCart(newCart);
		},

		// Check if product is in cart
		isInCart: (productId: number) => {
			let isInCart = false;
			subscribe(cart => {
				isInCart = cart.items.some(item => item.id === productId);
			})();
			return isInCart;
		},

		// Get item quantity in cart
		getItemQuantity: (productId: number) => {
			let quantity = 0;
			subscribe(cart => {
				const item = cart.items.find(item => item.id === productId);
				quantity = item?.quantity || 0;
			})();
			return quantity;
		}
	};
}

export const cart = createCartStore();