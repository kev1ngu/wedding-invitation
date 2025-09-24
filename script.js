

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
    
    // 显示向下箭头并初始化功能
    setTimeout(() => {
        if (scrollArrow) {
            scrollArrow.style.opacity = '1';
            initScrollArrowLogic(scrollArrow); // 箭头显示后立即初始化功能
        }
    }, 2500);
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

// Tab切换功能 - 重新设计的左右滑动动画
function initTabSwitcher() {
    const tabItems = document.querySelectorAll('.tab-item');
    const mapContent = document.getElementById('map-content');
    const calendarContent = document.getElementById('calendar-content');
    const brushPath = document.querySelector('.brush-path');
    
    let currentTab = 'map'; // 记录当前激活的tab
    
    // 初始化状态
    function initializeState() {
        console.log('开始初始化Tab状态...');
        console.log('mapContent:', mapContent);
        console.log('calendarContent:', calendarContent);
        
        // 清理所有状态类
        mapContent.className = 'tab-content';
        calendarContent.className = 'tab-content';
        
        // 设置初始位置：Map显示在中央，Calendar隐藏在右侧
        mapContent.classList.add('active');
        calendarContent.classList.add('inactive-right');
        
        console.log('初始化完成：');
        console.log('- Map classes:', mapContent.className);
        console.log('- Calendar classes:', calendarContent.className);
    }
    
    // 切换到指定tab
    function switchToTab(targetTab) {
        if (targetTab === currentTab) return;
        
        console.log(`切换：${currentTab} → ${targetTab}`);
        
        if (targetTab === 'map') {
            // Calendar → Map：整体向右滑动
            // Calendar向右滑出，Map从左滑入
            calendarContent.classList.remove('active');
            calendarContent.classList.add('inactive-right');
            
            mapContent.classList.remove('inactive-left');
            mapContent.classList.add('active');
            
        } else if (targetTab === 'calendar') {
            // Map → Calendar：整体向左滑动  
            // Map向左滑出，Calendar从右滑入
            mapContent.classList.remove('active');
            mapContent.classList.add('inactive-left');
            
            calendarContent.classList.remove('inactive-right');
            calendarContent.classList.add('active');
            
            // 触发手写毛笔动画
            setTimeout(() => {
                if (brushPath) {
                    brushPath.style.animation = 'none';
                    setTimeout(() => {
                        brushPath.style.animation = 'drawBrush 2.5s ease-in-out forwards';
                    }, 100);
                }
            }, 150); // 等待滑动动画开始
        }
        
        currentTab = targetTab;
    }
    
    // 初始化
    initializeState();
    
    // 绑定事件
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.getAttribute('data-tab');
            
            // 更新tab按钮状态
            tabItems.forEach(item => item.classList.remove('active'));
            tab.classList.add('active');
            
            // 执行切换
            switchToTab(tabType);
        });
    });
}

// Avatar头像滚动触发动画
function initAvatarAnimation() {
    const avatarGroup = document.querySelector('.avatar-group');
    if (!avatarGroup) return;
    
    // 创建Intersection Observer
    const avatarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 当avatar-group进入视口时，添加animate类触发动画
                avatarGroup.classList.add('animate');
                console.log('Avatar动画开始！');
                // 动画触发后停止观察
                avatarObserver.unobserve(avatarGroup);
            }
        });
    }, {
        threshold: 0.3, // 当30%的元素可见时触发
        rootMargin: '0px 0px -50px 0px' // 提前50px触发
    });
    
    // 开始观察avatar-group
    avatarObserver.observe(avatarGroup);
}

// 幻灯片功能
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!slides.length || !indicators.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // 显示指定幻灯片
    function showSlide(index) {
        // 移除所有active类
        slides.forEach(slide => slide.classList.remove('active', 'prev'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // 添加active类到当前幻灯片
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // 设置前一个幻灯片为prev状态
        const prevIndex = index === 0 ? totalSlides - 1 : index - 1;
        slides[prevIndex].classList.add('prev');
        
        currentSlide = index;
    }
    
    // 下一张幻灯片
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
    }
    
    // 上一张幻灯片
    function prevSlide() {
        const prevIndex = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
        showSlide(prevIndex);
    }
    
    // 绑定事件
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // 绑定指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // 自动播放（可选）
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // 5秒切换一次
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // 鼠标悬停时暂停自动播放
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', stopAutoPlay);
        slideshowContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // 开始自动播放
    startAutoPlay();
    
    console.log('幻灯片初始化完成');
}

