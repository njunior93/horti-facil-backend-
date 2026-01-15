import { Injectable, OnModuleInit } from '@nestjs/common';
import qrcode from 'qrcode-terminal'
import makeWASocket, {useMultiFileAuthState,DisconnectReason} from '@whiskeysockets/baileys';

@Injectable()
export class WhatsAppService {
  private sock: any
  private conectado = false
  private formatarNumero(numero: string): string {
  let limpo = numero.replace(/\D/g, '')

  if (!limpo.startsWith('55')) {
    limpo = '55' + limpo
  }

  return `${limpo}@s.whatsapp.net`
  }

  //  async onModuleInit() {
  //   await this.iniciar()
  // }

  async iniciar() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_whatsapp')

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: false
    })

    this.sock.ev.on('creds.update', saveCreds)

    this.sock.ev.on('connection.update', ({ qr, connection, lastDisconnect }) => {
      if (qr) {
        qrcode.generate(qr, { small: true })
        console.log('Escaneie o QR Code acima')
      }

      if (connection === 'open') {
        console.log('WhatsApp conectado, aguardando estabilização...')
        setTimeout(() => {
          this.conectado = true
           console.log('WhatsApp pronto para envio')
        }, 3000)
      }

      if (connection === 'close') {
        this.conectado = false
        const reason = lastDisconnect?.error?.output?.statusCode

        if (reason !== DisconnectReason.loggedOut) {
            console.log('Reconectando WhatsApp...')
            this.iniciar()
        } else {
            console.log('Sessão encerrada, é necessário escanear novamente')
        }
      }
    })
  }

  async enviarNotificacao(numero: string, mensagem: string) {
    if (!this.sock || !this.conectado) {
      throw new Error('WhatsApp não conectado')
    }

    const numeroFormatado = this.formatarNumero(numero)

    console.log('Enviando Whatsapp para: ', numeroFormatado)

    try{
      const res = await this.sock.sendMessage(numeroFormatado, {
      text: mensagem
    })  

    console.log('Mensagem enviada com sucesso', res?.key?.id)
    } catch(err){
      console.error('Erro ao enviar WhatsApp:', err)
    }

    
  }
}