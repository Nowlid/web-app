import key from '../../key.json'
import { Client, SendEmailV3_1, LibraryResponse} from 'node-mailjet';

const mailjet = new Client({apiKey: key.MAILJET.PUBLIC,apiSecret: key.MAILJET.SECRET});
interface OptionsMail {
  subject: string;
  email: string;
  textPart: string;
  htmlPart: string;
}

export default {

    async sendMail(options: OptionsMail) {
   
        const data: SendEmailV3_1.Body = {
            Messages: [
              {
                From: {
                  Email: key.MAILJET.EMAIL,
                  Name: "Nowlid"
                },
                To: [
                  {
                    Email: options.email,
                    Name: "User"
                  }
                ],
                Subject: options.subject,
                TextPart: options.textPart,
                HTMLPart: options.htmlPart
              }
            ]
          };
        
        const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
            .post('send', { version: 'v3.1' })
            .request(data);
        
        return result.body;
    }
}