// 倒计时功能
function initCountdown() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;
    
    // 目标日期：2025年10月25日 11:28 AM
    const targetDate = new Date('2025-10-25T11:28:00');
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = targetDate - now;
        
        if (timeLeft <= 0) {
            // 倒计时结束
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }
        
        // 计算剩余时间
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // 更新显示
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    // 立即更新一次
    updateCountdown();
    
    // 每秒更新
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    console.log('倒计时初始化完成，目标时间：2025年10月25日 11:28 AM');
}

// 页面加载完成后初始化动画
document.addEventListener('DOMContentLoaded', function() {
    // 启动翻页时钟动画
    initFlipClockAnimation();
    
    // 初始化Tab切换器
    initTabSwitcher();
    
    // 初始化Avatar滚动动画
    initAvatarAnimation();
    
    // 初始化倒计时
    initCountdown();
    
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

// 停车导览模态框功能
function initParkingModal() {
    const parkingBtn = document.getElementById('parkingGuideBtn');
    const modal = document.getElementById('parkingModal');
    const backdrop = document.getElementById('modalBackdrop');
    const closeBtn = document.getElementById('modalClose');
    
    if (!parkingBtn || !modal || !backdrop || !closeBtn) return;
    
    // 显示模态框
    function showModal() {
        modal.classList.add('show');
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
    }
    
    // 隐藏模态框
    function hideModal() {
        modal.classList.remove('show');
        modal.classList.add('hiding');
        setTimeout(() => {
            modal.classList.remove('hiding');
            document.body.style.overflow = '';
        }, 150);
    }
    
    // 点击按钮显示模态框
    parkingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showModal();
    });
    
    // 点击背景隐藏模态框
    backdrop.addEventListener('click', hideModal);
    
    // 点击关闭按钮隐藏模态框
    closeBtn.addEventListener('click', hideModal);
    
    // ESC键隐藏模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });
    
    // 防止模态框内容区域点击时关闭
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// 初始化停车导览模态框
initParkingModal();

// 滚动箭头功能 - 在箭头显示后初始化
function initScrollArrowLogic(arrow) {
    if (!arrow) return;
    
    let isHidden = false;
    
    // 找到实际的滚动容器
    const mainContent = document.getElementById('main-content');
    const scrollContainer = mainContent || document.body;
    
    function hideArrow() {
        if (isHidden) return;
        isHidden = true;
        
        // 移除滚动监听器
        scrollContainer.removeEventListener('scroll', correctScrollListener);
        
        arrow.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        arrow.style.opacity = '0';
        arrow.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            if (arrow && arrow.parentNode) {
                arrow.remove();
            }
        }, 400);
    }
    
    // 滚动时隐藏 - 监听正确的滚动容器
    
    // 修改滚动监听器以使用正确的滚动位置
    const correctScrollListener = () => {
        if (isHidden) return;
        
        // 获取正确的滚动位置
        const currentScroll = mainContent ? mainContent.scrollTop : window.scrollY;
        
        // 检查是否滚动到下一个section
        const animationSection = document.querySelector('.animation-section');
        const heroSection = document.querySelector('.hero-section');
        
        if (animationSection && heroSection) {
            const animationBottom = animationSection.offsetHeight;
            const heroTop = heroSection.offsetTop;
            
            
            // 如果滚动超过动画section的底部，或者接近hero section，立即隐藏
            if (currentScroll >= animationBottom - 100 || currentScroll >= heroTop - 200) {
                hideArrow();
                return;
            }
        }
        
        // 任何滚动都触发隐藏（备用机制）
        if (currentScroll > 50) {
            hideArrow();
        }
    };
    
    // 绑定到正确的滚动容器
    scrollContainer.addEventListener('scroll', correctScrollListener, { passive: true });
    
    
    // 点击时隐藏并滚动
    arrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideArrow();
        
        setTimeout(() => {
            document.getElementById('home').scrollIntoView({
                behavior: 'smooth'
            });
        }, 100);
    });
}

