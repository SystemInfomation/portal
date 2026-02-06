// Utility function to create a solid color favicon as a data URL
export const createSolidColorFavicon = (color: string): string => {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 32, 32)
  }
  return canvas.toDataURL('image/png')
}

export interface CloakOption {
  id: string
  name?: string
  title: string
  bgColor: string
  cssClass: string
}

export const CLOAK_OPTIONS: CloakOption[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    bgColor: '#000000', // black background
    cssClass: 'cloak-google-drive'
  },
  {
    id: 'canvas',
    name: 'Canvas',
    title: 'Dashboard',
    bgColor: '#1a0000', // dark red background
    cssClass: 'cloak-canvas'
  },
  {
    id: 'classlink',
    name: 'Classlink',
    title: 'ClassLink LaunchPad',
    bgColor: '#000a14', // dark blue background
    cssClass: 'cloak-classlink'
  },
  {
    id: 'linewize',
    name: 'Linewize',
    title: 'Linewize',
    bgColor: '#000a14', // dark blue background
    cssClass: 'cloak-linewize'
  },
  {
    id: 'infinite-campus',
    name: 'Infinite Campus',
    title: 'Campus Portal',
    bgColor: '#001a00', // dark green background
    cssClass: 'cloak-infinite-campus'
  }
]
