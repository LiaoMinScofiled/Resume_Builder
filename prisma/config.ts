import { defineConfig } from '@prisma/client';

export default defineConfig({
  datasources: {
    db: {
      provider: 'sqlite',
      url: 'file:./dev.db',
    },
  },
});
