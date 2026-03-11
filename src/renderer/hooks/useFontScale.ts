/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import { ipcBridge } from '@/common';
import { isElectronDesktop } from '@/renderer/utils/platform';
import { useCallback, useEffect, useState } from 'react';

const UI_SCALE_DEFAULT = 1;
const UI_SCALE_MIN = 0.8;
const UI_SCALE_MAX = 1.3;
const UI_SCALE_STEP = 0.05;

export const FONT_SCALE_DEFAULT = UI_SCALE_DEFAULT;
export const FONT_SCALE_MIN = UI_SCALE_MIN;
export const FONT_SCALE_MAX = UI_SCALE_MAX;
export const FONT_SCALE_STEP = UI_SCALE_STEP;
const WEBUI_ZOOM_STORAGE_KEY = 'aionui.webui.zoomFactor';

// 确保缩放值在允许范围内 / Clamp UI scale to allowed range
const clampFontScale = (value: number) => {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return FONT_SCALE_DEFAULT;
  }
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, value));
};

const resetWebZoom = () => {
  if (typeof document === 'undefined') return;
  // Keep WebUI at 100% to avoid popup/dropdown positioning drift.
  document.documentElement.style.zoom = '';
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(WEBUI_ZOOM_STORAGE_KEY);
  }
};

const useFontScale = (): [number, (scale: number) => Promise<void>] => {
  const [fontScale, setFontScaleState] = useState(FONT_SCALE_DEFAULT);
  const isElectron = isElectronDesktop();

  // Font scale is intentionally fixed at 100% to keep popup positioning stable.
  const syncDefaultScale = useCallback(async () => {
    setFontScaleState(FONT_SCALE_DEFAULT);
    if (!isElectron) {
      resetWebZoom();
      return;
    }

    try {
      await ipcBridge.application.setZoomFactor.invoke({ factor: FONT_SCALE_DEFAULT });
    } catch (error) {
      console.error('Failed to reset zoom factor:', error);
    }
  }, [isElectron]);

  useEffect(() => {
    void syncDefaultScale();
  }, [syncDefaultScale]);

  // Keep no-op setter for compatibility with ThemeContext API.
  const setFontScale = useCallback(
    async (_nextScale: number) => {
      setFontScaleState(FONT_SCALE_DEFAULT);
      if (!isElectron) {
        resetWebZoom();
        return;
      }

      try {
        await ipcBridge.application.setZoomFactor.invoke({ factor: FONT_SCALE_DEFAULT });
      } catch (error) {
        console.error('Failed to reset zoom factor:', error);
      }
    },
    [isElectron]
  );

  return [fontScale, setFontScale];
};

export { clampFontScale };
export default useFontScale;
