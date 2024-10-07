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
      const { template, email } = createEmailDto

      const htmlTemplate = this.findTemplates(template)
      const resend = new Resend(config.RESEND_API_KEY)

      const res = await resend.emails.send({
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
}
