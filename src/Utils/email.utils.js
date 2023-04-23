import key from '../../key.json' assert { type: 'json' };
import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
    key.MAILJET.PUBLIC,
    key.MAILJET.SECRET,
);

export default {

   /**
   * Email send
   * @param {Object} options 
   * @param {Object} [options.email] 
   * @param {string} [options.subject] 
   * @param {string} [options.textPart] 
   * @param {string} [options.htmlPart] 
   * @returns {Promise}
   */

    async sendMail(options = {}) {
        if(!options?.subject, !options?.email, !options?.textPart, !options?.htmlPart) return;
        const request = await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                  From: {
                    Email: key.MAILJET.EMAIL,
                    Name: "Nowlid"
                  },
                  To: [
                    {
                      Email: options?.email,
                      Name: "User"
                    }
                  ],
                  Subject: options?.subject,
                  TextPart: options?.textPart,
                  HTMLPart: options?.htmlPart
                }
            ]
        });

        return request;
    }
}