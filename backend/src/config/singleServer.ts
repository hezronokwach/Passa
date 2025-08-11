import path from 'path';

export const singleServerConfig = {
  // Frontend build directory
  frontendBuildPath: path.join(__dirname, '../../public'),
  
  // SPA fallback settings
  spaFallback: {
    indexFile: 'index.html',
    routes: [
      '/',
      '/events',
      '/dashboard',
      '/profile',
      '/auth/*',
      '/about',
      '/contact'
    ]
  },
  
  // Static file caching
  staticCache: {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res: any, path: string) => {
      if (path.includes('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }
};
