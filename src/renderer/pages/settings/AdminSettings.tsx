/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import { type IWebUIManagedUser, webui } from '@/common/ipcBridge';
import { Button, Input, Message, Modal, Table, Tag } from '@arco-design/web-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsPageWrapper from './components/SettingsPageWrapper';

type CreatedCredentials = {
  user: IWebUIManagedUser;
  password: string;
};

const cardClass = 'rounded-12px border border-solid border-[var(--color-border-2)] bg-[var(--color-bg-2)] p-16px';

const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<IWebUIManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);

  const loadUsers = useCallback(
    async (silent = false) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await webui.listUsers.invoke();
        if (!result.success || !result.data) {
          throw new Error(result.msg || t('settings.adminUsersLoadFailed'));
        }
        setUsers(result.data.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('settings.adminUsersLoadFailed'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [t]
  );

  useEffect(() => {
    void loadUsers(false);
  }, [loadUsers]);

  const formatDate = useCallback(
    (timestamp?: number | null) => {
      if (!timestamp) return t('settings.adminNever');
      return new Date(timestamp).toLocaleString();
    },
    [t]
  );

  const mapPermissionLabel = useCallback(
    (permission: string): string => {
      if (permission === 'all') return t('settings.adminPermissionAll');
      return t('settings.adminPermissionStandard');
    },
    [t]
  );

  const handleCreateUser = useCallback(async () => {
    const username = newUsername.trim();
    const password = newPassword.trim();

    if (!username) {
      Message.warning(t('settings.adminUserNameRequired'));
      return;
    }

    setCreating(true);
    try {
      const result = await webui.createUser.invoke({
        username,
        password: password || undefined,
      });
      if (!result.success || !result.data) {
        throw new Error(result.msg || t('settings.adminCreateUserFailed'));
      }

      setCreatedCredentials(result.data);
      setNewUsername('');
      setNewPassword('');
      setCreateModalVisible(false);
      Message.success(t('settings.adminCreateUserSuccess', { username: result.data.user.username }));
      await loadUsers(true);
    } catch (err) {
      Message.error(err instanceof Error ? err.message : t('settings.adminCreateUserFailed'));
    } finally {
      setCreating(false);
    }
  }, [loadUsers, newPassword, newUsername, t]);

  const handleCopyCreatedPassword = useCallback(async () => {
    if (!createdCredentials?.password) return;

    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(createdCredentials.password);
      Message.success(t('common.copySuccess'));
    } catch {
      Message.error(t('common.copyFailed'));
    }
  }, [createdCredentials?.password, t]);

  const usersCountLabel = useMemo(() => `${users.length}`, [users.length]);

  const columns = useMemo(
    () => [
      {
        title: t('settings.adminUsernameLabel'),
        dataIndex: 'username',
        width: 220,
        render: (value: string) => <span className='font-600 text-[var(--color-text-1)]'>{value}</span>,
      },
      {
        title: t('settings.adminRoleColumn'),
        dataIndex: 'role',
        width: 180,
        render: (_, record) => {
          const roleLabel = record.role === 'admin' ? t('settings.adminRoleAdmin') : t('settings.adminRoleUser');
          return <Tag color={record.role === 'admin' ? 'arcoblue' : 'gray'}>{roleLabel}</Tag>;
        },
      },
      {
        title: t('settings.adminPermissionsLabel'),
        dataIndex: 'permissions',
        render: (_, record) => {
          const permissionsLabel = record.permissions.map((permission) => mapPermissionLabel(permission)).join(', ');
          return <span className='text-12px text-[var(--color-text-2)]'>{permissionsLabel}</span>;
        },
      },
      {
        title: t('settings.adminCreatedAtLabel'),
        dataIndex: 'createdAt',
        width: 220,
        render: (_, record) => <span className='text-12px text-[var(--color-text-3)]'>{formatDate(record.createdAt)}</span>,
      },
      {
        title: t('settings.adminLastLoginLabel'),
        dataIndex: 'lastLogin',
        width: 220,
        render: (_, record) => <span className='text-12px text-[var(--color-text-3)]'>{formatDate(record.lastLogin)}</span>,
      },
    ],
    [formatDate, mapPermissionLabel, t]
  );

  return (
    <SettingsPageWrapper contentClassName='max-w-980px'>
      <div className='flex flex-col gap-16px'>
        <div className='flex flex-wrap items-center justify-between gap-12px'>
          <div>
            <h2 className='m-0 text-22px font-600 text-[var(--color-text-1)]'>{t('settings.adminUsersTitle')}</h2>
            <div className='mt-4px text-13px text-[var(--color-text-3)]'>{t('settings.adminUsersSubtitle')}</div>
          </div>
          <div className='flex items-center gap-8px'>
            <Button size='small' loading={refreshing} onClick={() => void loadUsers(true)}>
              {t('common.refresh')}
            </Button>
            <Button type='primary' size='small' onClick={() => setCreateModalVisible(true)}>
              {t('settings.adminOpenCreateUserModal')}
            </Button>
          </div>
        </div>

        {createdCredentials ? (
          <div className={cardClass}>
            <div className='flex flex-wrap items-center justify-between gap-8px'>
              <div className='text-14px font-600 text-[var(--color-text-1)]'>{t('settings.adminCreatedCredentialsTitle')}</div>
              <Button size='mini' onClick={() => void handleCopyCreatedPassword()}>
                {t('common.copy')}
              </Button>
            </div>
            <div className='mt-8px text-13px text-[var(--color-text-2)]'>
              {t('settings.adminUsernameLabel')}: <span className='font-600 text-[var(--color-text-1)]'>{createdCredentials.user.username}</span>
            </div>
            <div className='mt-6px text-13px text-[var(--color-text-2)]'>
              {t('settings.adminPasswordLabel')}: <span className='font-600 text-[var(--color-text-1)] break-all'>{createdCredentials.password}</span>
            </div>
            <div className='mt-8px text-12px text-[var(--color-text-3)]'>{t('settings.adminCreatedCredentialsHint')}</div>
          </div>
        ) : null}

        <div className={cardClass}>
          <div className='mb-10px flex items-center justify-between gap-8px'>
            <div className='text-14px font-600 text-[var(--color-text-1)]'>{t('settings.adminUsersListTitle')}</div>
            <div className='text-12px text-[var(--color-text-3)]'>
              {t('settings.adminUsersCount')}: {usersCountLabel}
            </div>
          </div>
          {error ? <div className='mb-10px text-13px text-[rgb(var(--danger-6))]'>{error}</div> : null}
          <Table<IWebUIManagedUser> rowKey='id' loading={loading} columns={columns} data={users} pagination={{ pageSize: 8, sizeCanChange: false }} border={false} stripe noDataElement={<div className='py-16px text-13px text-[var(--color-text-3)]'>{t('settings.adminUsersEmpty')}</div>} />
        </div>
      </div>
      <Modal visible={createModalVisible} title={t('settings.adminCreateUserModalTitle')} onOk={() => void handleCreateUser()} confirmLoading={creating} onCancel={() => setCreateModalVisible(false)} okText={t('settings.adminCreateUserAction')} cancelText={t('common.cancel')}>
        <div className='flex flex-col gap-12px'>
          <div>
            <div className='mb-6px text-12px text-[var(--color-text-3)]'>{t('settings.adminUsernameLabel')}</div>
            <Input value={newUsername} onChange={setNewUsername} placeholder={t('settings.adminUsernamePlaceholder')} maxLength={32} />
          </div>
          <div>
            <div className='mb-6px text-12px text-[var(--color-text-3)]'>{t('settings.adminPasswordLabel')}</div>
            <Input.Password value={newPassword} onChange={setNewPassword} placeholder={t('settings.adminPasswordOptionalPlaceholder')} visibilityToggle maxLength={128} />
          </div>
          <div className='text-12px text-[var(--color-text-3)]'>{t('settings.adminCreateUserHint')}</div>
        </div>
      </Modal>
    </SettingsPageWrapper>
  );
};

export default AdminSettings;
