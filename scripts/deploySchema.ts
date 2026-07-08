import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// List of AWS regions
const regions = [
  'sa-east-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ca-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'eu-central-2',
  'eu-north-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-south-1',
  'me-central-1'
];

const password = 'Pricila2026';
const projectRef = 'ryocypvjotjsrqnluics';

async function deploy() {
  console.log('Searching for the active regional Supabase pooler (aws-0/aws-1) in parallel...');
  
  const hostsToTest: { region: string; host: string }[] = [];
  regions.forEach((region) => {
    hostsToTest.push({ region: `${region} (aws-0)`, host: `aws-0-${region}.pooler.supabase.com` });
    hostsToTest.push({ region: `${region} (aws-1)`, host: `aws-1-${region}.pooler.supabase.com` });
  });

  const connectionPromises = hostsToTest.map(async ({ region, host }) => {
    const username = `postgres.${projectRef}`;
    
    const client = new Client({
      host,
      port: 6543,
      user: username,
      password: password,
      database: 'postgres',
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      return { region, client };
    } catch (err: any) {
      await client.end().catch(() => {});
      throw new Error(`${region} (${host}): ${err.message}`);
    }
  });

  let connectionResult;
  try {
    connectionResult = await Promise.any(connectionPromises);
  } catch (err) {
    console.error('\nError: Could not connect to any of the regional Supabase poolers.');
    console.error('All connection attempts failed. Check your password or internet connection.');
    process.exit(1);
  }

  const { region, client } = connectionResult;
  console.log(`\n🎉 Connected successfully to region: ${region}`);

  try {
    const schemaPath = path.resolve('supabase_schema.sql');
    console.log(`Reading SQL schema from: ${schemaPath}`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing SQL schema on Supabase...');
    await client.query(sql);
    console.log('SQL schema executed successfully! All tables and policies created.');
    
    await client.end();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ SQL Execution Error:', err.message);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

deploy();
