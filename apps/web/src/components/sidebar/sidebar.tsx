'use client';

import * as React from 'react';
import {
  Sidebar as UISidebar,
  SidebarProvider as UISidebarProvider,
  SidebarMenu as UISidebarMenu,
  SidebarMenuItem as UISidebarMenuItem,
  SidebarMenuButton as UISidebarMenuButton,
  SidebarMenuAction as UISidebarMenuAction,
  type SidebarProps as UISidebarProps,
  type SidebarProviderProps as UISidebarProviderProps,
  type SidebarMenuProps as UISidebarMenuProps,
  type SidebarMenuItemProps as UISidebarMenuItemProps,
  type SidebarMenuButtonProps as UISidebarMenuButtonProps,
  type SidebarMenuActionProps as UISidebarMenuActionProps,
} from '@danky/ui/src/components/sidebar';

export const Sidebar = UISidebar;
export const SidebarProvider = UISidebarProvider;
export const SidebarMenu = UISidebarMenu;
export const SidebarMenuItem = UISidebarMenuItem;
export const SidebarMenuButton = UISidebarMenuButton;
export const SidebarMenuAction = UISidebarMenuAction;

export type {
  UISidebarProps as SidebarProps,
  UISidebarProviderProps as SidebarProviderProps,
  UISidebarMenuProps as SidebarMenuProps,
  UISidebarMenuItemProps as SidebarMenuItemProps,
  UISidebarMenuButtonProps as SidebarMenuButtonProps,
  UISidebarMenuActionProps as SidebarMenuActionProps,
};
