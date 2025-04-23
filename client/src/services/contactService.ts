import api from './api'

interface ContactForm {
  name: string
  email: string
  subject?: string
  message: string
}

export const contactService = {
  sendMessage: async (formData: ContactForm): Promise<{ msg: string }> => {
    const response = await api.post('/contact', formData)
    return response.data
  }
}
