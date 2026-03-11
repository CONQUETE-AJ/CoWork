/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import { networkInterfaces } from 'os';
import type { IWebUIManagedUser, IWebUIStatus } from '@/common/ipcBridge';
import { AuthService } from '@/webserver/auth/service/AuthService';
import { UserRepository } from '@/webserver/auth/repository/UserRepository';
import { AUTH_CONFIG, SERVER_CONFIG } from '@/webserver/config/constants';
import type { AuthUser } from '@/webserver/auth/repository/UserRepository';

/**
 * WebUI 服务层 - 封装所有 WebUI 相关的业务逻辑
 * WebUI Service Layer - Encapsulates all WebUI-related business logic
 */
export class WebuiService {
  private static webServerFunctionsLoaded = false;
  private static _getInitialAdminPassword: (() => string | null) | null = null;
  private static _clearInitialAdminPassword: (() => void) | null = null;
  private static readonly SYSTEM_PLACEHOLDER_USERNAME = 'system_default_user';

  /**
   * 加载 webserver 函数（避免循环依赖）
   * Load webserver functions (avoid circular dependency)
   */
  private static async loadWebServerFunctions(): Promise<void> {
    if (this.webServerFunctionsLoaded) return;

    const webServer = await import('@/webserver/index');
    this._getInitialAdminPassword = webServer.getInitialAdminPassword;
    this._clearInitialAdminPassword = webServer.clearInitialAdminPassword;
    this.webServerFunctionsLoaded = true;
  }

  /**
   * 获取初始管理员密码
   * Get initial admin password
   */
  private static getInitialAdminPassword(): string | null {
    return this._getInitialAdminPassword?.() ?? null;
  }

  /**
   * 清除初始管理员密码
   * Clear initial admin password
   */
  private static clearInitialAdminPassword(): void {
    this._clearInitialAdminPassword?.();
  }

