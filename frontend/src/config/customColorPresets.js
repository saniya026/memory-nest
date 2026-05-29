/**
 * Preset color pairs for custom events (primary + secondary).
 */

export const CUSTOM_COLOR_PRESETS = [
  { id: 'rose-gold', label: 'Rose Gold', primary: '#B76E79', secondary: '#F8E8EA' },
  { id: 'ocean-blue', label: 'Ocean Blue', primary: '#0077B6', secondary: '#CAF0F8' },
  { id: 'forest-green', label: 'Forest Green', primary: '#2D6A4F', secondary: '#D8F3DC' },
  { id: 'royal-purple', label: 'Royal Purple', primary: '#7B2D8B', secondary: '#F3E5F5' },
  { id: 'sunset-orange', label: 'Sunset Orange', primary: '#E76F51', secondary: '#FFF3E0' },
  { id: 'midnight-black', label: 'Midnight Black', primary: '#1C1C1E', secondary: '#F5F5F5' },
  { id: 'cherry-blossom', label: 'Cherry Blossom', primary: '#E91E8C', secondary: '#FCE4EC' },
  { id: 'golden-hour', label: 'Golden Hour', primary: '#F4A261', secondary: '#FFF8F0' },
  { id: 'mint-fresh', label: 'Mint Fresh', primary: '#00B4A6', secondary: '#E0F7F6' },
  { id: 'lavender-dream', label: 'Lavender Dream', primary: '#9C89B8', secondary: '#F0E6FF' },
  { id: 'crimson-love', label: 'Crimson Love', primary: '#C1121F', secondary: '#FFE5E5' },
  { id: 'sky-breeze', label: 'Sky Breeze', primary: '#48CAE4', secondary: '#EBF8FF' },
];

export function getPresetById(id) {
  return CUSTOM_COLOR_PRESETS.find((p) => p.id === id) || CUSTOM_COLOR_PRESETS[0];
}
