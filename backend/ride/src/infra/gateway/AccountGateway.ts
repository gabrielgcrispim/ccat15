export default interface AccountGetway{
    getById(accountId : string): Promise<any>
    signUp(input: any): Promise<any>
}