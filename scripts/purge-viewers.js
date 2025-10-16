#!/usr/bin/env node
/**
 * Purge Sanity productViewer documents in safe, rate-limited batches.
 *
 * Usage examples:
 *   SANITY_API_TOKEN=xxxx NEXT_PUBLIC_SANITY_PROJECT_ID=yyyy NEXT_PUBLIC_SANITY_DATASET=production \
 *   node scripts/purge-viewers.js --olderThanHours=24 --limit=1000
 *
 *   # Delete ALL productViewer docs (use with caution)
 *   SANITY_API_TOKEN=xxxx NEXT_PUBLIC_SANITY_PROJECT_ID=yyyy NEXT_PUBLIC_SANITY_DATASET=production \
 *   node scripts/purge-viewers.js --all --limit=2000
 *
 * Flags:
 *   --olderThanHours=<number>   Only delete docs with lastSeen older than this (default 24)
 *   --all                       Delete all productViewer docs, ignoring age
 *   --limit=<number>            Max docs to delete per loop iteration (default 1000)
 *   --dry-run                   Print what would be deleted without actually deleting
 */

// Support modern @sanity/client (v7+) on Node >=18
const { createClient } = require('@sanity/client')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  process.exit(1)
}
if (!token) {
  console.error('Missing SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  token,
  useCdn: false,
})

const args = process.argv.slice(2)
let olderThanHours = 24
let all = false
let dryRun = false
let limit = 1000

for (const arg of args) {
  if (arg.startsWith('--olderThanHours=')) {
    olderThanHours = parseInt(arg.split('=')[1], 10)
  } else if (arg === '--all') {
    all = true
  } else if (arg === '--dry-run') {
    dryRun = true
  } else if (arg.startsWith('--limit=')) {
    limit = parseInt(arg.split('=')[1], 10)
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString()
  const params = { cutoff }

  const buildQuery = () => {
    if (all) {
      return `*[_type == "productViewer"] | order(lastSeen asc) [0...${limit}] { _id }`
    }
    return `*[_type == "productViewer" && lastSeen < $cutoff] | order(lastSeen asc) [0...${limit}] { _id }`
  }

  let totalDeleted = 0
  let iteration = 0
  const maxIterations = 1000 // safety guard

  while (iteration < maxIterations) {
    iteration++
    const query = buildQuery()
    const docs = await client.fetch(query, params)
    if (!docs || docs.length === 0) {
      console.log('No more productViewer documents matching the criteria.')
      break
    }

    console.log(`Iteration ${iteration}: Found ${docs.length} docs to delete`)

    for (const doc of docs) {
      if (dryRun) {
        console.log(`[DRY] Would delete ${doc._id}`)
      } else {
        try {
          await client.delete(doc._id)
          totalDeleted++
        } catch (err) {
          console.error(`Failed to delete ${doc._id}: ${err.message}`)
        }
        // Respect API rate limits
        await sleep(200)
      }
    }

    // Small pause between loops
    await sleep(500)
  }

  console.log(JSON.stringify({
    success: true,
    message: dryRun ? 'Dry run completed' : 'Purge completed',
    olderThanHours,
    deletedCount: dryRun ? 0 : totalDeleted,
    dataset,
    projectId,
  }, null, 2))
}

main().catch((err) => {
  console.error('Unexpected error during purge:', err)
  process.exit(1)
})