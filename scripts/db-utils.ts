import { db, initializeDatabase, wipeDatabase } from '../src/lib/db/index.js';
import { seedDatabase } from './seed-database.js';
import { exportSeedJson } from './export-seed-json.js';

const command = process.argv[2];

switch (command) {
	case 'init':
		console.log('Initializing database...');
		if (initializeDatabase()) {
			console.log('Database initialized successfully');
		} else {
			console.error('Failed to initialize database');
			process.exit(1);
		}
		break;
		
	case 'wipe':
		console.log('Wiping database...');
		if (wipeDatabase()) {
			console.log('Database wiped successfully');
		} else {
			console.error('Failed to wipe database');
			process.exit(1);
		}
		break;
		
	case 'seed':
		if (seedDatabase()) {
			console.log('Database seeded successfully');
		} else {
			console.error('Failed to seed database');
			process.exit(1);
		}
		break;
		
	case 'export':
		if (exportSeedJson()) {
			console.log('Export completed successfully');
		} else {
			console.error('Failed to export seed JSON');
			process.exit(1);
		}
		break;
		
	case 'reset':
		console.log('Resetting database (wipe + init + seed)...');
		if (wipeDatabase() && initializeDatabase() && seedDatabase()) {
			console.log('Database reset successfully');
		} else {
			console.error('Failed to reset database');
			process.exit(1);
		}
		break;
		
	default:
		console.log('Usage: npm run db <command>');
		console.log('Commands:');
		console.log('  init   - Initialize database schema');
		console.log('  wipe   - Wipe all data from database');
		console.log('  seed   - Seed database with sample data');
		console.log('  export - Export database to productseed.json');
		console.log('  reset  - Complete reset (wipe + init + seed)');
		break;
}

// Close database connection
db.close();