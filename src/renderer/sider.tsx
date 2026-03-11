import { Plus } from '@icon-park/react';
import { IconLeft, IconPoweroff, IconSettings, IconUser } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import React, { Suspense, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { iconColors } from './theme/colors';
import { Dropdown, Menu, Tooltip } from '@arco-design/web-react';
import { usePreviewContext } from './pages/conversation/preview/context/PreviewContext';
import { cleanupSiderTooltips, getSiderTooltipProps } from './utils/siderTooltip';
import { useLayoutContext } from './context/LayoutContext';
import { blurActiveElement } from './utils/focus';
import { useAuth } from './context/AuthContext';

const WorkspaceGroupedHistory = React.lazy(() => import('./pages/conversation/WorkspaceGroupedHistory'));
const SettingsSider = React.lazy(() => import('./pages/settings/SettingsSider'));

interface SiderProps {
  onSessionClick?: () => void;
  collapsed?: boolean;
}

const Sider: React.FC<SiderProps> = ({ onSessionClick, collapsed = false }) => {
  const layout = useLayoutContext();
  const isMobile = layout?.isMobile ?? false;
  const { pathname, search, hash } = useLocation();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { closePreview } = usePreviewContext();
  const { user, logout } = useAuth();
  const isSettings = pathname.startsWith('/settings');
  const profileDisplayName = user?.username || t('common.profile');
  const lastNonSettingsPathRef = useRef('/guid');

  useEffect(() => {
    if (!pathname.startsWith('/settings')) {
      lastNonSettingsPathRef.current = `${pathname}${search}${hash}`;
    }
  }, [hash, pathname, search]);

  const handleBackToChat = () => {
    cleanupSiderTooltips();
    blurActiveElement();
    Promise.resolve(navigate(lastNonSettingsPathRef.current || '/guid')).catch((error) => {
      console.error('Navigation failed:', error);
    });
    if (onSessionClick) {
      onSessionClick();
    }
  };
  const handleProfileMenuClick = (key: string) => {
    cleanupSiderTooltips();
    blurActiveElement();
    if (key === 'settings') {
      Promise.resolve(navigate('/settings/gemini')).catch((error) => {
        console.error('Navigation failed:', error);
      });
      if (onSessionClick) {
        onSessionClick();
      }
      return;
    }
    if (key === 'logout') {
      void logout().finally(() => {
        Promise.resolve(navigate('/login')).catch((error) => {
          console.error('Navigation failed:', error);
        });
      });
      if (onSessionClick) {
        onSessionClick();
      }
    }
  };
  const workspaceHistoryProps = {
    collapsed,
    tooltipEnabled: collapsed && !isMobile,
    onSessionClick,
    batchMode: false,
  };
  const tooltipEnabled = collapsed && !isMobile;
  const siderTooltipProps = getSiderTooltipProps(tooltipEnabled);

  return (
    <div className='size-full flex flex-col'>
      {/* Main content area */}
      <div className='flex-1 min-h-0 overflow-hidden'>
        {isSettings ? (
          <Suspense fallback={<div className='size-full' />}>
            <SettingsSider collapsed={collapsed} tooltipEnabled={tooltipEnabled}></SettingsSider>
          </Suspense>
        ) : (
          <div className='size-full flex flex-col'>
            <div className='mb-8px shrink-0 flex items-center gap-8px'>
              <Tooltip {...siderTooltipProps} content={t('conversation.welcome.newConversation')} position='right'>
                <div
                  className={classNames('h-40px flex-1 flex items-center justify-start gap-10px px-12px hover:bg-hover rd-0.5rem cursor-pointer group', isMobile && 'sider-action-btn-mobile')}
                  onClick={() => {
                    cleanupSiderTooltips();
                    blurActiveElement();
                    closePreview();
                    Promise.resolve(navigate('/guid')).catch((error) => {
                      console.error('Navigation failed:', error);
                    });
                    // 点击new chat后自动隐藏sidebar / Hide sidebar after starting new chat on mobile
                    if (onSessionClick) {
                      onSessionClick();
                    }
                  }}
                >
                  <Plus theme='outline' size='24' fill={iconColors.primary} className='block leading-none shrink-0' style={{ lineHeight: 0 }} />
                  <span className='collapsed-hidden font-bold text-t-primary leading-24px'>{t('conversation.welcome.newConversation')}</span>
                </div>
              </Tooltip>
            </div>
            <Suspense fallback={<div className='flex-1 min-h-0' />}>
              <WorkspaceGroupedHistory {...workspaceHistoryProps}></WorkspaceGroupedHistory>
            </Suspense>
          </div>
        )}
      </div>
      {/* Footer - profile menu */}
      <div className='shrink-0 sider-footer mt-auto pt-8px'>
        <div className='flex flex-col gap-8px'>
          {isSettings && (
            <Tooltip {...siderTooltipProps} content={t('common.back')} position='right'>
              <div onClick={handleBackToChat} className={classNames('flex items-center justify-start gap-10px px-12px py-8px rd-0.5rem cursor-pointer transition-colors hover:bg-hover active:bg-fill-2', isMobile && 'sider-footer-btn-mobile')} aria-label={t('common.back')}>
                <IconLeft style={{ fontSize: 18, color: 'rgb(var(--primary-6))' }} />
                <span className='collapsed-hidden text-t-primary'>{t('common.back')}</span>
              </div>
            </Tooltip>
          )}
          <Dropdown
            trigger='click'
            position='tr'
            droplist={
              <Menu className='min-w-160px' onClickMenuItem={handleProfileMenuClick}>
                <Menu.Item key='settings'>
                  <div className='flex items-center gap-8px'>
                    <IconSettings style={{ fontSize: 14 }} />
                    <span>{t('common.settings')}</span>
                  </div>
                </Menu.Item>
                <Menu.Item key='logout'>
                  <div className='flex items-center gap-8px text-[rgb(var(--danger-6))]'>
                    <IconPoweroff style={{ fontSize: 14 }} />
                    <span>{t('common.logout')}</span>
                  </div>
                </Menu.Item>
              </Menu>
            }
          >
            <div>
              <Tooltip {...siderTooltipProps} content={profileDisplayName} position='right'>
                <div className={classNames('flex items-center justify-start gap-10px px-12px py-8px rd-0.5rem cursor-pointer transition-colors hover:bg-hover hover:shadow-sm active:bg-fill-2', isMobile && 'sider-footer-btn-mobile')}>
                  <IconUser style={{ fontSize: 20, color: iconColors.primary }} />
                  <span className='collapsed-hidden text-t-primary truncate'>{profileDisplayName}</span>
                </div>
              </Tooltip>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Sider;
