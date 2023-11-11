import { FastifyRequest } from "fastify"
import { verify } from "jsonwebtoken"

type TokenPayload = {
    id: string,
    iat: number,
    exp: number,
}

export function AuthMiddlewares(req: FastifyRequest) {
    const { authorization } = req.headers

    if(!authorization) {
        throw new Error("mensagem aqui")
    }

    const [, token] = authorization.split(" ")
    
    try {
        const decode = verify(token, 'teste')
        const {id} = decode as TokenPayload
        req.userId = id
    } catch(error) {
        console.log(error)
        throw new Error("mensagem aqui")
    }
}