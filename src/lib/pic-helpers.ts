export const fileToDataUrl = async(file: File):Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export const compressPic = async (dataUrl: string, maxW: 512, quality = 0.85): Promise<string> => {
    const img = new Image()
    img.src = dataUrl
    await img.decode

    const scale = Math.min(1, maxW / img.width)
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(img, 0, 0, w, h)

    const out = canvas.toDataURL('image/jpeg', quality)
    return out
}