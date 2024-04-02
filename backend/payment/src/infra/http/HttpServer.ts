import express from "express";

export default interface HttpServer {
    register(method: any, url: string, callback: Function): void;
    listen(port: number): void;
}


export class ExpressAdapter implements HttpServer {
    private app: any;

    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

     register(url: string, method: any, callback: Function): void {
       this.app[method](url, async function (req: any, res: any) {
        try{
            const output = await callback(req, res);
            res.json(output);
        } catch (e : any) {
            return res.status(422).json({
                message: e.message
            })
        }
          
       })
    }

     listen(port: number): void {
        this.app.listen(port);
    }

}