import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

AdminJS.registerAdapter(AdminJSTypeorm);

const POSTGRES_HOST = process.env.POSTGRES_HOST || 'postgres';
const POSTGRES_PORT = Number(process.env.POSTGRES_PORT || 5432);
const POSTGRES_USER = process.env.POSTGRES_USER || 'calendar_user';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'calendar_password';
const POSTGRES_DB = process.env.POSTGRES_DB || 'calendar_db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataSource = new DataSource({
    type: 'postgres',
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    entities: [__dirname + '/entities/*.js'],
    synchronize: false,
});

async function start() {
    await dataSource.initialize();
    // Ensure entity classes (if they extend BaseEntity) are connected to the DataSource
    dataSource.entityMetadatas.forEach((meta) => {
        const target = meta.target as any;
        if (typeof target?.useDataSource === 'function') {
            target.useDataSource(dataSource);
        }
    });

    // Debug: print info about entity targets to help diagnose adapter support
    dataSource.entityMetadatas.forEach((meta) => {
        const target = meta.target as any;
        // eslint-disable-next-line no-console
        console.log('Entity debug:', {
            name: target?.name,
            hasUseDataSource: typeof target?.useDataSource === 'function',
            hasGetRepository: typeof target?.getRepository === 'function',
        });
    });

    // Let the TypeORM adapter handle enumerating resources from the DataSource
    const admin = new AdminJS({
        databases: [dataSource],
        rootPath: '/admin',
    });

    const app = express();
    const router = AdminJSExpress.buildRouter(admin as any);
    app.use(admin.options.rootPath, router);

    const port = Number(process.env.ADMIN_PORT || 3002);
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`AdminJS started at http://localhost:${port}${admin.options.rootPath}`);
    });
}

start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Admin service startup error:', err);
    process.exit(1);
});
