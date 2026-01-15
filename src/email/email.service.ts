import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
  this.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}


  async enviarEmail(para: string,assunto: string,mensagem: string,) {
    await this.transporter.sendMail({
      from: `"HortiFacil" <${process.env.EMAIL_USER}>`,
      to: para,
      subject: assunto,
      html: mensagem,
    })
  }
}
