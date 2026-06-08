import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'luxtea-animated-web-ch1pflcc',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_FqoWvzixqMWSe-buXDhb_n-zYCojr5HN',
  authRequired: false,
  auth: { mode: 'managed' },
})
