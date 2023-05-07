import * as dotenv from 'dotenv';
import type { LibraryResponse, SendEmailV3_1 } from 'node-mailjet';
import { Client } from 'node-mailjet';

dotenv.config();

interface OptionsMail {
  email: string;
  htmlPart: string;
  subject: string;
  textPart: string;
}

export async function sendMail(options: OptionsMail): Promise<SendEmailV3_1.Response | undefined> {
  if (!process.env['MAILJET_EMAIL'] || !process.env['MAILJET_PUBLIC'] || !process.env['MAILJET_SECRET']) return;
  const mailjet = new Client({ apiKey: process.env['MAILJET_PUBLIC'], apiSecret: process.env['MAILJET_SECRET'] });
  const data: SendEmailV3_1.Body = {
    Messages: [
      {
        From: {
          Email: process.env['MAILJET_EMAIL'],
          Name: 'Nowlid'
        },
        HTMLPart: options.htmlPart,
        Subject: options.subject,
        TextPart: options.textPart,
        To: [
          {
            Email: options.email,
            Name: 'User'
          }
        ]
      }
    ]
  };

  const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet.post('send', { version: 'v3.1' }).request(data);

  return result.body;
}
