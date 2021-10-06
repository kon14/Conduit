import { createTransport } from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
import { Template } from "../../interfaces/Template";
import { EmailBuilderClass } from "../../models/EmailBuilderClass";
import { EmailProviderClass } from "../../models/EmailProviderClass";
import { NodemailerBuilder } from "../nodemailer/nodemailerBuilder";

export class SmtpProvider extends EmailProviderClass{
    
    constructor(transportSettings: any){
        super(createTransport(transportSettings));
    }
    
    listTemplates():Promise<Template[]> {
        throw new Error("Method not implemented.");
    }
    
    getTemplateInfo(template_name: string):Promise<Template> {
        throw new Error("Method not implemented.");
    }
    
    createTemplate(): Promise<Template>{
        throw new Error("Method not implemented.");
    }
    
    getBuilder(): EmailBuilderClass<Options> {
        return new NodemailerBuilder();
    }
}