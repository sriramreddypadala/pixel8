import { apiService } from './api.service';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api.config';
import type {
  ModeUpdateRequest,
  ModeUpdateResponse,
  PrintCountSyncRequest,
  PrintCountSyncResponse,
  MachineStatusRequest,
  MachineStatusResponse,
  GetConfigResponse,
} from '@/types/api';

export const machineService = {
  async getConfig() {
    return apiService.get<GetConfigResponse>(
      `${API_ENDPOINTS.MACHINE.GET_CONFIG}/${API_CONFIG.MACHINE_ID}`
    );
  },

  async updateMode(data: ModeUpdateRequest) {
    return apiService.post<ModeUpdateResponse>(
      API_ENDPOINTS.MACHINE.UPDATE_MODE,
      data
    );
  },

  async syncPrintCount(data: PrintCountSyncRequest) {
    return apiService.post<PrintCountSyncResponse>(
      API_ENDPOINTS.MACHINE.SYNC_PRINT_COUNT,
      data
    );
  },

  async updateStatus(data: MachineStatusRequest) {
    return apiService.post<MachineStatusResponse>(
      API_ENDPOINTS.MACHINE.UPDATE_STATUS,
      data
    );
  },

  async getMachines() {
    return apiService.get(API_ENDPOINTS.MACHINE.GET_MACHINES);
  },
};
