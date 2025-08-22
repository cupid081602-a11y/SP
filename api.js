// Gas Station Smart Manager - API Integration

class GasStationAPI {
    constructor() {
        this.baseUrl = '/';
        this.stationId = '1'; // Default station ID
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Generic API call method
    async apiCall(endpoint, options = {}) {
        const url = `${this.baseUrl}tables/${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }

            // For DELETE requests, return success status
            if (finalOptions.method === 'DELETE') {
                return { success: true };
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Cache management
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Gas Station Data
    async getStationInfo(stationId = this.stationId) {
        const cacheKey = `station_${stationId}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.apiCall(`gas_stations/${stationId}`);
            this.setCachedData(cacheKey, response);
            return response;
        } catch (error) {
            // Return mock data if API fails
            return this.getMockStationInfo();
        }
    }

    async updateStationInfo(stationId = this.stationId, data) {
        try {
            const response = await this.apiCall(`gas_stations/${stationId}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            
            // Clear cache
            this.cache.delete(`station_${stationId}`);
            
            return response;
        } catch (error) {
            console.error('Failed to update station info:', error);
            throw error;
        }
    }

    // Price Predictions
    async getPricePredictions(stationId = this.stationId, days = 7) {
        const cacheKey = `predictions_${stationId}_${days}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.apiCall(`price_predictions?station_id=${stationId}&limit=${days}&sort=prediction_date`);
            
            const predictions = {
                gasoline: response.data.map(p => p.gasoline_price),
                diesel: response.data.map(p => p.diesel_price),
                dates: response.data.map(p => new Date(p.prediction_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })),
                confidence: response.data[0]?.confidence_score || 95,
                factors: response.data[0]?.prediction_factors || '국제유가 상승으로 인한 가격 상승 압력'
            };

            this.setCachedData(cacheKey, predictions);
            return predictions;
        } catch (error) {
            return this.getMockPredictions(days);
        }
    }

    // Competitor Analysis
    async getCompetitorPrices(stationId = this.stationId) {
        const cacheKey = `competitors_${stationId}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.apiCall(`competitor_prices?station_id=${stationId}&sort=price_rank`);
            
            const competitors = response.data.map(comp => ({
                name: comp.competitor_name,
                brand: comp.competitor_brand,
                distance: comp.distance_km,
                gasoline: comp.gasoline_price,
                diesel: comp.diesel_price,
                rank: comp.price_rank,
                lastUpdated: new Date(comp.last_updated).toLocaleString('ko-KR')
            }));

            this.setCachedData(cacheKey, competitors);
            return competitors;
        } catch (error) {
            return this.getMockCompetitors();
        }
    }

    // Market Data
    async getMarketData(days = 30) {
        const cacheKey = `market_${days}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.apiCall(`market_data?limit=${days}&sort=data_date`);
            
            const marketData = {
                oilPrices: response.data.map(d => d.brent_oil_price),
                exchangeRates: response.data.map(d => d.exchange_rate),
                dates: response.data.map(d => new Date(d.data_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })),
                currentTrend: response.data[0]?.market_trend || '상승',
                currentOilPrice: response.data[0]?.brent_oil_price || 85.2,
                currentExchangeRate: response.data[0]?.exchange_rate || 1320
            };

