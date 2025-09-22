import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface ShippingAddress {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address1: string;
	address2?: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
}

export interface BillingAddress extends ShippingAddress {
	sameAsShipping: boolean;
}

export interface PaymentInfo {
	cardNumber: string;
	expiryMonth: string;
	expiryYear: string;
	cvv: string;
	cardholderName: string;
}

export interface CheckoutState {
	currentStep: number;
	shippingAddress: Partial<ShippingAddress>;
	billingAddress: Partial<BillingAddress>;
	paymentInfo: Partial<PaymentInfo>;
	shippingMethod: string;
	orderNotes: string;
	agreedToTerms: boolean;
	completed: boolean;
}

// Create checkout store with localStorage persistence
function createCheckoutStore() {
	const initialState: CheckoutState = {
		currentStep: 1,
		shippingAddress: {},
		billingAddress: { sameAsShipping: true },
		paymentInfo: {},
		shippingMethod: 'standard',
		orderNotes: '',
		agreedToTerms: false,
		completed: false
	};

	// Load from localStorage if in browser
	let savedState = initialState;
	if (browser) {
		try {
			const stored = localStorage.getItem('keycraft-checkout');
			if (stored) {
				savedState = { ...initialState, ...JSON.parse(stored) };
			}
		} catch (error) {
			console.error('Failed to load checkout state:', error);
		}
	}

	const { subscribe, set, update } = writable<CheckoutState>(savedState);

	// Save to localStorage
	function saveState(state: CheckoutState) {
		if (browser) {
			try {
				localStorage.setItem('keycraft-checkout', JSON.stringify(state));
			} catch (error) {
				console.error('Failed to save checkout state:', error);
			}
		}
	}

	return {
		subscribe,
		
		// Update current step
		setStep: (step: number) => {
			update(state => {
				const newState = { ...state, currentStep: step };
				saveState(newState);
				return newState;
			});
		},

		// Update shipping address
		updateShippingAddress: (address: Partial<ShippingAddress>) => {
			update(state => {
				const newState = { 
					...state, 
					shippingAddress: { ...state.shippingAddress, ...address }
				};
				saveState(newState);
				return newState;
			});
		},

		// Update billing address
		updateBillingAddress: (address: Partial<BillingAddress>) => {
			update(state => {
				const newState = { 
					...state, 
					billingAddress: { ...state.billingAddress, ...address }
				};
				saveState(newState);
				return newState;
			});
		},

		// Update payment info
		updatePaymentInfo: (payment: Partial<PaymentInfo>) => {
			update(state => {
				const newState = { 
					...state, 
					paymentInfo: { ...state.paymentInfo, ...payment }
				};
				saveState(newState);
				return newState;
			});
		},

		// Update shipping method
		setShippingMethod: (method: string) => {
			update(state => {
				const newState = { ...state, shippingMethod: method };
				saveState(newState);
				return newState;
			});
		},

		// Update order notes
		setOrderNotes: (notes: string) => {
			update(state => {
				const newState = { ...state, orderNotes: notes };
				saveState(newState);
				return newState;
			});
		},

		// Toggle terms agreement
		setAgreedToTerms: (agreed: boolean) => {
			update(state => {
				const newState = { ...state, agreedToTerms: agreed };
				saveState(newState);
				return newState;
			});
		},

		// Complete checkout
		completeCheckout: () => {
			update(state => {
				const newState = { ...state, completed: true };
				saveState(newState);
				return newState;
			});
		},

		// Reset checkout
		reset: () => {
			set(initialState);
			if (browser) {
				localStorage.removeItem('keycraft-checkout');
			}
		}
	};
}

export const checkout = createCheckoutStore();