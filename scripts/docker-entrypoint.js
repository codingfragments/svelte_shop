#!/usr/bin/env node

import { existsSync } from 'fs';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_PATH = process.env.DATABASE_PATH || './data/db.sqlite';

console.log('🚀 Starting KeyCraft Shop...');
console.log(`📁 Database path: ${DATABASE_PATH}`);

// Check if database exists
if (!existsSync(DATABASE_PATH)) {
	console.log('🔧 Database not found, initializing...');

	// Run database reset
	const dbReset = spawn('npx', ['tsx', 'scripts/db-utils.ts', 'reset'], {
		stdio: 'inherit',
		cwd: process.cwd()
	});

	dbReset.on('close', (code) => {
		if (code === 0) {
			console.log('✅ Database initialized successfully');
			startApp();
		} else {
			console.error('❌ Database initialization failed');
			process.exit(1);
		}
	});

	dbReset.on('error', (error) => {
		console.error('❌ Failed to run database initialization:', error);
		process.exit(1);
	});
} else {
	console.log('✅ Database found, starting application...');
	startApp();
}

function startApp() {
	console.log('🌟 Starting SvelteKit application...');

	// Start the SvelteKit application
	const app = spawn('node', ['build'], {
		stdio: 'inherit',
		cwd: process.cwd()
	});

	app.on('close', (code) => {
		console.log(`Application exited with code ${code}`);
		process.exit(code);
	});

	app.on('error', (error) => {
		console.error('Failed to start application:', error);
		process.exit(1);
	});

	// Handle graceful shutdown
	process.on('SIGTERM', () => {
		console.log('📡 Received SIGTERM, shutting down gracefully...');
		app.kill('SIGTERM');
	});

	process.on('SIGINT', () => {
		console.log('📡 Received SIGINT, shutting down gracefully...');
		app.kill('SIGINT');
	});
}
