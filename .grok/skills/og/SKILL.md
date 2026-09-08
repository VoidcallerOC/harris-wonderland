# Brand-asset pass

The pending brand marker lives at `/workspace/.grok/og-pending` and is stale after 10 minutes.

Run the deterministic pass without waiting for background work:

```sh
node scripts/brand-check.mjs --placeholder-ok
node scripts/write-atomic.mjs public/og.jpg.tmp public/og.jpg
```

## Brand-asset pass:

Dispatch the brand pass; never `wait_tasks` for it and never
`get_task_output` on it. A later verification pass can inspect the committed files.
