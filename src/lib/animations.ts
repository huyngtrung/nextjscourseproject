// animations.ts
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

let overlayEl: HTMLDivElement | null = null;
export function createOverlay() {
    if (overlayEl) return overlayEl;

    overlayEl = document.createElement('div');
    Object.assign(overlayEl.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(22, 22, 22, 1)',
        zIndex: '9999',
        opacity: '0',
        pointerEvents: 'none',
    });
    document.body.appendChild(overlayEl);
    return overlayEl;
}

// Page Transition animation
export function animatePageOut(
    target: string,
    router: ReturnType<typeof import('next/navigation').useRouter>,
) {
    const overlay = createOverlay();
    const body = document.body;

    const tl = gsap.timeline({
        onComplete: () => {
            router.push(target);
            gsap.set(body, { filter: 'none' });
        },
    });

    tl.to(body, { filter: 'blur(5px)', duration: 0.3, ease: 'power1.out' }).to(
        overlay,
        { opacity: 1, duration: 0.4, ease: 'power1.out' },
        '<',
    );
}

//  Page Init Animation
export function animatePageIn() {
    const overlay = createOverlay();
    gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.out',
    });
}

// Hero Section Animation()
export function animateHeroSection(sectionRef: React.RefObject<HTMLDivElement | null>) {
    if (!sectionRef.current) return;

    const tl = gsap.timeline();

    // reset trạng thái trước khi animate
    gsap.set('.hero-bg', { scale: 0.8, opacity: 0 });
    gsap.set('.hero-slogan', { x: '-10%', opacity: 0 });
    gsap.set('.hero-title', { x: '-10%', opacity: 0 });
    gsap.set('.hero-subtitle', { x: '10%', opacity: 0 });
    gsap.set('.hero-button', { y: '-20%', scale: 0.3, opacity: 0 });

    tl.to('.hero-bg', { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .to('.hero-slogan', { x: 0, opacity: 1, duration: 1.4, ease: 'power2.out' }, '<')
        .to('.hero-title', { x: 0, opacity: 1, duration: 1.6, ease: 'power2.out' }, '<')
        .to('.hero-subtitle', { x: 0, opacity: 1, duration: 1.8, ease: 'power2.out' }, '<')
        .to(
            '.hero-button',
            { y: 0, scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.7)' },
            '-=1.4',
        );
}

// WhyChooseUs Section Animation
export function animeWhychooseUsSection() {
    gsap.fromTo(
        '.feature-item',
        { opacity: 1, filter: 'blur(8px)', y: 20 },
        {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.4,
            stagger: 0, //All start at the same time
            scrollTrigger: {
                trigger: '.feature-item',
                start: 'top 70%',
                toggleActions: 'play reverse play reverse',
                onEnter: () => {
                    gsap.to('.feature-item', {
                        opacity: 1,
                        filter: 'blur(0px)',
                        y: 0,
                        duration: 0.4,
                    });
                },
                onLeaveBack: () => {
                    gsap.to('.feature-item', {
                        opacity: 0,
                        filter: 'blur(8px)',
                        y: 20,
                        duration: 0.4,
                    });
                },
            },
        },
    );
}

// Course Card Animation
export function animateCourseCard(sectionRef: React.RefObject<HTMLDivElement | null>) {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const cards = sectionRef.current.querySelectorAll('.card-fade-seq');
    gsap.set(cards, { opacity: 0, y: 50 });

    ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.5,
                ease: 'power2.out',
            });
        },
        onLeaveBack: () => {
            gsap.to(cards, {
                opacity: 0,
                y: 50,
                stagger: 0.15,
                duration: 0.5,
                ease: 'power2.out',
            });
        },
    });
}

// Envelope Border Animation
export function animateEnvelopeBorder() {
    const element = document.querySelector('.envelope-border') as HTMLElement;
    if (!element) return;

    gsap.to(
        {},
        {
            duration: 0.02,
            repeat: -1,
            onRepeat: () => {
                const time = performance.now() / 1000;
                const offset = (time * 5) % 60;
                element.style.borderImageSource = `repeating-linear-gradient(45deg,
                #4a90e2 ${offset}px ${offset + 15}px,
                white ${offset + 15}px ${offset + 30}px,
                #4a90e2 ${offset + 30}px ${offset + 45}px,
                white ${offset + 45}px ${offset + 60}px
            )`;
            },
        },
    );
}
