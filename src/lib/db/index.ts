import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Database configuration
const DB_PATH = process.env.DATABASE_PATH || './data/db.sqlite';

// Ensure database directory exists
const dbDir = dirname(DB_PATH);
if (!existsSync(dbDir)) {
	console.log(`Creating database directory: ${dbDir}`);
	mkdirSync(dbDir, { recursive: true });
}

// Initialize database
export const db = new Database(DB_PATH);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
	try {
		const schemaPath = join(__dirname, 'schema.sql');
		const schema = readFileSync(schemaPath, 'utf-8');
		
		// Execute schema
		db.exec(schema);
		
		console.log('Database schema initialized successfully');
		return true;
	} catch (error) {
		console.error('Failed to initialize database schema:', error);
		return false;
	}
}

// Wipe database (drop all tables)
export function wipeDatabase() {
	try {
		// Drop tables in reverse order due to foreign key constraints
		db.exec(`
			DROP TABLE IF EXISTS faq_products;
			DROP TABLE IF EXISTS faqs;
			DROP TABLE IF EXISTS product_pictures;
			DROP TABLE IF EXISTS products;
			DROP TABLE IF EXISTS categories;
		`);
		
		console.log('Database wiped successfully');
		return true;
	} catch (error) {
		console.error('Failed to wipe database:', error);
		return false;
	}
}

// Close database connection
export function closeDatabase() {
	db.close();
}

// Database query helpers - lazy initialization
let _queries: any = null;

export const queries = {
	get insertCategory() {
		if (!_queries) initQueries();
		return _queries.insertCategory;
	},
	get getAllCategories() {
		if (!_queries) initQueries();
		return _queries.getAllCategories;
	},
	get getCategoryById() {
		if (!_queries) initQueries();
		return _queries.getCategoryById;
	},
	get getCategoryBySlug() {
		if (!_queries) initQueries();
		return _queries.getCategoryBySlug;
	},
	get insertProduct() {
		if (!_queries) initQueries();
		return _queries.insertProduct;
	},
	get getAllProducts() {
		if (!_queries) initQueries();
		return _queries.getAllProducts;
	},
	get getProductsByCategory() {
		if (!_queries) initQueries();
		return _queries.getProductsByCategory;
	},
	get getProductById() {
		if (!_queries) initQueries();
		return _queries.getProductById;
	},
	get getProductBySlug() {
		if (!_queries) initQueries();
		return _queries.getProductBySlug;
	},
	get insertProductPicture() {
		if (!_queries) initQueries();
		return _queries.insertProductPicture;
	},
	get getProductPictures() {
		if (!_queries) initQueries();
		return _queries.getProductPictures;
	},
	get getPrimaryProductPicture() {
		if (!_queries) initQueries();
		return _queries.getPrimaryProductPicture;
	},
	get insertFAQ() {
		if (!_queries) initQueries();
		return _queries.insertFAQ;
	},
	get insertFAQProduct() {
		if (!_queries) initQueries();
		return _queries.insertFAQProduct;
	},
	get getAllFAQs() {
		if (!_queries) initQueries();
		return _queries.getAllFAQs;
	},
	get getFAQsByCategory() {
		if (!_queries) initQueries();
		return _queries.getFAQsByCategory;
	},
	get getFAQProducts() {
		if (!_queries) initQueries();
		return _queries.getFAQProducts;
	}
};

function initQueries() {
	_queries = {
		// Categories
		insertCategory: db.prepare(`
			INSERT INTO categories (name, slug, description, icon)
			VALUES (?, ?, ?, ?)
		`),
		
		getAllCategories: db.prepare('SELECT * FROM categories ORDER BY name'),
		
		getCategoryById: db.prepare('SELECT * FROM categories WHERE id = ?'),
		
		getCategoryBySlug: db.prepare('SELECT * FROM categories WHERE slug = ?'),
		
		// Products
		insertProduct: db.prepare(`
			INSERT INTO products (name, slug, description, price, category_id, in_stock, stock_quantity, sku, featured)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`),
		
		getAllProducts: db.prepare(`
			SELECT p.*, c.name as category_name, c.slug as category_slug
			FROM products p
			LEFT JOIN categories c ON p.category_id = c.id
			ORDER BY p.created_at DESC
		`),
		
		getProductsByCategory: db.prepare(`
			SELECT p.*, c.name as category_name, c.slug as category_slug
			FROM products p
			LEFT JOIN categories c ON p.category_id = c.id
			WHERE c.slug = ?
			ORDER BY p.created_at DESC
		`),
		
		getProductById: db.prepare(`
			SELECT p.*, c.name as category_name, c.slug as category_slug
			FROM products p
			LEFT JOIN categories c ON p.category_id = c.id
			WHERE p.id = ?
		`),
		
		getProductBySlug: db.prepare(`
			SELECT p.*, c.name as category_name, c.slug as category_slug
			FROM products p
			LEFT JOIN categories c ON p.category_id = c.id
			WHERE p.slug = ?
		`),
		
		// Product Pictures
		insertProductPicture: db.prepare(`
			INSERT INTO product_pictures (product_id, image_path, alt_text, sort_order, is_primary)
			VALUES (?, ?, ?, ?, ?)
		`),
		
		getProductPictures: db.prepare(`
			SELECT * FROM product_pictures
			WHERE product_id = ?
			ORDER BY sort_order ASC
		`),
		
		getPrimaryProductPicture: db.prepare(`
			SELECT * FROM product_pictures
			WHERE product_id = ? AND is_primary = TRUE
			LIMIT 1
		`),
		
		// FAQs
		insertFAQ: db.prepare(`
			INSERT INTO faqs (question, answer, category, sort_order, is_featured)
			VALUES (?, ?, ?, ?, ?)
		`),
		
		insertFAQProduct: db.prepare(`
			INSERT INTO faq_products (faq_id, product_id, sort_order)
			VALUES (?, ?, ?)
		`),
		
		getAllFAQs: db.prepare(`
			SELECT * FROM faqs
			ORDER BY sort_order ASC, created_at DESC
		`),
		
		getFAQsByCategory: db.prepare(`
			SELECT * FROM faqs
			WHERE category = ?
			ORDER BY sort_order ASC, created_at DESC
		`),
		
		getFAQProducts: db.prepare(`
			SELECT fp.*, p.name, p.slug, p.price, c.slug as category_slug
			FROM faq_products fp
			LEFT JOIN products p ON fp.product_id = p.id
			LEFT JOIN categories c ON p.category_id = c.id
			WHERE fp.faq_id = ?
			ORDER BY fp.sort_order ASC
		`)
	};
}

// Types
export interface Category {
	id: number;
	name: string;
	slug: string;
	description?: string;
	icon?: string;
	created_at: string;
	updated_at: string;
}

export interface Product {
	id: number;
	name: string;
	slug: string;
	description?: string;
	price: number;
	category_id: number;
	in_stock: boolean;
	stock_quantity: number;
	sku?: string;
	featured: boolean;
	created_at: string;
	updated_at: string;
	category_name?: string;
	category_slug?: string;
}

export interface ProductPicture {
	id: number;
	product_id: number;
	image_path: string;
	alt_text?: string;
	sort_order: number;
	is_primary: boolean;
	created_at: string;
}

export interface FAQ {
	id: number;
	question: string;
	answer: string;
	category?: string;
	sort_order: number;
	is_featured: boolean;
	created_at: string;
	updated_at: string;
}

export interface FAQProduct {
	id: number;
	faq_id: number;
	product_id: number;
	sort_order: number;
	created_at: string;
	name?: string;
	slug?: string;
	price?: number;
	category_slug?: string;
}