import axios from 'axios';
import type { BackendAddressSearchResponse } from '../../types/api';

// API 기본 설정 (프록시 사용)
const BASE_URL = '/api';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

// CRUD 함수들
export const apiClient = {
    // GET 요청
    get: async <T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> => {
        try {
            const response = await api.get(url, {params});
            return response.data as T;
        } catch (error) {
            console.error('GET 요청 실패:', error);
            throw error;
        }
    },

    // POST 요청
    post: async <T = unknown>(url: string, data?: Record<string, unknown>): Promise<T> => {
        try {
            const response = await api.post(url, data);
            return response.data as T;
        } catch (error) {
            console.error('POST 요청 실패:', error);
            throw error;
        }
    },

    // PUT 요청
    put: async <T = unknown>(url: string, data?: Record<string, unknown>): Promise<T> => {
        try {
            const response = await api.put(url, data);
            return response.data as T;
        } catch (error) {
            console.error('PUT 요청 실패:', error);
            throw error;
        }
    },

    // DELETE 요청
    delete: async (url: string) => {
        try {
            const response = await api.delete(url);
            return response.data;
        } catch (error) {
            console.error('DELETE 요청 실패:', error);
            throw error;
        }
    },

    // Address search using backend API
    searchAddress: async (query: string): Promise<BackendAddressSearchResponse> => {
        try {
            const response = await api.get<BackendAddressSearchResponse>('/naver-maps/search', {
                params: { query }
            });
            return response.data;
        } catch (error) {
            console.error('주소 검색 실패:', error);
            throw error;
        }
    },

    // Nearby stations search
    findNearbyStations: async (lat: number, lng: number): Promise<BackendAddressSearchResponse> => {
        try {
            const response = await api.get<BackendAddressSearchResponse>('/naver-maps/nearby-stations', {
                params: { lat, lng }
            });
            return response.data;
        } catch (error) {
            console.error('지하철역 검색 실패:', error);
            throw error;
        }
    },

    // Center point calculation
    calculateCenterPoint: async (locations: Array<{lat: number, lng: number}>): Promise<{lat: number, lng: number, count: number}> => {
        try {
            const response = await api.post('/naver-maps/center-point', locations);
            return response.data;
        } catch (error) {
            console.error('중심점 계산 실패:', error);
            throw error;
        }
    },

    // Reverse geocoding
    reverseGeocode: async (lat: number, lng: number): Promise<BackendAddressSearchResponse> => {
        try {
            const response = await api.get<BackendAddressSearchResponse>('/naver-maps/reverse-geocode', {
                params: { lat, lng }
            });
            return response.data;
        } catch (error) {
            console.error('리버스 지오코딩 실패:', error);
            throw error;
        }
    },
};
