

// 翻页时钟动画控制 - 页面内嵌版本
function initFlipClockAnimation() {
    const flipCards = document.querySelectorAll('.flip-card');
    const mainTitle = document.getElementById('main-title');
    const scrollArrow = document.getElementById('scrollArrow');
    
    // 确保元素存在
    if (!flipCards.length || !mainTitle) {
        console.log('翻页时钟元素未找到，跳过动画');
        return;
    }
    
    // 翻页时钟动画序列 - 快速翻页
    const flipSequence = [
        { card: flipCards[0], delay: 300 },
        { card: flipCards[1], delay: 500 },
        { card: flipCards[2], delay: 700 },
        { card: flipCards[3], delay: 900 }
    ];
    
    // 执行翻页动画
    flipSequence.forEach(({ card, delay }) => {
        setTimeout(() => {
            if (card) {
                card.classList.add('flipped');
            }
        }, delay);
    });
    
    // 显示主标题 "the wedding calls"
    setTimeout(() => {
        mainTitle.classList.add('show');
    }, 1500);
    
    // 显示向下箭头
    setTimeout(() => {
        if (scrollArrow) {
            scrollArrow.style.opacity = '1';
        }
    }, 2500);
    
    // 添加箭头点击事件
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            const heroSection = document.getElementById('home');
            if (heroSection) {
                // 箭头消失动画
                scrollArrow.style.opacity = '0';
                scrollArrow.style.transform = 'translateX(-50%) translateY(10px)';
                scrollArrow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                // 滚动到hero section
                heroSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 延迟移除元素
                setTimeout(() => {
                    if (scrollArrow.parentNode) {
                        scrollArrow.parentNode.removeChild(scrollArrow);
                    }
                }, 300);
            }
        });
    }
}

// 平滑滚动到指定部分
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}


// 表单提交处理
document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.querySelector('.rsvp-form');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const guests = formData.get('guests');
            const message = formData.get('message');
            
            // 简单的表单验证
            if (!name || !phone || !guests) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            // 模拟提交成功
            showNotification('感谢您的确认！我们会尽快与您联系。', 'success');
            
            // 重置表单
            this.reset();
        });
    }
});

// 通知显示函数
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#34c759' : type === 'error' ? '#ff3b30' : '#007aff'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 500;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 滚动动画观察器
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Tab切换功能
function initTabSwitcher() {
    const tabItems = document.querySelectorAll('.tab-item');
    const mapContent = document.getElementById('map-content');
    const calendarContent = document.getElementById('calendar-content');
    const brushPath = document.querySelector('.brush-path');
    
    // 确保初始状态正确
    mapContent.classList.add('active');
    calendarContent.classList.remove('active');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.getAttribute('data-tab');
            
            // 移除所有active类
            tabItems.forEach(item => item.classList.remove('active'));
            // 添加active类到当前tab
            tab.classList.add('active');
            
            // 切换内容显示
            if (tabType === 'map') {
                mapContent.classList.add('active');
                calendarContent.classList.remove('active');
                console.log('切换到Map');
            } else if (tabType === 'calendar') {
                mapContent.classList.remove('active');
                calendarContent.classList.add('active');
                console.log('切换到Calendar');
                
                // 触发手写毛笔动画
                if (brushPath) {
                    brushPath.style.animation = 'none';
                    setTimeout(() => {
                        brushPath.style.animation = 'drawBrush 2.5s ease-in-out forwards';
                    }, 100);
                }
            }
        });
    });
}

// 页面加载完成后初始化动画
document.addEventListener('DOMContentLoaded', function() {
    // 启动翻页时钟动画
    initFlipClockAnimation();
    
    // 初始化Tab切换器
    initTabSwitcher();
    
    // 为需要动画的元素添加观察器
    const animatedElements = document.querySelectorAll('.ceremony-card, .timeline-item, .story-text');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 鼠标悬停效果
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.ceremony-card, .timeline-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // 关闭任何打开的模态框或通知
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }
});

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // 为触摸设备优化悬停效果
    const style = document.createElement('style');
    style.textContent = `
        .touch-device .ceremony-card:hover,
        .touch-device .timeline-item:hover {
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


// 添加页面可见性API支持
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        document.body.style.animationPlayState = 'paused';
    } else {
        // 页面显示时恢复动画
        document.body.style.animationPlayState = 'running';
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    // 可以在这里添加错误报告逻辑
});

// 添加加载完成事件
window.addEventListener('load', function() {
    // 页面完全加载后的处理
    console.log('婚礼请柬网站加载完成');
    
    // 可以在这里添加统计代码或其他第三方服务
});

// 背景音乐控制
function initBackgroundMusic() {
    const bgm = document.getElementById('bgm');
    if (!bgm) return;
    
    // 设置音量
    bgm.volume = 0.3; // 30% 音量
    
    // 尝试播放音乐
    const playMusic = () => {
        bgm.play().catch(error => {
            console.log('自动播放被阻止，需要用户交互:', error);
            // 如果自动播放失败，在用户首次交互时播放
            document.addEventListener('click', () => {
                bgm.play().catch(e => console.log('播放失败:', e));
            }, { once: true });
        });
    };
    
    // 页面加载后尝试播放
    setTimeout(playMusic, 1000);
    
    // 监听音乐播放状态
    bgm.addEventListener('play', () => {
        console.log('背景音乐开始播放');
    });
    
    bgm.addEventListener('pause', () => {
        console.log('背景音乐暂停');
    });
    
    bgm.addEventListener('error', (e) => {
        console.error('背景音乐播放错误:', e);
    });
}

// 初始化背景音乐
initBackgroundMusic();

