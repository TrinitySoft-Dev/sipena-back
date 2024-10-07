import { readFileSync } from 'fs'
import { join } from 'path'

export const renderTemplate = async (template: string, data: any) => {
  const path = join(__dirname, '..', 'email_templates', template)
  console.log(path)
}
