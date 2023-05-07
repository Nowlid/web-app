import type { SendEmailV3_1 } from 'node-mailjet';
interface OptionsMail {
    email: string;
    htmlPart: string;
    subject: string;
    textPart: string;
}
export declare function sendMail(options: OptionsMail): Promise<SendEmailV3_1.Response | undefined>;
export {};
//# sourceMappingURL=email.utils.d.ts.map