// file: ~/server/api/auth/[...].ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'


async function getCustomer(email:string) {
  return await $fetch('/api/auth/customer', {
    method: 'POST',
    body: {
      email: email,
    },
  });
}

export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point\
    // ^ from sidebase docs
    CredentialsProvider.default({
      name: 'Credentials',
      async authorize(credentials: any) {
        const customer = await getCustomer(credentials.email);
        let user = null;
        //@ts-expect-error
        if (credentials.email === customer.email && credentials.password == "password") {
          user = {
            //@ts-expect-error
            email:customer.email,
            //@ts-expect-error
            id: customer.id,
            //@ts-expect-error
            firstName: customer.firstName,
            //@ts-expect-error
            lastName: customer.lastName,
            //@ts-expect-error
            netWorth:customer.netWorth,
          }
          return user
        }else {
         console.log("Invalid username or password"); 
        }
      }
    })
  ],
  pages:{
        signIn: '/login'
    },
    callbacks:{
      jwt: async ({token,user})=> {
        if(user){
          token.id = user.id;
          //@ts-expect-error
          token.fistName = user.firstName
          //@ts-expect-error
          token.lastName = user.lastName;
          //@ts-expect-error
          token.netWorth = user.netWorth;
        }
        return Promise.resolve(token)
      },
      session: async({session,token}) => {
          try {
            //@ts-expect-error
            const customerData = await getCustomer(token.email);
            //@ts-expect-error 
            session.user.id = customerData.id;
            //@ts-expect-error
            session.user.firstName = customerData.firstName;
            //@ts-expect-error
            session.user.lastName = customerData.lastName;
            //@ts-expect-error
            session.user.netWorth = customerData.netWorth;
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
          return Promise.resolve(session);
        }
        
    },
    
});