  /**
   * 获取局域网 IP 地址
   * Get LAN IP address
   */
  static getLanIP(): string | null {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
      const netInfo = nets[name];
      if (!netInfo) continue;

      for (const net of netInfo) {
        // Node.js 18.4+ returns number (4/6), older versions return string ('IPv4'/'IPv6')
        const isIPv4 = net.family === 'IPv4' || (net.family as unknown) === 4;
        const isNotInternal = !net.internal;
        if (isIPv4 && isNotInternal) {
          return net.address;
        }
      }
    }
    return null;
  }

  /**
   * 统一的异步错误处理包装器
   * Unified async error handling wrapper
   */
  static async handleAsync<T>(handler: () => Promise<{ success: boolean; data?: T; msg?: string }>, context = 'Operation'): Promise<{ success: boolean; data?: T; msg?: string }> {
    try {
      return await handler();
    } catch (error) {
      console.error(`[WebUI Service] ${context} error:`, error);
      return {
        success: false,
        msg: error instanceof Error ? error.message : `${context} failed`,
      };
    }
  }

  /**
   * 获取管理员用户（带自动加载）
   * Get admin user (with auto-loading)
   */
  static async getAdminUser() {
    await this.loadWebServerFunctions();
    const adminUser = UserRepository.findByUsername(AUTH_CONFIG.DEFAULT_USER.USERNAME);
    if (!adminUser) {
      throw new Error('Admin user not found');
    }
    return adminUser;
  }

  /**
   * 获取 WebUI 状态
   * Get WebUI status
   */
  static async getStatus(
    webServerInstance: {
      server: import('http').Server;
      wss: import('ws').WebSocketServer;
      port: number;
      allowRemote: boolean;
    } | null
  ): Promise<IWebUIStatus> {
    await this.loadWebServerFunctions();

    const adminUser = UserRepository.findByUsername(AUTH_CONFIG.DEFAULT_USER.USERNAME);
    const running = webServerInstance !== null;
    const port = webServerInstance?.port ?? SERVER_CONFIG.DEFAULT_PORT;
    const allowRemote = webServerInstance?.allowRemote ?? false;

    const localUrl = `http://localhost:${port}`;
    const lanIP = this.getLanIP();
    const networkUrl = allowRemote && lanIP ? `http://${lanIP}:${port}` : undefined;

    return {
      running,
      port,
      allowRemote,
      localUrl,
      networkUrl,
      lanIP: lanIP ?? undefined,
      adminUsername: adminUser?.username ?? AUTH_CONFIG.DEFAULT_USER.USERNAME,
      initialPassword: this.getInitialAdminPassword() ?? undefined,
    };
  }

  private static mapManagedUser(user: AuthUser): IWebUIManagedUser {
    const isAdmin = user.username === AUTH_CONFIG.DEFAULT_USER.USERNAME;
    return {
      id: user.id,
      username: user.username,
      role: isAdmin ? 'admin' : 'user',
      permissions: isAdmin ? ['all'] : ['standard'],
      createdAt: user.created_at,
      lastLogin: user.last_login ?? null,
    };
  }

  /**
   * List WebUI users for admin dashboard.
   */
  static async listUsers(): Promise<IWebUIManagedUser[]> {
    const users = UserRepository.listUsers().filter((user) => typeof user.password_hash === 'string' && user.password_hash.trim().length > 0);
    return users.map((user) => this.mapManagedUser(user));
  }

  /**
   * Create a new WebUI user and return plaintext password once.
   */
  static async createUser(username: string, password?: string): Promise<{ user: IWebUIManagedUser; password: string }> {
    const normalizedUsername = username.trim();
    const usernameValidation = AuthService.validateUsername(normalizedUsername);
    if (!usernameValidation.isValid) {
      throw new Error(usernameValidation.errors.join('; '));
    }
    if (normalizedUsername === this.SYSTEM_PLACEHOLDER_USERNAME) {
      throw new Error(`Username "${normalizedUsername}" is reserved`);
    }

    const existingUser = UserRepository.findByUsername(normalizedUsername);
    if (existingUser) {
      throw new Error(`Username "${normalizedUsername}" already exists`);
    }

    const plainPassword = password?.trim() ? password.trim() : AuthService.generateRandomPassword();
    const passwordValidation = AuthService.validatePasswordStrength(plainPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('; '));
    }

    const hashedPassword = await AuthService.hashPassword(plainPassword);
    const created = UserRepository.createUser(normalizedUsername, hashedPassword);

    return {
      user: this.mapManagedUser(created),
      password: plainPassword,
    };
  }

  /**
   * 修改密码（不需要当前密码验证）
   * Change password (no current password verification required)
   */
  static async changePassword(newPassword: string): Promise<void> {
    const adminUser = await this.getAdminUser();

    // 验证新密码强度 / Validate new password strength
    const passwordValidation = AuthService.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('; '));
    }

    // 更新密码（密文存储）/ Update password (encrypted storage)
    const newPasswordHash = await AuthService.hashPassword(newPassword);
    UserRepository.updatePassword(adminUser.id, newPasswordHash);

    // 使所有现有 token 失效 / Invalidate all existing tokens
    AuthService.invalidateAllTokens();

    // 清除初始密码（用户已修改密码）/ Clear initial password (user has changed password)
    this.clearInitialAdminPassword();
  }

  /**
   * 重置密码（生成新的随机密码）
   * Reset password (generate new random password)
   */
  static async resetPassword(): Promise<string> {
    const adminUser = await this.getAdminUser();

    // 生成新的随机密码 / Generate new random password
    const newPassword = AuthService.generateRandomPassword();
    const newPasswordHash = await AuthService.hashPassword(newPassword);

    // 更新密码 / Update password
    UserRepository.updatePassword(adminUser.id, newPasswordHash);

    // 使所有现有 token 失效 / Invalidate all existing tokens
    AuthService.invalidateAllTokens();

    // 清除旧的初始密码 / Clear old initial password
    this.clearInitialAdminPassword();

    return newPassword;
  }
}
