import mockData from '../data/mockData.json';

const LATENCY_MS = 800;

export const dataService = {
    getDistrictsList: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const list = mockData.districts.map(d => ({ id: d.id, name: d.name }));
                resolve(list);
            }, LATENCY_MS);
        });
    },

    getDistrictMetrics: async (districtId) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const cityData = mockData.districts.find(d => d.id === districtId);
                if (cityData) {
                    resolve(cityData);
                } else {
                    reject(new Error("District not found in Neural Database"));
                }
            }, LATENCY_MS);
        });
    }
};
