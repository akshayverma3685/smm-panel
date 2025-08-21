import { prisma } from '../src/prisma';
async function main(){
  const exists = await prisma.plan.count();
  if(exists===0){
    await prisma.plan.createMany({ data:[
      { name:'Starter', description:'For new resellers', pricePaise: 29900, features:['1 brand','Basic analytics'] },
      { name:'Pro', description:'Growing panels', pricePaise: 99900, features:['3 brands','Priority support','Advanced analytics'] },
      { name:'Enterprise', description:'High volume', pricePaise: 249900, features:['Unlimited brands','SLA support','Custom limits'], interval:'month' }
    ]});
  }
}
main().finally(()=>process.exit(0));
