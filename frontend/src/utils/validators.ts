export const validators = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? null : 'Email invalide'
  },

  phone: (value: string) => {
    const phoneRegex = /^[2-9]\d{7}$/
    return phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Téléphone invalide'
  },

  required: (value: any) => {
    return value !== null && value !== undefined && value !== '' ? null : 'Ce champ est requis'
  },

  minLength: (min: number) => (value: string) => {
    return value.length >= min ? null : `Minimum ${min} caractères`
  },

  maxLength: (max: number) => (value: string) => {
    return value.length <= max ? null : `Maximum ${max} caractères`
  },

  positiveNumber: (value: number) => {
    return value > 0 ? null : 'Doit être supérieur à 0'
  },
}
