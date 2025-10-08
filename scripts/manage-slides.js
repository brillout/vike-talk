import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pagesDir = path.join(__dirname, '..', 'pages')

/**
 * Get all existing slide numbers by scanning the pages directory
 */
function getExistingSlides() {
  const entries = fs.readdirSync(pagesDir, { withFileTypes: true })
  const slideNumbers = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => parseInt(entry.name, 10))
    .filter((num) => !isNaN(num))
    .sort((a, b) => a - b)

  return slideNumbers
}

/**
 * Get the highest slide number
 */
function getMaxSlideNumber() {
  const slides = getExistingSlides()
  return slides.length > 0 ? Math.max(...slides) : 0
}

/**
 * Check if a slide directory exists
 */
function slideExists(slideNumber) {
  const slidePath = path.join(pagesDir, slideNumber.toString())
  return fs.existsSync(slidePath)
}

/**
 * Rename a slide directory
 */
function renameSlide(oldNumber, newNumber) {
  const oldPath = path.join(pagesDir, oldNumber.toString())
  const newPath = path.join(pagesDir, newNumber.toString())

  if (!fs.existsSync(oldPath)) {
    throw new Error(`Slide ${oldNumber} does not exist`)
  }

  if (fs.existsSync(newPath)) {
    throw new Error(`Slide ${newNumber} already exists`)
  }

  fs.renameSync(oldPath, newPath)
  console.log(`Renamed slide ${oldNumber} → ${newNumber}`)
}

/**
 * Create a new slide directory with a basic MDX file
 */
function createSlide(slideNumber, title = 'New Slide', content = 'TO-DO: Add content') {
  const slidePath = path.join(pagesDir, slideNumber.toString())

  if (fs.existsSync(slidePath)) {
    throw new Error(`Slide ${slideNumber} already exists`)
  }

  fs.mkdirSync(slidePath, { recursive: true })

  const mdxContent = `# ${title}

${content}
`

  const mdxPath = path.join(slidePath, '+Page.mdx')
  fs.writeFileSync(mdxPath, mdxContent)

  console.log(`Created slide ${slideNumber}: ${title}`)
}

/**
 * Insert a new slide at the specified position, shifting all subsequent slides
 */
function insertSlide(position, title = 'New Slide', content = 'TO-DO: Add content') {
  const existingSlides = getExistingSlides()
  const maxSlide = getMaxSlideNumber()

  // Validate position
  if (position < 1) {
    throw new Error('Slide position must be >= 1')
  }

  if (position > maxSlide + 1) {
    throw new Error(`Cannot insert slide at position ${position}. Max position is ${maxSlide + 1}`)
  }

  // If inserting at the end, just create the new slide
  if (position > maxSlide) {
    createSlide(position, title, content)
    return
  }

  // Find slides that need to be shifted
  const slidesToShift = existingSlides.filter((num) => num >= position)

  if (slidesToShift.length === 0) {
    // No slides to shift, just create the new slide
    createSlide(position, title, content)
    return
  }

  console.log(`Inserting slide at position ${position}`)
  console.log(`Slides to shift: ${slidesToShift.join(', ')}`)

  // Shift slides in reverse order to avoid conflicts
  for (let i = slidesToShift.length - 1; i >= 0; i--) {
    const oldNumber = slidesToShift[i]
    const newNumber = oldNumber + 1
    renameSlide(oldNumber, newNumber)
  }

  // Create the new slide
  createSlide(position, title, content)

  console.log(`\n✅ Successfully inserted slide ${position}`)
  console.log(`📊 Total slides: ${getMaxSlideNumber()}`)
}

/**
 * Add a new slide at the end
 */
function addSlide(title = 'New Slide', content = 'TO-DO: Add content') {
  const nextPosition = getMaxSlideNumber() + 1
  createSlide(nextPosition, title, content)
  console.log(`\n✅ Successfully added slide ${nextPosition}`)
  console.log(`📊 Total slides: ${getMaxSlideNumber()}`)
}

/**
 * List all existing slides
 */
function listSlides() {
  const slides = getExistingSlides()
  console.log(`📋 Existing slides: ${slides.join(', ')}`)
  console.log(`📊 Total slides: ${slides.length}`)

  // Show any gaps in numbering
  const gaps = []
  for (let i = 1; i <= Math.max(...slides); i++) {
    if (!slides.includes(i)) {
      gaps.push(i)
    }
  }

  if (gaps.length > 0) {
    console.log(`⚠️  Gaps in numbering: ${gaps.join(', ')}`)
  }
}

/**
 * Show usage information
 */
function showUsage() {
  console.log(`
🎯 Slide Management Script

Usage:
  node scripts/manage-slides.js <command> [options]

Commands:
  list                           List all existing slides
  add [title] [content]         Add a new slide at the end
  insert <position> [title] [content]  Insert a slide at position, shifting subsequent slides

Examples:
  node scripts/manage-slides.js list
  node scripts/manage-slides.js add "My New Slide" "This is the content"
  node scripts/manage-slides.js insert 5 "Inserted Slide" "This goes between slide 4 and 5"

Notes:
  - Position numbers start from 1
  - All subsequent slides are automatically renumbered when inserting
  - Title and content are optional (defaults will be used)
  - Use quotes for multi-word titles/content
`)
}

// Main execution
function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    showUsage()
    return
  }

  const command = args[0]

  try {
    switch (command) {
      case 'list':
        listSlides()
        break

      case 'add':
        const addTitle = args[1] || 'New Slide'
        const addContent = args[2] || 'TO-DO: Add content'
        addSlide(addTitle, addContent)
        break

      case 'insert':
        const position = parseInt(args[1], 10)
        if (isNaN(position)) {
          throw new Error('Position must be a number')
        }
        const insertTitle = args[2] || 'New Slide'
        const insertContent = args[3] || 'TO-DO: Add content'
        insertSlide(position, insertTitle, insertContent)
        break

      default:
        console.error(`❌ Unknown command: ${command}`)
        showUsage()
        process.exit(1)
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

main()
