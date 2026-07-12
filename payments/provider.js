const {PaystackProvider}=require("./paystack");
function createPaymentProvider(env=process.env,options={}){const requested=(env.PAYMENTS_PROVIDER||"development").toLowerCase();if(requested==="paystack"){const provider=new PaystackProvider({secretKey:env.PAYSTACK_SECRET_KEY,fetchImpl:options.fetchImpl});if(!provider.enabled)throw Error("PAYMENTS_PROVIDER=paystack requires a Paystack secret key");return provider}return{name:"development",enabled:true}}
module.exports={createPaymentProvider};
