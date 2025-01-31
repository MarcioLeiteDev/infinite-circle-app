import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Obtém os papéis exigidos da rota
        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

        if (!requiredRoles) {
            return true; // Se a rota não tiver roles definidas, permite o acesso
        }

        // Obtém o usuário autenticado
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Acesso negado! Você não tem permissão para acessar esta rota.');
        }

        return true;
    }
}
