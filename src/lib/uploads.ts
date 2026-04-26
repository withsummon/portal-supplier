import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
}

export async function saveLocalUpload(input: {
  file: File
  folder: string
  allowedMimePrefix: 'image/' | 'application/' | '' | Array<'image/' | 'application/' | ''>
}) {
  const { file, folder, allowedMimePrefix } = input
  const allowedPrefixes = Array.isArray(allowedMimePrefix) ? allowedMimePrefix : [allowedMimePrefix]

  const isAllowed = allowedPrefixes.some((prefix) => prefix === '' || file.type.startsWith(prefix))

  if (!isAllowed) {
    throw new Error('Unsupported file type.')
  }

  if (file.size === 0) {
    throw new Error('Empty file upload.')
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })

  const safeName = sanitizeFilename(file.name)
  const filename = `${randomUUID()}-${safeName}`
  const filePath = path.join(uploadDir, filename)
  const buffer = Buffer.from(await file.arrayBuffer())

  await writeFile(filePath, buffer)

  return `/uploads/${folder}/${filename}`
}
