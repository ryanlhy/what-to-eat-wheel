export type FoodCategory = 'japanese' | 'indian' | 'chinese' | 'vegetarian' | 'korean' | 'thai' | 'hawker' | 'healthy' | 'quick' | 'special' | 'veg' | 'halal'

export interface FoodItem {
  id: string
  name: string
  category: FoodCategory
  description: string
  healthRating: number // 1-5
  culturalInfo?: string
  locations?: string[]
  imageUrl?: string
}

export interface WheelSection {
  category: FoodCategory
  items: FoodItem[]
  color: string
  label: string
} 