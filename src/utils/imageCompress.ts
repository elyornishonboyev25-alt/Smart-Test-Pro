// Client-side image compression for avatars. Reads a picked file, centre-crops it
// to a square and downscales it to a small data URL so it can be stored directly in
// the database (no upload infrastructure needed) and shown to other learners.

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read the image file.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not decode the image.'))
    img.src = src
  })
}

export type CompressOptions = {
  /** Output square side in pixels. */
  size?: number
  /** Encoder quality, 0–1. */
  quality?: number
}

/**
 * Compresses an image File into a square WEBP (falling back to JPEG) data URL.
 * Returns a string suitable for `User.avatarUrl`.
 */
export async function compressImageToDataUrl(file: File, options: CompressOptions = {}): Promise<string> {
  const { size = 256, quality = 0.82 } = options

  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }

  const sourceDataUrl = await readFileAsDataUrl(file)
  const img = await loadImage(sourceDataUrl)

  const side = Math.min(img.width, img.height)
  const sx = (img.width - side) / 2
  const sy = (img.height - side) / 2

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return sourceDataUrl

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)

  const webp = canvas.toDataURL('image/webp', quality)
  if (webp.startsWith('data:image/webp')) return webp
  return canvas.toDataURL('image/jpeg', quality)
}
