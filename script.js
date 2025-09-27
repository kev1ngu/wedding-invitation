

// 字体加载检测功能
function waitForFontLoad() {
    return new Promise((resolve) => {
        // 检查Font Loading API是否可用
        if ('fonts' in document) {
            // 使用Font Loading API
            document.fonts.load('normal 72px Calmsie').then(() => {
                console.log('Calmsie字体加载完成');
                resolve();
            }).catch(() => {
                console.log('Font Loading API失败，使用备用方法');
                // 如果Font Loading API失败，使用备用方法
                fallbackFontCheck(resolve);
            });
        } else {
            console.log('Font Loading API不支持，使用备用方法');
            // 如果不支持Font Loading API，使用备用方法
            fallbackFontCheck(resolve);
        }
    });
}

// 备用字体检测方法
function fallbackFontCheck(callback) {
    const testText = 'the wedding calls';
    const fallbackFont = 'serif';
    const customFont = 'Calmsie, serif';

    // 创建测试元素
    const testElement = document.createElement('div');
    testElement.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        font-size: 72px;
        font-family: ${fallbackFont};
        visibility: hidden;
    `;
    testElement.textContent = testText;
    document.body.appendChild(testElement);

    // 获取fallback字体的宽度
    const fallbackWidth = testElement.offsetWidth;

    // 切换到自定义字体
    testElement.style.fontFamily = customFont;

    let attempts = 0;
    const maxAttempts = 50; // 最多检查5秒

    function checkFont() {
        attempts++;
        const currentWidth = testElement.offsetWidth;

        // 如果宽度发生变化，说明字体已加载
        if (currentWidth !== fallbackWidth || attempts >= maxAttempts) {
            document.body.removeChild(testElement);
            console.log(`字体检测完成，尝试次数: ${attempts}`);
            callback();
            return;
        }

        // 继续检查
        setTimeout(checkFont, 100);
    }

    checkFont();
}

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
    
    // 等待字体加载完成后再显示标题
    waitForFontLoad().then(() => {
        // 字体加载完成，先显示标题元素
        mainTitle.classList.add('font-loaded');
    
        // 延迟一下再执行显示动画，让翻页动画先完成
        setTimeout(() => {
            mainTitle.classList.add('show');
        }, 800); // 等待翻页动画基本完成后再显示标题
    });

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

// 全页滚动增强功能
function initFullPageScroll() {
    const main = document.getElementById('main-content');
    const sections = document.querySelectorAll('main > section');
    
    if (!main || !sections.length) return;
    
    let isScrolling = false;
    let scrollTimeout;
    
    // 鼠标滚轮事件处理
    function handleWheel(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        const currentScroll = main.scrollTop;
        const sectionHeight = window.innerHeight;
        const currentSectionIndex = Math.round(currentScroll / sectionHeight);
        
        let targetSection;
        
        if (e.deltaY > 0) {
            // 向下滚动
            targetSection = Math.min(currentSectionIndex + 1, sections.length - 1);
        } else {
            // 向上滚动
            targetSection = Math.max(currentSectionIndex - 1, 0);
        }
        
        if (targetSection !== currentSectionIndex) {
            isScrolling = true;
            main.scrollTo({
                top: targetSection * sectionHeight,
                behavior: 'smooth'
            });
            
            // 重置滚动状态
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }
    
    // 触摸滑动处理
    let touchStartY = 0;
    let touchEndY = 0;
    
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaY) > minSwipeDistance && !isScrolling) {
            const currentScroll = main.scrollTop;
            const sectionHeight = window.innerHeight;
            const currentSectionIndex = Math.round(currentScroll / sectionHeight);
            
            let targetSection;
            
            if (deltaY > 0) {
                // 向上滑动（显示下一页）
                targetSection = Math.min(currentSectionIndex + 1, sections.length - 1);
            } else {
                // 向下滑动（显示上一页）
                targetSection = Math.max(currentSectionIndex - 1, 0);
            }
            
            if (targetSection !== currentSectionIndex) {
                isScrolling = true;
                main.scrollTo({
                    top: targetSection * sectionHeight,
                    behavior: 'smooth'
                });
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }
    }
    
    // 键盘导航
    function handleKeydown(e) {
        if (isScrolling) return;
        
        const currentScroll = main.scrollTop;
        const sectionHeight = window.innerHeight;
        const currentSectionIndex = Math.round(currentScroll / sectionHeight);
        
        let targetSection = currentSectionIndex;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ': // 空格键
                e.preventDefault();
                targetSection = Math.min(currentSectionIndex + 1, sections.length - 1);
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                targetSection = Math.max(currentSectionIndex - 1, 0);
                break;
            case 'Home':
                e.preventDefault();
                targetSection = 0;
                break;
            case 'End':
                e.preventDefault();
                targetSection = sections.length - 1;
                break;
        }
        
        if (targetSection !== currentSectionIndex) {
            isScrolling = true;
            main.scrollTo({
                top: targetSection * sectionHeight,
                behavior: 'smooth'
            });
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }
    
    // 绑定事件监听器
    main.addEventListener('wheel', handleWheel, { passive: false });
    main.addEventListener('touchstart', handleTouchStart, { passive: true });
    main.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('keydown', handleKeydown);
    
    console.log('全页滚动功能已初始化');
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
    
    // 初始化全页滚动
    initFullPageScroll();
    
    // 为需要动画的元素添加观察器
    const animatedElements = document.querySelectorAll('.ceremony-card, .timeline-item, .story-tescrolling-photo photo-2t');
    
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

// 解析 object-position 为 [0..1] 比例
function parseObjectPosition(op) {
    let posX = 0.5, posY = 0.5; // 默认 center center
    if (!op) return { posX, posY };
    const tokens = op.trim().split(/\s+/);
    const mapX = { left: 0, center: 0.5, right: 1 };
    const mapY = { top: 0, center: 0.5, bottom: 1 };

    function tokenToFrac(token, axis) {
        const lower = token.toLowerCase();
        if (lower.endsWith('%')) {
            const v = parseFloat(lower);
            if (!isNaN(v)) return Math.min(Math.max(v / 100, 0), 1);
        }
        if (axis === 'x' && lower in mapX) return mapX[lower];
        if (axis === 'y' && lower in mapY) return mapY[lower];
        return 0.5;
    }

    if (tokens.length === 1) {
        const f = tokenToFrac(tokens[0], 'x');
        return { posX: f, posY: f };
    } else {
        return { posX: tokenToFrac(tokens[0], 'x'), posY: tokenToFrac(tokens[1], 'y') };
    }
}

// 将原图坐标映射到 cover/contain 渲染后的容器坐标
function mapPointForObjectFit(imgEl, px, py) {
    if (!imgEl) return null;
    const rect = imgEl.getBoundingClientRect();
    const cw = rect.width, ch = rect.height;
    const iw = imgEl.naturalWidth, ih = imgEl.naturalHeight;
    if (!cw || !ch || !iw || !ih) return null;

    const cs = getComputedStyle(imgEl);
    const fit = (cs.objectFit || 'fill').toLowerCase();
    const { posX, posY } = parseObjectPosition(cs.objectPosition || '50% 50%');

    let scale;
    if (fit === 'cover') {
        scale = Math.max(cw / iw, ch / ih);
    } else if (fit === 'contain') {
        scale = Math.min(cw / iw, ch / ih);
    } else {
        // 简化：其他fit按contain处理
        scale = Math.min(cw / iw, ch / ih);
    }

    const renderedW = iw * scale;
    const renderedH = ih * scale;
    const offsetX = (cw - renderedW) * posX;
    const offsetY = (ch - renderedH) * posY;

    const localX = offsetX + px * scale;
    const localY = offsetY + py * scale;

    return {
        rect,
        cw, ch, iw, ih,
        scale,
        renderedW, renderedH,
        offsetX, offsetY,
        localX, localY,
        viewportLeft: rect.left + localX,
        viewportTop: rect.top + localY,
        documentLeft: rect.left + localX + window.scrollX,
        documentTop: rect.top + localY + window.scrollY,
        visible: localX >= 0 && localX <= cw && localY >= 0 && localY <= ch,
    };
}

// 日历：让红圈跟随原图上的固定点（支持 object-fit: cover / object-position）
function initCalendarCoverCircle() {
    const container = document.querySelector('.calendar-image-container');
    const img = container?.querySelector('.calendar-image');
    const circle = container?.querySelector('.hand-drawn-circle');
    if (!container || !img || !circle) return;

    // 支持 data- 属性，否则用你提供的水平比值 1420/1920
    const ratioX = 1480 / 1920; // 若有 data-circle-x 则按像素覆盖
    const dataX = img.getAttribute('data-circle-x');
    const dataY = img.getAttribute('data-circle-y');
    const dataD = img.getAttribute('data-circle-diameter');
    const dataDyMobile = img.getAttribute('data-circle-dy-mobile'); // 移动端额外下移（原图像素）

    const getRef = () => {
        const iw = img.naturalWidth || 0;
        const ih = img.naturalHeight || 0;
        // 优先像素，其次按比例
        const x = dataX != null ? parseFloat(dataX) : (iw ? ratioX * iw : 0);
        const y = dataY != null ? parseFloat(dataY) : null; // 若没给y，则仅横向对齐
        const d = dataD != null ? parseFloat(dataD) : 200; // 默认按原图120像素直径做等比缩放
        const dyMobile = dataDyMobile != null ? parseFloat(dataDyMobile) : 0;
        return { x, y, d, iw, ih, dyMobile };
    };

    const place = () => {
        if (!img.complete || !img.naturalWidth || !img.naturalHeight) return;

    const ref = getRef();
    const isMobile = window.matchMedia('(max-width: 767.98px)').matches;
    const yForMap = (ref.y != null ? ref.y : 0) + (isMobile ? ref.dyMobile : 0);
    const mapped = mapPointForObjectFit(img, ref.x, yForMap);
        if (!mapped) return;

        const containerRect = container.getBoundingClientRect();
        // 绝对定位到容器坐标
        const cx = mapped.viewportLeft - containerRect.left;
        const shouldSetTop = (ref.y != null) || (isMobile && ref.dyMobile !== 0);
        const cy = shouldSetTop ? (mapped.viewportTop - containerRect.top) : null;

        circle.style.left = `${cx}px`;
    if (cy != null) circle.style.top = `${cy}px`;
        // 直径随比例缩放（移动端和桌面端都生效）
        const dia = ref.d * mapped.scale;
        circle.style.width = `${dia}px`;
        circle.style.height = `${dia}px`;
        circle.style.transform = 'translate(-50%, -50%)';
    };

    const debouncedPlace = debounce(place, 50);
    window.addEventListener('resize', debouncedPlace);
    if (!img.complete) img.addEventListener('load', debouncedPlace, { once: true });

    // 切换到Calendar时重新计算
    const calendarTab = document.querySelector('.tab-item[data-tab="calendar"]');
    if (calendarTab) calendarTab.addEventListener('click', () => setTimeout(debouncedPlace, 220));

    // 初次放置
    setTimeout(place, 0);
}

// 启动日历红圈跟随
document.addEventListener('DOMContentLoaded', () => {
    initCalendarCoverCircle();
});

// 幻灯片section滚动触发动画
function initSlideshowScrollTrigger() {
    const slideshowSection = document.querySelector('.slideshow-section');
    if (!slideshowSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 当section进入视口时，添加in-view类
                entry.target.classList.add('in-view');
            } else {
                // 当section离开视口时，移除in-view类（可选）
                // entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.3, // 当30%的section可见时触发
        rootMargin: '0px 0px -10% 0px' // 提前10%触发
    });

    observer.observe(slideshowSection);
}

// 启动幻灯片滚动触发
document.addEventListener('DOMContentLoaded', () => {
    initSlideshowScrollTrigger();
});

// 向下箭头滚动行为
function initScrollArrow() {
    const scrollArrow = document.querySelector('.scroll-arrow');
    const main = document.querySelector('main');
    
    if (!scrollArrow || !main) return;
    
    scrollArrow.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 获取下一个section
        const currentSection = scrollArrow.closest('section');
        const nextSection = currentSection?.nextElementSibling;
        
        if (nextSection) {
            // 临时禁用动态滚动优化
            main.setAttribute('data-scroll-locked', 'true');
            
            // 根据屏幕尺寸使用不同的滚动方法
            if (window.innerWidth <= 480) {
                // 480px以下：使用更精确的滚动方法
                const nextSectionTop = nextSection.offsetTop;
                const currentScrollTop = main.scrollTop;
                const targetScrollTop = nextSectionTop;
                
                // 使用requestAnimationFrame实现平滑滚动
                const startScrollTop = currentScrollTop;
                const distance = targetScrollTop - startScrollTop;
                const duration = 800; // 滚动持续时间
                let startTime = null;
                
                function smoothScroll(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    
                    main.scrollTop = startScrollTop + distance * easeProgress;
                    
                    if (progress < 1) {
                        requestAnimationFrame(smoothScroll);
                    } else {
                        // 滚动完成后重新启用动态滚动优化
                        setTimeout(() => {
                            main.removeAttribute('data-scroll-locked');
                        }, 200);
                    }
                }
                
                requestAnimationFrame(smoothScroll);
            } else if (window.innerWidth <= 768) {
                // 768px以下：使用scrollIntoView
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 滚动完成后重新启用动态滚动优化
                setTimeout(() => {
                    main.removeAttribute('data-scroll-locked');
                }, 1000);
            } else {
                // 桌面端：使用scrollTo
                const nextSectionTop = nextSection.offsetTop;
                main.scrollTo({
                    top: nextSectionTop,
                    behavior: 'smooth'
                });
                
                // 滚动完成后重新启用动态滚动优化
                setTimeout(() => {
                    main.removeAttribute('data-scroll-locked');
                }, 1000);
            }
        }
    });
}

// 启动向下箭头滚动
document.addEventListener('DOMContentLoaded', () => {
    initScrollArrow();
});

// 动态视口高度滚动优化
function initDynamicViewportScroll() {
    const main = document.querySelector('main');
    if (!main) return;

    // 监听视口变化
    function handleViewportChange() {
        // 重新计算滚动位置
        const currentScrollTop = main.scrollTop;
        const viewportHeight = window.innerHeight;
        
        // 如果滚动位置接近某个section边界，调整到精确位置
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + currentScrollTop;
            
            // 如果当前滚动位置接近section顶部，精确对齐
            if (Math.abs(currentScrollTop - sectionTop) < 50) {
                main.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // 监听视口变化事件
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', () => {
        // 延迟处理，等待视口稳定
        setTimeout(handleViewportChange, 100);
    });

    // 监听滚动事件，优化滚动对齐
    let scrollTimeout;
    main.addEventListener('scroll', () => {
        // 如果滚动被锁定（如向下箭头点击），跳过自动对齐
        if (main.hasAttribute('data-scroll-locked')) {
            return;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollTop = main.scrollTop;
            const viewportHeight = window.innerHeight;
            
            // 找到最接近的section
            const sections = document.querySelectorAll('section');
            let closestSection = null;
            let minDistance = Infinity;
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrollTop;
                const distance = Math.abs(scrollTop - sectionTop);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestSection = section;
                }
            });
            
            // 如果距离超过阈值，自动对齐到最近的section
            if (closestSection && minDistance > 100) {
                const rect = closestSection.getBoundingClientRect();
                const sectionTop = rect.top + scrollTop;
                
                main.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
            }
        }, 150);
    });
}

// 启动动态视口滚动优化
document.addEventListener('DOMContentLoaded', () => {
    initDynamicViewportScroll();
});

