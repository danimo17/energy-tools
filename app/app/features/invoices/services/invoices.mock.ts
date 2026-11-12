import { crudMockProvider } from '@app/core/crud/crud-mock.interceptor';
import { INVOICES_API_URL } from '../invoices.constants';

export const INVOICES_MOCK_PROVIDER = crudMockProvider(INVOICES_API_URL);
