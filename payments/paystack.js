const crypto=require("node:crypto");
class PaystackProvider{
 constructor({secretKey,baseUrl="https://api.paystack.co",fetchImpl=globalThis.fetch}={}){this.secretKey=secretKey||"";this.baseUrl=baseUrl;this.fetch=fetchImpl;this.name="paystack"}
 get enabled(){return this.secretKey.startsWith("sk_test_")||this.secretKey.startsWith("sk_live_")}
 async request(method,pathname,payload){if(!this.enabled)throw Error("Paystack is not configured");const response=await this.fetch(`${this.baseUrl}${pathname}`,{method,headers:{Authorization:`Bearer ${this.secretKey}`,"Content-Type":"application/json"},...(payload?{body:JSON.stringify(payload)}:{})});const data=await response.json();if(!response.ok||data.status===false)throw Error(data.message||`Paystack request failed (${response.status})`);return data.data}
 initializePayment({email,amount,currency,reference,callbackUrl,metadata,subaccount,split,bearer}){return this.request("POST","/transaction/initialize",{email,amount:String(this.toSubunit(amount)),currency,reference,...(callbackUrl?{callback_url:callbackUrl}:{}),channels:this.channels(currency),metadata:JSON.stringify(metadata||{}),...(subaccount?{subaccount}:{}),...(split?{split:{...split,subaccounts:split.subaccounts.map(item=>({...item,share:this.toSubunit(item.share)}))}}:{}),...(bearer?{bearer}: {})})}
 verifyPayment(reference){return this.request("GET",`/transaction/verify/${encodeURIComponent(reference)}`)}
 async createTransferRecipient({name,currency,accountNumber,bankCode,type}){const subaccount=await this.createSubaccount({businessName:name,currency,accountNumber,bankCode,description:`Soko merchant settlement for ${name}`});return{recipient_code:subaccount.subaccount_code,subaccount_code:subaccount.subaccount_code}}
 createSubaccount({businessName,currency,accountNumber,bankCode,description,primaryContactEmail,primaryContactName,primaryContactPhone}){return this.request("POST","/subaccount",{business_name:businessName,settlement_bank:bankCode,account_number:accountNumber,percentage_charge:0,currency,description,primary_contact_email:primaryContactEmail,primary_contact_name:primaryContactName,primary_contact_phone:primaryContactPhone})}
 initiateTransfer({amount,currency,recipientCode,reference,reason}){if(String(recipientCode).startsWith("ACCT_"))return Promise.resolve({status:"split_settled",reference});return this.request("POST","/transfer",{source:"balance",amount:this.toSubunit(amount),currency,recipient:recipientCode,reference,reason})}
 verifyTransfer(reference){return this.request("GET",`/transfer/verify/${encodeURIComponent(reference)}`)}
 createRefund({transactionReference,amount,currency,note}){return this.request("POST","/refund",{transaction:transactionReference,amount:this.toSubunit(amount),currency,merchant_note:note})}
 checkBalance(){return this.request("GET","/balance")}
 verifyWebhook(rawBody,signature){if(!this.enabled||!signature)return false;const expected=crypto.createHmac("sha512",this.secretKey).update(rawBody).digest("hex");const a=Buffer.from(expected),b=Buffer.from(String(signature));return a.length===b.length&&crypto.timingSafeEqual(a,b)}
 toSubunit(amount){if(!Number.isInteger(Number(amount))||Number(amount)<0)throw Error("Amount must be a non-negative whole local-currency unit");return Number(amount)*100}
 fromSubunit(amount){return Number(amount)/100}
 channels(currency){return currency==="KES"?["mobile_money","bank_transfer","card"]:currency==="GHS"?["mobile_money","bank_transfer","card"]:["bank_transfer","bank","ussd","card"]}
}
module.exports={PaystackProvider};
