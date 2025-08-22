// Gas Station Smart Manager - Main JavaScript
class GasStationManager {
    constructor() {
        this.currentTab = 'dashboard';
        this.currentSubTab = 'market';
        this.api = window.gasStationAPI;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentTime();
        this.loadInitialData(); // CHANGED: 초기 데이터 로딩 실행
        
        setInterval(() => this.updateCurrentTime(), 60000);
    }

    setupEventListeners() {
        // ... (기존 코드와 동일) ...
        // Mobile navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Desktop navigation
        document.querySelectorAll('.desktop-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Analysis sub-tabs
        document.querySelectorAll('.analysis-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const subTab = e.currentTarget.dataset.subtab;
                this.switchAnalysisTab(subTab);
            });
        });

        // Settings sliders
        this.setupSliders();

        // Save settings button
        const saveBtn = document.querySelector('button.bg-primary');
        if (saveBtn && saveBtn.textContent.includes('저장')) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }
    }

    // CHANGED: switchTab을 async 함수로 변경하여 데이터 로딩 대기
    async switchTab(tabName) {
        if (this.currentTab === tabName) return;

        this.currentTab = tabName;

        // Update navigation state
        document.querySelectorAll('.nav-btn, .desktop-nav-link').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll(`[data-tab="${tabName}"]`).forEach(el => {
            el.classList.add('active');
        });

        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeTabContent = document.getElementById(`${tabName}-tab`);
        activeTabContent.classList.add('active');
        
        // 데이터 로딩 및 차트 초기화
        this.showLoadingState();
        try {
            if (tabName === 'dashboard') {
                await this.initializeDashboard();
            } else if (tabName === 'analysis') {
                await this.initializeAnalysisCharts();
            } else if (tabName === 'profit') {
                await this.initializeProfitCharts();
            }
        } catch (error) {
            console.error(`Error loading data for ${tabName}:`, error);
            this.showNotification('데이터 로딩에 실패했습니다.', 'error');
        } finally {
            this.hideLoadingState();
        }

        // Add animation
        activeTabContent.classList.add('fade-in');
        setTimeout(() => activeTabContent.classList.remove('fade-in'), 300);
    }

    async switchAnalysisTab(subTabName) {
        this.currentSubTab = subTabName;

        // Update sub-tab navigation
        document.querySelectorAll('.analysis-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-subtab="${subTabName}"]`).classList.add('active');

        // Show/hide sub-tab content
        document.querySelectorAll('.subtab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${subTabName}-subtab`).classList.add('active');

        await this.initializeAnalysisCharts();
    }

    setupSliders() {
        const dailySlider = document.getElementById('dailyTargetSlider');
        const dailyValue = document.getElementById('dailyTargetValue');
        const marginSlider = document.getElementById('marginTargetSlider');
        const marginValue = document.getElementById('marginTargetValue');

        if (dailySlider && dailyValue) {
            dailySlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                dailyValue.textContent = value.toLocaleString() + '원';
            });
        }

        if (marginSlider && marginValue) {
            marginSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                marginValue.textContent = value + '%';
            });
        }
    }
    
    updateCurrentTime() {
        const now = new Date();
        const timeStr = now.toLocaleDateString('ko-KR', {
            month: 'long', day: 'numeric', weekday: 'long'
        }) + ' ' + now.toLocaleTimeString('ko-KR', {
            hour: '2-digit', minute: '2-digit'
        });
        
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeStr;
        }
    }
    
    // CHANGED: 데이터 로딩 및 UI 업데이트 로직 개편
    async loadInitialData() {
        this.showLoadingState();
        try {
            await this.initializeDashboard();
            this.showNotification('데이터를 성공적으로 불러왔습니다.', 'success');
        } catch(error) {
            this.showNotification('데이터 로딩에 실패했습니다.', 'error');
        } finally {
            this.hideLoadingState();
        }
    }

    // 대시보드 데이터 로드 및 UI 업데이트
    async initializeDashboard() {
        const predictionData = await this.api.getPricePredictions();
        initializePredictionChart('predictionChart', predictionData);
        initializePredictionChart('mobilePredictionChart', predictionData);

        // 추천 가격 카드 업데이트
        const recommendedCard = document.querySelector('.bg-gradient-to-r');
        if(recommendedCard) {
            recommendedCard.querySelector('.text-2xl.font-bold:nth-child(1)').textContent = `휘발유 ${this.formatNumber(predictionData.gasoline[0])}원`;
            recommendedCard.querySelector('.text-2xl.font-bold:nth-child(2)').textContent = `경유 ${this.formatNumber(predictionData.diesel[0])}원`;
            recommendedCard.querySelector('.bg-white.bg-opacity-20').textContent = `신뢰도 ${predictionData.confidence}%`;
            recommendedCard.querySelector('.fa-lightbulb').nextElementSibling.textContent = predictionData.factors;
        }
    }

    // 분석 탭 차트 초기화
    async initializeAnalysisCharts() {
        if (this.currentSubTab === 'market') {
            const marketData = await this.api.getMarketData();
            initializeMarketChart('oilPriceChart', marketData);
            initializeMarketChart('exchangeRateChart', marketData);
        } else if (this.currentSubTab === 'trend') {
            const [salesData, priceData] = await Promise.all([
                this.api.getSalesData(this.api.stationId, 7), // 7일 데이터로 요일별 패턴 생성
                this.api.getPricePredictions(this.api.stationId, 30)
            ]);
            
            // Mock weekly data for now as API doesn't provide it
            salesData.weeklyPatterns = [85, 78, 82, 95, 100, 88, 70]; 
            
            initializePriceTrendChart('priceTrendChart', {
                dates: priceData.dates,
                gasoline: priceData.gasoline,
                diesel: priceData.diesel
            });
            initializePatternChart('hourlyPatternChart', salesData);
            initializePatternChart('weeklyPatternChart', salesData);
        }
    }
    
    // 수익 탭 차트 초기화
    async initializeProfitCharts() {
        const [salesData, stationInfo] = await Promise.all([
            this.api.getSalesData(),
            this.api.getStationInfo()
        ]);
        
        initializeDailyProfitChart('dailyProfitChart', {
            dailyProfits: salesData.dailyProfits,
            dailyTarget: stationInfo.daily_target
        });
        initializeFuelTypeProfitChart('fuelTypeProfitChart', salesData.fuelTypeDistribution);
    }
    
    // ... (기존 showNotification, format 함수 등은 그대로 유지) ...
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showLoadingState() {
        const activeTabContent = document.querySelector('.tab-content.active');
        if (!activeTabContent) return;

        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = '<div class="spinner"></div>';
        activeTabContent.style.position = 'relative';
        activeTabContent.appendChild(loader);
    }

    hideLoadingState() {
        const loader = document.querySelector('.loading-overlay');
        if (loader) {
            loader.remove();
        }
    }
    
    formatNumber(number) {
        return new Intl.NumberFormat('ko-KR').format(number);
    }
}


// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add simple spinner style
    const style = document.createElement('style');
    style.innerHTML = `
        .loading-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.7); z-index: 99; display: flex; align-items: center; justify-content: center; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #1E3A8A; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    window.gasStationManager = new GasStationManager();
});