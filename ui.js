// Gas Station Smart Manager - UI Enhancement and Interactions

class UIEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupCardHoverEffects();
        this.setupLoadingStates();
        this.setupResponsiveHandling();
        this.setupAccessibilityFeatures();
        this.setupGestureHandling();
    }

    setupScrollEffects() {
        // Add scroll-based animations for mobile
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.card, .bg-white').forEach(el => {
            observer.observe(el);
        });
    }

    setupCardHoverEffects() {
        // Enhanced hover effects for cards
        document.querySelectorAll('.bg-white').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
                card.style.transition = 'all 0.2s ease';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            });
        });

        // Competitor row hover effects
        document.querySelectorAll('.competitor-row').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = '#F9FAFB';
                row.style.transform = 'translateX(4px)';
                row.style.transition = 'all 0.2s ease';
            });

            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = 'transparent';
                row.style.transform = 'translateX(0)';
            });
        });
    }

    setupLoadingStates() {
        // Create skeleton loading for charts
        this.createSkeletonLoading();
        
        // Simulate loading states when switching tabs
        document.querySelectorAll('.nav-btn, .desktop-nav-link').forEach(navItem => {
            navItem.addEventListener('click', () => {
                this.showLoadingState();
                setTimeout(() => {
                    this.hideLoadingState();
                }, 500);
            });
        });
    }

    createSkeletonLoading() {
        const skeletonHTML = `
            <div class="skeleton-loader">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-chart"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
        `;

        // Add skeleton CSS
        const skeletonCSS = `
            .skeleton-loader {
                padding: 20px;
            }
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 8px;
                margin-bottom: 12px;
            }
            .skeleton-title {
                height: 24px;
                width: 200px;
            }
            .skeleton-chart {
                height: 200px;
                width: 100%;
            }
            .skeleton-text {
                height: 16px;
                width: 80%;
            }
        `;

        // Add CSS to head if not exists
        if (!document.querySelector('#skeleton-css')) {
            const style = document.createElement('style');
            style.id = 'skeleton-css';
            style.textContent = skeletonCSS;
            document.head.appendChild(style);
        }
    }

    showLoadingState() {
        const charts = document.querySelectorAll('canvas');
        charts.forEach(chart => {
            const container = chart.parentElement;
            if (!container.querySelector('.skeleton-loader')) {
                const skeleton = document.createElement('div');
                skeleton.innerHTML = `
                    <div class="skeleton-loader">
                        <div class="skeleton skeleton-chart"></div>
                    </div>
                `;
                skeleton.style.position = 'absolute';
                skeleton.style.top = '0';
                skeleton.style.left = '0';
                skeleton.style.right = '0';
                skeleton.style.bottom = '0';
                skeleton.style.background = 'rgba(255, 255, 255, 0.9)';
                skeleton.style.zIndex = '10';
                
                container.style.position = 'relative';
                container.appendChild(skeleton);
            }
        });
    }

    hideLoadingState() {
        document.querySelectorAll('.skeleton-loader').forEach(skeleton => {
            skeleton.parentElement.removeChild(skeleton);
        });
    }

    setupResponsiveHandling() {
        // Handle responsive behavior for different screen sizes
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

            // Adjust chart options based on screen size
            if (isMobile) {
                this.optimizeForMobile();
            } else if (isTablet) {
                this.optimizeForTablet();
            } else {
                this.optimizeForDesktop();
            }
        };

        window.addEventListener('resize', this.debounce(handleResize, 250));
        handleResize(); // Initial call
    }

    optimizeForMobile() {
        // Mobile-specific optimizations
        document.querySelectorAll('.grid-cols-3').forEach(grid => {
            if (window.innerWidth <= 640) {
                grid.style.gridTemplateColumns = '1fr';
                grid.style.gap = '16px';
            }
        });

        // Reduce chart animation on mobile for performance
        if (window.dashboardCharts) {
            Object.values(window.dashboardCharts).forEach(chart => {
                if (chart && chart.options) {
                    chart.options.animation = { duration: 500 };
                }
            });
        }
    }

    optimizeForTablet() {
        // Tablet-specific optimizations
        document.querySelectorAll('.grid-cols-3').forEach(grid => {
            grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
            grid.style.gap = '20px';
        });
    }

    optimizeForDesktop() {
        // Desktop-specific optimizations
        document.querySelectorAll('.grid-cols-3').forEach(grid => {
            grid.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
            grid.style.gap = '24px';
        });
    }

    setupAccessibilityFeatures() {
        // Enhanced keyboard navigation
        this.setupKeyboardNavigation();
        
        // Screen reader support
        this.setupScreenReaderSupport();
        
        // High contrast mode support
        this.setupHighContrastMode();
        
        // Focus management
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        // Arrow key navigation for tabs
        document.addEventListener('keydown', (e) => {
            const activeTab = document.querySelector('.nav-btn.active, .desktop-nav-link.active');
            if (!activeTab) return;

            let nextTab = null;
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                nextTab = activeTab.previousElementSibling;
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                nextTab = activeTab.nextElementSibling;
            }

            if (nextTab && (nextTab.classList.contains('nav-btn') || nextTab.classList.contains('desktop-nav-link'))) {
                nextTab.click();
                nextTab.focus();
                e.preventDefault();
            }
        });

        // Enter key activation for buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA labels and descriptions
        document.querySelectorAll('canvas').forEach((canvas, index) => {
            canvas.setAttribute('role', 'img');
            canvas.setAttribute('aria-label', `차트 ${index + 1}`);
        });

        // Live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);

        this.liveRegion = liveRegion;
    }

    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }

    setupHighContrastMode() {
        // Detect high contrast mode
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        
        const handleHighContrast = (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
                this.applyHighContrastStyles();
            } else {
                document.body.classList.remove('high-contrast');
                this.removeHighContrastStyles();
            }
        };

        mediaQuery.addEventListener('change', handleHighContrast);
        handleHighContrast(mediaQuery);
    }

    applyHighContrastStyles() {
        const highContrastCSS = `
            .high-contrast .bg-white {
                border: 2px solid #000 !important;
            }
            .high-contrast .text-primary {
                color: #000 !important;
            }
            .high-contrast .bg-gradient-to-r {
                background: #000 !important;
                color: #fff !important;
            }
        `;

        if (!document.querySelector('#high-contrast-css')) {
            const style = document.createElement('style');
            style.id = 'high-contrast-css';
            style.textContent = highContrastCSS;
            document.head.appendChild(style);
        }
    }

    removeHighContrastStyles() {
        const style = document.querySelector('#high-contrast-css');
        if (style) {
            style.remove();
        }
    }

    setupFocusManagement() {
        // Focus trap for modal-like content
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = document.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });

        // Visible focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
    }

    setupGestureHandling() {
        // Touch/swipe gestures for mobile
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();

            const diffX = startX - endX;
            const diffY = startY - endY;
            const diffTime = endTime - startTime;

            // Only process quick swipes
            if (diffTime > 300) return;

            // Horizontal swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next tab
                    this.switchToNextTab();
                } else {
                    // Swipe right - previous tab
                    this.switchToPreviousTab();
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    switchToNextTab() {
        const activeTab = document.querySelector('.nav-btn.active');
        const nextTab = activeTab ? activeTab.nextElementSibling : null;
        
        if (nextTab && nextTab.classList.contains('nav-btn')) {
            nextTab.click();
            this.announceToScreenReader('다음 탭으로 이동했습니다');
        }
    }

    switchToPreviousTab() {
        const activeTab = document.querySelector('.nav-btn.active');
        const prevTab = activeTab ? activeTab.previousElementSibling : null;
        
        if (prevTab && prevTab.classList.contains('nav-btn')) {
            prevTab.click();
            this.announceToScreenReader('이전 탭으로 이동했습니다');
        }
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        });

        // Monitor chart rendering performance
        const originalRender = Chart.prototype.render;
        Chart.prototype.render = function() {
            const start = performance.now();
            const result = originalRender.apply(this, arguments);
            const end = performance.now();
            console.log(`Chart render time: ${end - start}ms`);
            return result;
        };
    }

    // Utility methods
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    throttle(func, delay) {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }

    // Notification system
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);

        // Announce to screen reader
        this.announceToScreenReader(message);
    }

    // Data validation
    validateFormData(formData) {
        const errors = [];

        if (!formData.stationName || formData.stationName.trim().length < 2) {
            errors.push('주유소명은 2글자 이상 입력해주세요.');
        }

        if (!formData.address || formData.address.trim().length < 10) {
            errors.push('주소를 정확히 입력해주세요.');
        }

        if (!formData.fuelTypes || formData.fuelTypes.length === 0) {
            errors.push('최소 하나의 판매 유종을 선택해주세요.');
        }

        if (formData.dailyTarget < 100000 || formData.dailyTarget > 1000000) {
            errors.push('일일 목표 수익은 10만원에서 100만원 사이로 설정해주세요.');
        }

        return errors;
    }
}

// Initialize UI enhancer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uiEnhancer = new UIEnhancer();
});

// Export for global access
window.UIEnhancer = UIEnhancer;