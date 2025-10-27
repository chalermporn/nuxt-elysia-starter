import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const options = {
    logLevel: 'info',
    output: ['html', 'json'],
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  }

  const runnerResult = await lighthouse(url, options)

  await chrome.kill()

  // Create reports directory if it doesn't exist
  const reportsDir = path.join(__dirname, '..', 'lighthouse-reports')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  // Save HTML report
  const htmlReport = runnerResult.report[0]
  const htmlPath = path.join(reportsDir, 'report.html')
  fs.writeFileSync(htmlPath, htmlReport)

  // Save JSON report
  const jsonReport = runnerResult.report[1]
  const jsonPath = path.join(reportsDir, 'report.json')
  fs.writeFileSync(jsonPath, jsonReport)

  // Extract scores
  const { categories } = runnerResult.lhr
  const scores = {
    performance: Math.round(categories.performance.score * 100),
    accessibility: Math.round(categories.accessibility.score * 100),
    bestPractices: Math.round(categories['best-practices'].score * 100),
    seo: Math.round(categories.seo.score * 100),
  }

  console.log('\n🚦 Lighthouse Results:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`⚡ Performance:      ${scores.performance}/100`)
  console.log(`♿ Accessibility:    ${scores.accessibility}/100`)
  console.log(`✅ Best Practices:   ${scores.bestPractices}/100`)
  console.log(`🔍 SEO:              ${scores.seo}/100`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`\n📊 Reports saved to: ${reportsDir}`)
  console.log(`   - HTML: ${htmlPath}`)
  console.log(`   - JSON: ${jsonPath}`)

  // Check if all scores are 100
  const allPerfect = Object.values(scores).every(score => score === 100)
  if (allPerfect) {
    console.log('\n🎉 Perfect score! All metrics are at 100%!\n')
  } else {
    console.log('\n⚠️  Some metrics need improvement.\n')
  }

  return scores
}

// Get URL from command line argument or use default
const url = process.argv[2] || 'http://localhost:3000'

console.log(`\n🔍 Running Lighthouse audit on: ${url}\n`)

runLighthouse(url)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error running Lighthouse:', err)
    process.exit(1)
  })
