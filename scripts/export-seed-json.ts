import { writeFileSync } from 'fs';
import { join } from 'path';
import { db, queries, type Category, type Product, type ProductPicture } from '../src/lib/db/index.js';
import { APP_CONFIG } from '../src/lib/config.js';

interface ExportProduct {
	name: string;
	description: string;
	price: number;
	category: string;
	in_stock: boolean;
	stock_quantity: number;
	sku?: string;
	featured: boolean;
	pictures: string[];
}

interface ExportData {
	categories: typeof APP_CONFIG.categories;
	products: ExportProduct[];
}

export function exportSeedJson(): boolean {
	try {
		console.log('Exporting database to productseed.json...');
		
		// Get all categories
		const categories = queries.getAllCategories.all() as Category[];
		
		// Get all products with their pictures
		const products = queries.getAllProducts.all() as Product[];
		
		const exportData: ExportData = {
			categories: APP_CONFIG.categories,
			products: []
		};
		
		// Process each product
		for (const product of products) {
			// Get product pictures
			const pictures = queries.getProductPictures.all(product.id) as ProductPicture[];
			
			const exportProduct: ExportProduct = {
				name: product.name,
				description: product.description || '',
				price: product.price,
				category: product.category_slug || '',
				in_stock: product.in_stock,
				stock_quantity: product.stock_quantity,
				sku: product.sku || undefined,
				featured: product.featured,
				pictures: pictures.map(pic => pic.image_path)
			};
			
			exportData.products.push(exportProduct);
		}
		
		// Write to file
		const outputPath = join(process.cwd(), 'productseed.json');
		writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');
		
		console.log(`Exported ${exportData.products.length} products to productseed.json`);
		console.log('Export completed successfully!');
		
		// Print summary
		const categoryStats = categories.reduce((stats, cat) => {
			const count = exportData.products.filter(p => p.category === cat.slug).length;
			stats[cat.name] = count;
			return stats;
		}, {} as Record<string, number>);
		
		console.log('\nExport summary:');
		Object.entries(categoryStats).forEach(([name, count]) => {
			console.log(`${name}: ${count} products`);
		});
		
		return true;
	} catch (error) {
		console.error('Failed to export seed JSON:', error);
		return false;
	}
}

// Run export if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	exportSeedJson();
	db.close();
}