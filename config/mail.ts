import { defineConfig, transports } from '@adonisjs/mail'
import env from '#start/env'

const mailConfig = defineConfig({
  default: env.get('MAIL_MAILER', 'mailgun') as 'smtp' | 'mailgun',

  /**
   * A static address for the "from" property. It will be
   * used unless an explicit from address is set on the
   * Email
   */
  from: {
    address: env.get('MAIL_FROM_ADDRESS', 'noreply@example.com'),
    name: env.get('MAIL_FROM_NAME', 'Adonis Web Kit'),
  },

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST', 'localhost'),
      port: env.get('SMTP_PORT'),
      secure: env.get('SMTP_PORT') === '465',
      auth: {
        type: 'login',
        user: env.get('SMTP_USER', ''),
        pass: env.get('SMTP_PASS', ''),
      },
    }),

    mailgun: transports.mailgun({
      key: env.get('MAILGUN_API_KEY', ''),
      domain: env.get('MAILGUN_DOMAIN', ''),
      baseUrl: env.get('MAILGUN_BASE_URL', 'https://api.mailgun.net/v3'),
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
