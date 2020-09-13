
export interface Plate {
  name: string
  more_link: string
  id: number
  list: PlateItem[]
}
export interface PlateItem {
  text: string
  link: string
}