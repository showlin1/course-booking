import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';

export default createEndpoint({
  description: 'Checks whether the signed-in person is an administrator',
  authenticated: true,
  inputSchema: z.object({}),
  outputSchema: z.object({ isAdmin: z.boolean() }),
  execute: async ({ context }) => {
    const admins = ['cms.scaleup@gmail.com', ...(process.env.ZITE_ADMIN_EMAILS ?? '').split(',')]
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return { isAdmin: admins.includes(context.user.email.toLowerCase()) };
  },
});
