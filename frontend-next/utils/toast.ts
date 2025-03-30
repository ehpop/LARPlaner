import { addToast } from "@heroui/react";
import { ToastOptions } from "@react-stately/toast";

const DEFAULT_TOAST_TIMEOUT = 3000;

type CustomToastOptions = Omit<ToastOptions, "color" | "title" | "description">;
type ToastColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

/**
 * Shows a generic toast. Base function called by specific types.
 * Generally, prefer using the specific functions like showSuccessToast, showErrorToast etc.
 *
 * @param {string} title - The main title of the toast.
 * @param {string} [description] - Optional longer description text.
 * @param {ToastColor} color - The color theme of the toast.
 * @param {CustomToastOptions} [options] - Additional options like timeout, icon, endContent, etc.
 */
export const showToast = (
  title: string,
  description?: string,
  color: ToastColor = "default",
  options: CustomToastOptions = {},
): void => {
  addToast({
    title,
    description,
    color,
    ...options,
  });
};

/**
 * Shows a success toast.
 *
 * @param {string} title - The main title of the toast.
 * @param {string} [description] - Optional longer description text.
 * @param {CustomToastOptions} [options] - Additional options like timeout, icon, endContent, etc.
 */
export const showSuccessToast = (
  title: string,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  showToast(title, description, "success", options);
};

/**
 * Shows an error/danger toast.
 *
 * @param {string} title - The main title of the toast.
 * @param {string} [description] - Optional longer description text.
 * @param {CustomToastOptions} [options] - Additional options like timeout, icon, endContent, etc.
 */
export const showErrorToast = (
  title: string,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  return showToast(title, description, "danger", options);
};

/**
 * Shows a warning toast.
 *
 * @param {string} title - The main title of the toast.
 * @param {string} [description] - Optional longer description text.
 * @param {CustomToastOptions} [options] - Additional options like timeout, icon, endContent, etc.
 */
export const showWarningToast = (
  title: string,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  return showToast(title, description, "warning", options);
};

/**
 * Shows an informational (primary) toast.
 *
 * @param {string} title - The main title of the toast.
 * @param {string} [description] - Optional longer description text.
 * @param {CustomToastOptions} [options] - Additional options like timeout, icon, endContent, etc.
 */
export const showInfoToast = (
  title: string,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  return showToast(title, description, "default", options);
};

/**
 * Shows a secondary toast.
 *
 * @param {string} title - The main title of the toast.
 * @param {string} [description] - Optional longer description text.
 * @param {CustomToastOptions} [options] - Additional options like timeout, icon, endContent, etc.
 */
export const showSecondaryToast = (
  title: string,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  return showToast(title, description, "secondary", options);
};

/**
 * Show toast with empty promise that resolves after a timeout.
 *
 * @param {string} title - The title to display while the promise is pending.
 * @param {string} [description] - Optional description during pending state.
 * @param {number} timeout - The time in milliseconds to wait before resolving the promise.
 * @param color
 * @param {CustomToastOptions} [options] - Additional options. 'color' defaults to 'default'.
 */
export const showTimeoutToast = (
  title: string,
  timeout: number = DEFAULT_TOAST_TIMEOUT,
  description?: string,
  color: ToastColor = "default",
  options: CustomToastOptions = {},
): void => {
  addToast({
    title,
    description,
    timeout,
    shouldShowTimeoutProgress: true,
    color,
    ...options,
  });
};

/**
 * Show a success toast with a timeout.
 *
 * @param {string} title - The title of the toast.
 * @param {string} description - The description of the toast.
 * @param {number} timeout - The time in milliseconds to wait before resolving the promise.
 * @param {CustomToastOptions} options - Additional options.
 */
export const showSuccessToastWithTimeout = (
  title: string,
  timeout: number = DEFAULT_TOAST_TIMEOUT,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  showTimeoutToast(title, timeout, description, "success", options);
};

/**
 * Show an error toast with a timeout.
 *
 * @param {string} title - The title of the toast.
 * @param {string} description - The description of the toast.
 * @param {number} timeout - The time in milliseconds to wait before resolving the promise.
 * @param {CustomToastOptions} options - Additional options.
 */
export const showErrorToastWithTimeout = (
  title: string,
  timeout: number = DEFAULT_TOAST_TIMEOUT,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  showTimeoutToast(title, timeout, description, "danger", options);
};

/**
 * Show a warning toast with a timeout.
 *
 * @param {string} title - The title of the toast.
 * @param {string} description - The description of the toast.
 * @param {number} timeout - The time in milliseconds to wait before resolving the promise.
 * @param {CustomToastOptions} options - Additional options.
 */
export const showWarningToastWithTimeout = (
  title: string,
  timeout: number = DEFAULT_TOAST_TIMEOUT,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  showTimeoutToast(title, timeout, description, "warning", options);
};

/**
 * Show a secondary toast with a timeout.
 *
 * @param {string} title - The title of the toast.
 * @param {string} description - The description of the toast.
 * @param {number} timeout - The time in milliseconds to wait before resolving the promise.
 * @param {CustomToastOptions} options - Additional options.
 */
export const showSecondaryToastWithTimeout = (
  title: string,
  timeout: number = DEFAULT_TOAST_TIMEOUT,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  showTimeoutToast(title, timeout, description, "secondary", options);
};

/**
 * Show an informational toast with a timeout.
 *
 * @param {string} title - The title of the toast.
 * @param {string} description - The description of the toast.
 * @param {number} timeout - The time in milliseconds to wait before resolving the promise.
 * @param {CustomToastOptions} options - Additional options.
 */
export const showInfoToastWithTimeout = (
  title: string,
  timeout: number = DEFAULT_TOAST_TIMEOUT,
  description?: string,
  options: CustomToastOptions = {},
): void => {
  showTimeoutToast(title, timeout, description, "default", options);
};
