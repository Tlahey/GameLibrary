import { Injectable, Logger } from '@nestjs/common';
import * as request from 'request';
import { ArgusModel } from 'src/models/argus';
import ArgusConfig from './../config/argus.config';
import { stringify } from 'querystring';

@Injectable()
export class ArgusService {

    private readonly logger = new Logger(ArgusService.name);

    async getArgusInformations(url: string, cookie: string): Promise<ArgusModel> {
        this.logger.debug(`Get argus informations [${url}]`);
        const body = await this.getArgusBody(url, { headers: { Cookie: cookie } });
        const argusPrice = (/<span class="cotation">(.*)<\/span>/gi.exec(body));
        const percentage = (/<span class="percentage">(.*)<\/span>/gi.exec(body));
        if(argusPrice) {
            return new ArgusModel(
                new Date, 
                parseInt(argusPrice[1]),
                percentage[1]
            );
        }
        return null;
    }

    async getGameThumbnail(url: string, cookie: string): Promise<string> {
        this.logger.debug(`Get game Thumbnail [${url}]`);
        const body = await this.getArgusBody(url, { headers: { Cookie: cookie } });
        const image = (/<img class="image" src="(.*)" alt="" \/>/gi.exec(body))

        if (image == undefined) {
            return;
        }

        const thumbnail = await this.getArgusBody(`${ArgusConfig().SITE_BASE_URL}${image[1]}`, { encoding: null, headers: { Cookie: cookie } });
        return 'data:image/jpeg;base64,' + thumbnail.toString('base64');
    }

    getSessionID (): Promise<string> {
        var form = {
            mode: "normal",
            login: ArgusConfig().ARGUS_ACCOUNT,
            password: ArgusConfig().ARGUS_PASSWORD,
            autologin: 1
        };
        
        var formData = stringify(form);
        var contentLength = formData.length;
        
        return new Promise((resolve, reject) => {
            request({
                headers: {
                  'Content-Length': contentLength,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                uri: `${ArgusConfig().ARGUS_WEBSITE}/connexion.html`,
                body: formData,
                method: 'POST'
              }, function (err, res, body) {
                if (err) {
                    return reject(err);
                }
                const cookie = res.headers['set-cookie'];
                this.logger.debug(`Récupération du cookie de session [${cookie.join('; ')}]`, "getSessionID")
                resolve(cookie[0]);
              });
        });
    }

    private getArgusBody(url: string, options: any): Promise<any> {
        return new Promise((resolve, reject) => {
            request(url, options, (error: any, response: any, body: any) => {
                if (!error && response.statusCode == 200) {
                    return resolve(body);
                }
                reject(error);
            });
        });
    }
}
