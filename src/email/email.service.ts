import { Injectable } from '@nestjs/common'
import { CreateEmailDto } from './dto/create-email.dto'
import { UpdateEmailDto } from './dto/update-email.dto'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Resend } from 'resend'
import { config } from '@/common/config/config'

@Injectable()
export class EmailService {
  async send(createEmailDto: CreateEmailDto) {
    try {
      const { template, email, data } = createEmailDto

      const htmlTemplate = this.parseTemplate(this.findTemplates(template), data)
      const resend = new Resend(config.RESEND_API_KEY)

      await resend.emails.send({
        from: 'registro <admin@trinity-soft.com>',
        to: [email],
        subject: 'Sipena - Confirmación de registro',
        html: htmlTemplate,
      })

      return { message: 'Email sent successfully' }
    } catch (error) {
      console.log(error)
    }
  }

  private findTemplates(template: string) {
    try {
      const path = join(process.cwd(), 'src', 'email_templates', template)
      const file = readFileSync(path, 'utf8')
      return file
    } catch (error) {
      throw error
    }
  }

  private parseTemplate(template: string, data: any) {
    return template.replace(/{{([^{}]*)}}/g, (match, key) => {
      return data[key]
    })
  }
}
