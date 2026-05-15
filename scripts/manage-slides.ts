import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { shell } from '@brillout/shell'

const MUTATING_COMMANDS = new Set(['add', 'insert', 'remove', 'move'])

async function hasRepoChanges(): Promise<boolean> {
  const res = await shell('git status --porcelain')
  return res.stdout.trim().length > 0
}

async function commitChanges(message: string): Promise<void> {
  await shell('git add -A')
  // Single-quote the message and escape any embedded single quotes so the
  // shell parses it as one argument.
  const escaped = message.replace(/'/g, "'\\''")
  await shell(`git commit -m '${escaped}'`)
  console.log(`📝 Committed: ${message}`)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pagesDir = path.join(__dirname, '..', 'pages')

function getExistingSlides(): number[] {
  const entries = fs.readdirSync(pagesDir, { withFileTypes: true })
  const slideNumbers = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => parseInt(entry.name, 10))
    .filter((num) => !isNaN(num))
    .sort((a, b) => a - b)

  return slideNumbers
}

function getMaxSlideNumber(): number {
  const slides = getExistingSlides()
  return slides.length > 0 ? Math.max(...slides) : 0
}

function renameSlide(oldNumber: number, newNumber: number): void {
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

function createSlide(slideNumber: number): void {
  const slidePath = path.join(pagesDir, slideNumber.toString())

  if (fs.existsSync(slidePath)) {
    throw new Error(`Slide ${slideNumber} already exists`)
  }

  fs.mkdirSync(slidePath, { recursive: true })

  const mdxContent = `# New Slide

TODO: Add content
`

  const mdxPath = path.join(slidePath, '+Page.mdx')
  fs.writeFileSync(mdxPath, mdxContent)

  console.log(`Created slide ${slideNumber}`)
}

function insertSlide(position: number): void {
  const existingSlides = getExistingSlides()
  const maxSlide = getMaxSlideNumber()

  if (position < 1) {
    throw new Error('Slide position must be >= 1')
  }

  if (position > maxSlide + 1) {
    throw new Error(`Cannot insert slide at position ${position}. Max position is ${maxSlide + 1}`)
  }

  if (position > maxSlide) {
    createSlide(position)
    return
  }

  const slidesToShift = existingSlides.filter((num) => num >= position)

  if (slidesToShift.length === 0) {
    createSlide(position)
    return
  }

  console.log(`Inserting slide at position ${position}`)
  console.log(`Slides to shift: ${slidesToShift.join(', ')}`)

  for (let i = slidesToShift.length - 1; i >= 0; i--) {
    const oldNumber = slidesToShift[i]!
    const newNumber = oldNumber + 1
    renameSlide(oldNumber, newNumber)
  }

  createSlide(position)

  console.log(`\n✅ Successfully inserted slide ${position}`)
  console.log(`📊 Total slides: ${getMaxSlideNumber()}`)
}

function addSlide(): void {
  const nextPosition = getMaxSlideNumber() + 1
  createSlide(nextPosition)
  console.log(`\n✅ Successfully added slide ${nextPosition}`)
  console.log(`📊 Total slides: ${getMaxSlideNumber()}`)
}

function removeSlide(slideNumber: number): void {
  const slidePath = path.join(pagesDir, slideNumber.toString())

  if (!fs.existsSync(slidePath)) {
    throw new Error(`Slide ${slideNumber} does not exist`)
  }

  fs.rmSync(slidePath, { recursive: true, force: true })
  console.log(`Removed slide ${slideNumber}`)

  const existingSlides = getExistingSlides().filter((num) => num > slideNumber)

  if (existingSlides.length > 0) {
    console.log(`Shifting slides: ${existingSlides.join(', ')}`)

    for (const oldNumber of existingSlides) {
      const newNumber = oldNumber - 1
      renameSlide(oldNumber, newNumber)
    }
  }

  console.log(`\n✅ Successfully removed slide ${slideNumber}`)
  console.log(`📊 Total slides: ${getMaxSlideNumber()}`)
}

function moveSlide(fromPosition: number, toPosition: number): void {
  const fromPath = path.join(pagesDir, fromPosition.toString())

  if (!fs.existsSync(fromPath)) {
    throw new Error(`Slide ${fromPosition} does not exist`)
  }

  const maxSlide = getMaxSlideNumber()

  if (toPosition < 1 || toPosition > maxSlide) {
    throw new Error(`Target position must be between 1 and ${maxSlide}`)
  }

  if (fromPosition === toPosition) {
    console.log(`Slide ${fromPosition} is already at position ${toPosition}`)
    return
  }

  const tempPath = path.join(pagesDir, '_move_tmp')
  if (fs.existsSync(tempPath)) {
    throw new Error(`Temporary path "_move_tmp" already exists. Aborting.`)
  }
  fs.renameSync(fromPath, tempPath)

  if (fromPosition < toPosition) {
    for (let i = fromPosition + 1; i <= toPosition; i++) {
      renameSlide(i, i - 1)
    }
  } else {
    for (let i = fromPosition - 1; i >= toPosition; i--) {
      renameSlide(i, i + 1)
    }
  }

  fs.renameSync(tempPath, path.join(pagesDir, toPosition.toString()))
  console.log(`Moved slide ${fromPosition} → ${toPosition}`)

  console.log(`\n✅ Successfully moved slide from ${fromPosition} to ${toPosition}`)
  console.log(`📊 Total slides: ${getMaxSlideNumber()}`)
}

function listSlides(): void {
  const slides = getExistingSlides()
  console.log(`📋 Existing slides: ${slides.join(', ')}`)
  console.log(`📊 Total slides: ${slides.length}`)

  const gaps: number[] = []
  for (let i = 1; i <= Math.max(...slides); i++) {
    if (!slides.includes(i)) {
      gaps.push(i)
    }
  }

  if (gaps.length > 0) {
    console.log(`⚠️  Gaps in numbering: ${gaps.join(', ')}`)
  }
}

function showUsage(): void {
  console.log(`
🎯 Slide Management Script

Usage:
  pnpm node-ts scripts/manage-slides.ts <command> [options]

Commands:
  list                 List all existing slides
  add                  Add a new slide at the end
  insert <position>    Insert a slide at position, shifting subsequent slides
  remove <position>    Remove a slide and renumber subsequent slides
  move <from> <to>     Move a slide to a new position, shifting others

Examples:
  pnpm slides:list
  pnpm slides:add
  pnpm slides:insert 5
  pnpm slides:remove 3
  pnpm slides:move 7 2

Notes:
  - Position numbers start from 1
  - All subsequent slides are automatically renumbered when inserting
`)
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    showUsage()
    return
  }

  const command = args[0]!

  if (MUTATING_COMMANDS.has(command) && (await hasRepoChanges())) {
    console.error('❌ Commit all changes before running this command.')
    process.exit(1)
  }

  let commitMessage: string | null = null
  try {
    switch (command) {
      case 'list':
        listSlides()
        break

      case 'add': {
        const nextPosition = getMaxSlideNumber() + 1
        addSlide()
        commitMessage = `Add slide ${nextPosition}`
        break
      }

      case 'insert': {
        const position = parseInt(args[1]!, 10)
        if (isNaN(position)) {
          throw new Error('Position must be a number')
        }
        insertSlide(position)
        commitMessage = `Insert slide ${position}`
        break
      }

      case 'remove': {
        const removePosition = parseInt(args[1]!, 10)
        if (isNaN(removePosition)) {
          throw new Error('Position must be a number')
        }
        removeSlide(removePosition)
        commitMessage = `Remove slide ${removePosition}`
        break
      }

      case 'move': {
        const fromPosition = parseInt(args[1]!, 10)
        const toPosition = parseInt(args[2]!, 10)
        if (isNaN(fromPosition) || isNaN(toPosition)) {
          throw new Error('Both <from> and <to> positions must be numbers')
        }
        moveSlide(fromPosition, toPosition)
        commitMessage = `Move slide ${fromPosition} → ${toPosition}`
        break
      }

      default:
        console.error(`❌ Unknown command: ${command}`)
        showUsage()
        process.exit(1)
    }
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`)
    process.exit(1)
  }

  if (commitMessage) await commitChanges(commitMessage)
}

main().catch((error: unknown) => {
  console.error(`❌ Error: ${(error as Error).message}`)
  process.exit(1)
})