            this.setCachedData(cacheKey, marketData);
            return marketData;
        } catch (error) {
            return this.getMockMarketData(days);
        }
    }

    // Sales Data
    async getSalesData(stationId = this.stationId, days = 30) {
        const cacheKey = `sales_${stationId}_${days}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            
            const response = await this.apiCall(`sales_data?station_id=${stationId}&sale_date>=${startDate.toISOString()}&sort=sale_date`);
            
            const salesData = this.processSalesData(response.data);
            this.setCachedData(cacheKey, salesData);
            return salesData;
        } catch (error) {
            return this.getMockSalesData(days);
        }
    }

    processSalesData(rawData) {
        // Group by date for daily profits
        const dailyProfits = {};
        const hourlyPatterns = Array(24).fill(0);
        const fuelTypeData = { gasoline: 0, diesel: 0 };

        rawData.forEach(sale => {
            const date = new Date(sale.sale_date).toLocaleDateString();
            const hour = sale.sale_hour;
            
            // Daily profits
            if (!dailyProfits[date]) {
                dailyProfits[date] = 0;
            }
            dailyProfits[date] += sale.gross_profit;
            
            // Hourly patterns
            hourlyPatterns[hour] += sale.quantity_sold;
            
            // Fuel type distribution
            if (sale.fuel_type === '휘발유') {
                fuelTypeData.gasoline += sale.gross_profit;
            } else if (sale.fuel_type === '경유') {
                fuelTypeData.diesel += sale.gross_profit;
            }
        });

        return {
            dailyProfits: Object.entries(dailyProfits).map(([date, profit]) => ({
                date: date,
                profit: profit
            })),
            hourlyPatterns: hourlyPatterns,
            fuelTypeDistribution: fuelTypeData,
            totalProfit: Object.values(dailyProfits).reduce((sum, profit) => sum + profit, 0),
            averageDailyProfit: Object.values(dailyProfits).reduce((sum, profit) => sum + profit, 0) / Object.keys(dailyProfits).length
        };
    }

    // Real-time price updates
    async updateCurrentPrices(stationId = this.stationId, gasolinePrice, dieselPrice) {
        try {
            const priceData = {
                station_id: stationId,
                prediction_date: new Date().toISOString(),
                gasoline_price: gasolinePrice,
                diesel_price: dieselPrice,
                confidence_score: 100,
                prediction_factors: '사용자 직접 입력',
                created_at: new Date().toISOString()
            };

            const response = await this.apiCall('price_predictions', {
                method: 'POST',
                body: JSON.stringify(priceData)
            });

            // Clear related caches
            this.cache.delete(`predictions_${stationId}_7`);
            
            return response;
        } catch (error) {
            console.error('Failed to update prices:', error);
            throw error;
        }
    }

    // Mock data methods (fallback when API is not available)
    getMockStationInfo() {
        return {
            id: '1',
            station_name: 'KH에너지 가평주유소',
            owner_name: '김철수',
            brand: 'KH에너지',
            address: '경기도 가평군 설악면 미사리로 123',
            operation_type: '직영',
            fuel_types: ['휘발유', '경유'],
            daily_target: 250000,
            margin_target: 12,
            latitude: 37.8267,
            longitude: 127.51
        };
    }

    getMockPredictions(days = 7) {
        const baseGasoline = 1580;
        const baseDiesel = 1460;
        
        const gasoline = Array.from({length: days}, (_, i) => 
            Math.round(baseGasoline + Math.sin(i * 0.5) * 8 + (Math.random() - 0.5) * 10)
        );
        
        const diesel = Array.from({length: days}, (_, i) => 
            Math.round(baseDiesel + Math.sin(i * 0.3) * 6 + (Math.random() - 0.5) * 8)
        );

        const dates = Array.from({length: days}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        });

        return {
            gasoline,
            diesel,
            dates,
            confidence: 95,
            factors: '국제유가 상승으로 인한 가격 상승 압력'
        };
    }

    getMockCompetitors() {
        return [
            { name: 'ABC주유소', brand: 'SK', distance: 2.1, gasoline: 1590, diesel: 1470, rank: 2, lastUpdated: '2시간 전' },
            { name: 'XYZ주유소', brand: 'GS칼텍스', distance: 3.5, gasoline: 1595, diesel: 1465, rank: 3, lastUpdated: '5시간 전' },
            { name: 'DEF주유소', brand: '현대오일뱅크', distance: 4.2, gasoline: 1585, diesel: 1475, rank: 4, lastUpdated: '3시간 전' },
            { name: 'GHI주유소', brand: 'S-OIL', distance: 5.8, gasoline: 1600, diesel: 1480, rank: 5, lastUpdated: '4시간 전' }
        ];
    }

    getMockMarketData(days = 30) {
        const oilPrices = Array.from({length: days}, (_, i) => 
            Math.round((82 + Math.sin(i * 0.2) * 4 + Math.random() * 6) * 10) / 10
        );
        
        const exchangeRates = Array.from({length: days}, (_, i) => 
            Math.round(1300 + Math.sin(i * 0.1) * 20 + Math.random() * 10)
        );

        const dates = Array.from({length: days}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - days + i + 1);
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        });

        return {
            oilPrices,
            exchangeRates,
            dates,
            currentTrend: '상승',
            currentOilPrice: oilPrices[oilPrices.length - 1],
            currentExchangeRate: exchangeRates[exchangeRates.length - 1]
        };
    }

    getMockSalesData(days = 30) {
        const dailyProfits = Array.from({length: days}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - days + i + 1);
            return {
                date: date.toLocaleDateString(),
                profit: Math.round(200000 + Math.random() * 100000)
            };
        });

        const hourlyPatterns = Array.from({length: 24}, (_, i) => {
            // Simulate realistic hourly patterns
            if (i < 6) return Math.round(20 + Math.random() * 10); // Early morning
            if (i < 9) return Math.round(60 + Math.random() * 25); // Morning rush
            if (i < 17) return Math.round(70 + Math.random() * 20); // Day time
            if (i < 20) return Math.round(85 + Math.random() * 15); // Evening
            return Math.round(40 + Math.random() * 20); // Night
        });

        return {
            dailyProfits,
            hourlyPatterns,
            fuelTypeDistribution: { gasoline: 4056000, diesel: 2184000 },
            totalProfit: dailyProfits.reduce((sum, day) => sum + day.profit, 0),
            averageDailyProfit: dailyProfits.reduce((sum, day) => sum + day.profit, 0) / days
        };
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatNumber(number) {
        return new Intl.NumberFormat('ko-KR').format(number);
    }

    formatPercent(decimal) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(decimal / 100);
    }

    // Data refresh methods
    async refreshAllData() {
        this.cache.clear();
        
        try {
            await Promise.all([
                this.getStationInfo(),
                this.getPricePredictions(),
                this.getCompetitorPrices(),
                this.getMarketData(),
                this.getSalesData()
            ]);
            
            console.log('All data refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    }

    // Subscription to real-time updates
    startRealTimeUpdates(callback) {
        // Simulate real-time updates every 30 seconds
        this.updateInterval = setInterval(async () => {
            try {
                // In a real implementation, this would connect to a WebSocket
                const latestMarket = await this.getMarketData(1);
                const latestPredictions = await this.getPricePredictions();
                
                if (callback) {
                    callback({
                        marketData: latestMarket,
                        predictions: latestPredictions,
                        timestamp: new Date()
                    });
                }
            } catch (error) {
                console.error('Real-time update failed:', error);
            }
        }, 30000);
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Initialize global API instance
window.gasStationAPI = new GasStationAPI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GasStationAPI;
}