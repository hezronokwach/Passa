import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  app: {
    name: process.env.APP_NAME || 'Passa',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    url: process.env.APP_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:3001',
  },
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://passa:password@localhost:5432/passa_dev',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    name: process.env.DATABASE_NAME || 'passa_dev',
    user: process.env.DATABASE_USER || 'passa',
    password: process.env.DATABASE_PASSWORD || 'password',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
  
  clickhouse: {
    url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    host: process.env.CLICKHOUSE_HOST || 'localhost',
    port: parseInt(process.env.CLICKHOUSE_PORT || '8123', 10),
    database: process.env.CLICKHOUSE_DATABASE || 'passa_analytics',
    user: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
  },
  
  stellar: {
    network: process.env.STELLAR_NETWORK || 'testnet',
    horizonUrl: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    sorobanRpcUrl: process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
    passphrase: process.env.STELLAR_PASSPHRASE || 'Test SDF Network ; September 2015',
    platformSecretKey: process.env.PLATFORM_SECRET_KEY || '',
    platformPublicKey: process.env.PLATFORM_PUBLIC_KEY || '',
    issuerSecretKey: process.env.ISSUER_SECRET_KEY || '',
    issuerPublicKey: process.env.ISSUER_PUBLIC_KEY || '',
  },
  
  contracts: {
    revenueContractId: process.env.REVENUE_CONTRACT_ID || '',
    attributionContractId: process.env.ATTRIBUTION_CONTRACT_ID || '',
    loyaltyContractId: process.env.LOYALTY_CONTRACT_ID || '',
    ticketContractId: process.env.TICKET_CONTRACT_ID || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret_here',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },
  
  session: {
    secret: process.env.SESSION_SECRET || 'your_session_secret_here',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
  },
  
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    fromEmail: process.env.FROM_EMAIL || 'noreply@passa.io',
    fromName: process.env.FROM_NAME || 'Passa',
  },
  
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || 'passa-uploads',
    cloudfrontDomain: process.env.CLOUDFRONT_DOMAIN || '',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  log: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
  
  features: {
    enableRegistration: process.env.ENABLE_REGISTRATION === 'true',
    enableCreatorVerification: process.env.ENABLE_CREATOR_VERIFICATION === 'true',
    enableBrandCampaigns: process.env.ENABLE_BRAND_CAMPAIGNS === 'true',
    enableLoyaltyRewards: process.env.ENABLE_LOYALTY_REWARDS === 'true',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
  },
  
  development: {
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
    enableGraphQLPlayground: process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true',
    enableDebugLogs: process.env.ENABLE_DEBUG_LOGS === 'true',
  },
};
