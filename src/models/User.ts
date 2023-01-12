import { builder } from "../builder";
import { prisma } from "../db";

builder.prismaObject("User",{
    fields: t => ({
        id:t.exposeID("id"),
        name:t.exposeString("name"),
        messages:t.relation("messages")
    })
});

builder.queryField("users", (t) => 
    t.prismaField({
        type:["User"],
        resolve: async (query, root, args, ctx, info) => {
            return prisma.user.findMany({...query});
        }
    })
)

builder.mutationField("addUser", (t) => 
    t.prismaField({
        args:{
          name: t.arg({ type: 'String', required: true }),
        },
        type:["User"],
        resolve: async (query, root, args, ctx, info) => {
            await prisma.user.create({
                data: {
                  name: args.name,
                  messages: {
                    create: [
                      {
                        body: `A Note for ${args.name}`,
                      },
                      {
                        body: `Another note for ${args.name}`,
                      },
                    ],
                  },
                },
            });
            return prisma.user.findMany({...query});
        }
    })
)