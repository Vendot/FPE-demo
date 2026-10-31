import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DemoLoginPage } from '@/features/auth/DemoLoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ItemsPage } from '@/features/inventory/ItemsPage';
import { ItemDetailPage } from '@/features/inventory/ItemDetailPage';
import { StockBySitePage } from '@/features/inventory/StockBySitePage';
import { GoodsReceivingPage } from '@/features/receiving/GoodsReceivingPage';
import { GoodsIssuingPage } from '@/features/issuing/GoodsIssuingPage';
import { TransferListPage } from '@/features/transfers/TransferListPage';
import { CreateTransferPage } from '@/features/transfers/CreateTransferPage';
import { TransferDetailPage } from '@/features/transfers/TransferDetailPage';
import { ApprovalInboxPage } from '@/features/approvals/ApprovalInboxPage';
import { StockOpnamePage } from '@/features/stock-opname/StockOpnamePage';
import { ReportsStockPage } from '@/features/reports/ReportsStockPage';
import { TransactionHistoryPage } from '@/features/reports/TransactionHistoryPage';
import { SitesPage } from '@/features/administration/SitesPage';
import { UsersPage } from '@/features/administration/UsersPage';
import { QrLabelPrintingPage } from '@/features/administration/QrLabelPrintingPage';
import { SyncCenterPage } from '@/features/sync/SyncCenterPage';
import { DemoSettingsPage } from '@/features/system/DemoSettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <DemoLoginPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'inventory',
        children: [
          {
            path: 'items',
            element: <ItemsPage />,
          },
          {
            path: 'items/:id',
            element: <ItemDetailPage />,
          },
          {
            path: 'stock',
            element: <StockBySitePage />,
          },
          {
            path: 'receiving',
            element: <GoodsReceivingPage />,
          },
          {
            path: 'issuing',
            element: <GoodsIssuingPage />,
          },
          {
            path: 'stock-opname',
            element: <StockOpnamePage />,
          },
        ],
      },
      {
        path: 'transfers',
        children: [
          {
            index: true,
            element: <TransferListPage />,
          },
          {
            path: 'new',
            element: <CreateTransferPage />,
          },
          {
            path: ':id',
            element: <TransferDetailPage />,
          },
        ],
      },
      {
        path: 'approvals',
        element: <ApprovalInboxPage />,
      },
      {
        path: 'reports',
        children: [
          {
            path: 'stock',
            element: <ReportsStockPage />,
          },
          {
            path: 'transactions',
            element: <TransactionHistoryPage />,
          },
        ],
      },
      {
        path: 'admin',
        children: [
          {
            path: 'sites',
            element: <SitesPage />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'qr-labels',
            element: <QrLabelPrintingPage />,
          },
        ],
      },
      {
        path: 'system',
        children: [
          {
            path: 'sync',
            element: <SyncCenterPage />,
          },
          {
            path: 'demo-settings',
            element: <DemoSettingsPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
