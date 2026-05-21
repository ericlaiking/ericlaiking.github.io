/* Portfolio Interactive Engine: Eric Lai */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Dark / Light Theme Controller
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check Local Storage or default to Dark Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-moon';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });


    // ==========================================
    // 2. Custom Glowing Mouse Follower
    // ==========================================
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorDot = document.getElementById('cursor-dot');

    if (cursorGlow && cursorDot) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        
        let glowX = mouseX;
        let glowY = mouseY;
        let dotX = mouseX;
        let dotY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth Lerp (Linear Interpolation) loop for the cursor elements
        const tick = () => {
            // Lerp glow (slow follow)
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;

            // Lerp dot (fast follow)
            dotX += (mouseX - dotX) * 0.25;
            dotY += (mouseY - dotY) * 0.25;
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;

            requestAnimationFrame(tick);
        };
        tick();

        // Cursor state expansions on hoverable items
        const hoverables = document.querySelectorAll('a, button, .project-card, .filter-btn, .social-btn, .form-control');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorGlow.classList.add('cursor-hovered');
                cursorDot.classList.add('cursor-dot-hovered');
            });
            item.addEventListener('mouseleave', () => {
                cursorGlow.classList.remove('cursor-hovered');
                cursorDot.classList.remove('cursor-dot-hovered');
            });
        });
    }


    // ==========================================
    // 3. Floating Navbar & Scroll Spy Active Indicator
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Navbar effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Section active highlighter (Scroll Spy)
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 140; // Adjust offsets for fixed nav
            const secHeight = sec.offsetHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 4. Mobile Menu Controller
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileToggle && mobileMenuOverlay) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileMenuOverlay.classList.contains('open');
            if (isOpen) {
                mobileMenuOverlay.classList.remove('open');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            } else {
                mobileMenuOverlay.classList.add('open');
                mobileToggle.innerHTML = '<i class="fas fa-xmark"></i>';
                document.body.style.overflow = 'hidden';
            }
        });

        // Close when a link inside mobile overlay is tapped
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('open');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }


    // ==========================================
    // 5. Hero Dynamic Typewriter Text Loop
    // ==========================================
    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
        const phrases = [
            "Advanced Audio Systems",
            "Realtek Audio Codecs",
            "AI-Driven Dev Tools",
            "Custom DSP tuning profiles",
            "Automotive Infotainment Integration"
        ];
        let i = 0; // Current phrase index
        let timer;

        function typePhrase() {
            let word = phrases[i];
            let chars = word.split('');
            typewriter.innerHTML = '';
            
            function printChar() {
                if (chars.length > 0) {
                    typewriter.innerHTML += chars.shift();
                    timer = setTimeout(printChar, 70);
                } else {
                    timer = setTimeout(deletePhrase, 2200); // Hold phrase visible
                }
            }
            printChar();
        }

        function deletePhrase() {
            let word = phrases[i];
            let chars = word.split('');
            
            function eraseChar() {
                if (chars.length > 0) {
                    chars.pop();
                    typewriter.innerHTML = chars.join('');
                    timer = setTimeout(eraseChar, 35);
                } else {
                    i = (i + 1) % phrases.length;
                    timer = setTimeout(typePhrase, 400); // Pause before typing next word
                }
            }
            eraseChar();
        }

        // Start looping typewriter
        typePhrase();
    }


    // ==========================================
    // 6. Interactive Projects Filter Controller
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active states
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // ==========================================
    // 7. Scroll Entrance Reveals (Intersection Observer)
    // ==========================================
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's a skills card, trigger progress bar expansion
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                if (progressBars.length > 0) {
                    progressBars.forEach(bar => {
                        const widthStr = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = widthStr;
                            bar.style.transition = 'width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
                        }, 100);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15
    });

    // Elements to reveal
    const cardsToReveal = document.querySelectorAll('.skills-category-card, .project-card, .timeline-content, .contact-card');
    cardsToReveal.forEach(card => {
        // Setup initial hidden styling styles
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        sectionObserver.observe(card);
    });

    // Custom CSS style rule generator to trigger reveal transitions
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    // ==========================================
    // 8. Contact Channels Ready
    // ==========================================
    console.log("Portfolio contact channels (GitHub/LinkedIn) configured successfully.");


    // ==========================================
    // 9. Project Case Study Modal Controller
    // ==========================================
    const projectDetailsData = {
        "1": {
            title: "AE Widget: DSP & Memory Diagnostic Hub",
            tag: "C# .NET / Hardware Utility",
            img: "assets/project3.png",
            tech: ["C# .NET", "USB MEM", "I2C Protocol", "DSP Gating", "GUI Framework"],
            desc: "A high-performance Windows GUI utility designed to streamline physical interface reads, writes, compares, and binary hex dumps (USB MEM/I2C). Serves as the central console for full DSP register adjustments, clock gating, and electrical audio pathway routing.",
            specs: [
                "VS-developed C# framework providing high-speed register reads/writes.",
                "Controls fine-grained DSP registers, power gating, and clock interfaces.",
                "Performs comparison and bulk export of registry states for firmware verification.",
                "Integrated bit-level pathway visualizers for audio interfaces."
            ]
        },
        "2": {
            title: "DSP FW Merge Tool",
            tag: "Python / AI Automation",
            img: "assets/project1.png",
            tech: ["Python", "Tkinter GUI", "Binary Parsing", "Version Control", "Executable Packaging"],
            desc: "A Python-based GUI application packaged as a standalone EXE. It automates firmware packaging and registers merging by reading binary DSP packages, modifying initial registers, adjusting DSP algorithms, and maintaining robust firmware version controls. Eliminates manual, error-prone batch/CSV configurations.",
            specs: [
                "Standardized and automated registration settings merging to eliminate manual INI/CSV edits.",
                "Parses DSP FW package structures and applies specific algorithm parameters in batches.",
                "Outputs optimized executable files packaged using Python's Tkinter framework.",
                "Fully integrated version control and validation checks to avoid register page conflicts."
            ]
        },
        "3": {
            title: "ITU-T P1140 Telematics Testing Platform",
            tag: "Automotive / Acoustics Validation",
            img: "assets/project2.png",
            tech: ["Quectel EVK", "T-Box Emulation", "ITU-T P.1140", "Acoustic Validation", "DSP Benchmarking"],
            desc: "Architected a comprehensive Telematics Box (T-Box) emulation system integrating Quectel evaluation kits (EVKs). Leveraged this hardware-in-the-loop environment to conduct ITU-T P.1140 voice quality, noise reduction, and echo-cancellation compliance testing on proprietary Realtek automotive codecs and DSP units.",
            specs: [
                "Emulated full-scale in-vehicle network nodes using Quectel evaluation kits.",
                "Conducted strict acoustic standard evaluations including echo loss (TCLw) and voice quality (MOS).",
                "Verified Realtek automotive audio codec performance under complex network scenarios.",
                "Streamlined vehicle-to-cloud diagnostics and audio gateway validation."
            ]
        },
        "4": {
            title: "Automotive Codec Script Converter",
            tag: "C# GUI / Register Compiler",
            img: "assets/project4.png",
            tech: ["C# .NET", "Automotive Codec", "Page Burst I2C", "Script Parsing", "Verification Tooling"],
            desc: "A specialized C# .NET conversion tool designed to resolve register schema incompatibilities. It parses complex multi-page, burst-mode I2C registers from automotive audio codecs and compiles them into clean, linear single-address + single-data sequences compatible with legacy test instruments.",
            specs: [
                "Decouples multi-page memory maps into linear flat-address representations.",
                "Parses legacy burst write sequences and formats them into sequential read/write commands.",
                "Designed custom algorithms to handle automated clock and power gating initialization.",
                "Provides instant validation feedback to highlight out-of-order register writes."
            ]
        },
        "5": {
            title: "AI-Assisted iOS BLE & ESP32 IoT Controller",
            tag: "iOS Swift / BLE IoT / ESP32",
            img: "assets/project4.png",
            tech: ["iOS Swift", "CoreBluetooth BLE", "ESP32 MCU", "IoT Architecture", "AI Prototyping"],
            desc: "Designed and developed an AI-assisted iOS mobile application utilizing Swift and CoreBluetooth to establish robust BLE connections with ESP32 microcontrollers. Enables real-time telemetry, bitwise register settings modification, and remote hardware-in-the-loop IoT product demonstrations.",
            specs: [
                "Leveraged Swift's modern asynchronous patterns with CoreBluetooth for low-latency connections.",
                "Built customized bitwise controls to map ESP32 register configurations remotely.",
                "Created dynamic telemetry UI to plot sensor outputs and battery states in real-time.",
                "Utilized AI-assisted engineering practices for fast prototyping and clean architecture separation."
            ]
        },
        "6": {
            title: "DSP JTAG Instruction Compiler",
            tag: "Python / Validation Compiler",
            img: "assets/project1.png",
            tech: ["Python", "JTAG Protocol", "Hardware Injector", "Diagnostic Scripting"],
            desc: "A high-efficiency Python scripting utility developed to accelerate JTAG hardware verification. It parses human-readable initial register scripts and compiles them into structured, JTAG-compliant binary register instruction formats for immediate diagnostic injection.",
            specs: [
                "Automatically parses raw text initializations and maps them to target register sheets.",
                "Emits optimized byte sequences compatible with standard JTAG debuggers.",
                "Drastically shortened initial debugging cycles from hours to minutes during initial bring-up.",
                "Performs boundary scans and integrity checks prior to instruction execution."
            ]
        },
        "7": {
            title: "32-Bit Bitwise Register Calculator",
            tag: "Interactive Web Tool",
            img: "assets/project3.png",
            tech: ["HTML5/JS", "Bitwise Mapping", "Hardware Debugging", "Hex Calculations"],
            desc: "A highly practical visual helper tool designed to increase diagnostic accuracy. It maps 32-bit (4-byte) hexadecimal values into a dynamic array of 32 checkable boxes, enabling engineers to visually map, compute, and toggle bit flags in real-time.",
            specs: [
                "Features interactive bit cells grouped by byte boundaries for rapid scan patterns.",
                "Translates hexadecimal inputs to binary arrays and decimal equivalents bidirectionally.",
                "Highlights standard register mask patterns (AND/OR operations) for field testing.",
                "Speeds up manual register configuration verification under testing benches."
            ]
        }
    };

    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('project-modal-close');
    const modalImg = document.getElementById('modal-project-img');
    const modalTag = document.getElementById('modal-project-tag');
    const modalTitle = document.getElementById('modal-project-title');
    const modalTech = document.getElementById('modal-project-tech');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalSpecs = document.getElementById('modal-project-specs');

    const openModal = (projectId) => {
        const data = projectDetailsData[projectId];
        if (!data) return;

        // Bind data to DOM
        modalImg.src = data.img;
        modalImg.alt = `${data.title} Mockup Screen`;
        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;

        // Render tech tags
        modalTech.innerHTML = '';
        data.tech.forEach(techName => {
            const span = document.createElement('span');
            span.textContent = techName;
            modalTech.appendChild(span);
        });

        // Render specs bullet points
        modalSpecs.innerHTML = '';
        data.specs.forEach(specText => {
            const li = document.createElement('li');
            li.textContent = specText;
            modalSpecs.appendChild(li);
        });

        // Open Modal
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    // Attach Click Events to project card images/overlays
    const projectCardsList = document.querySelectorAll('.project-card');
    projectCardsList.forEach(card => {
        const imgContainer = card.querySelector('.project-img-container');
        const projectId = card.getAttribute('data-project-id');
        
        if (imgContainer && projectId) {
            imgContainer.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(projectId);
            });
        }
    });

    // Close buttons and outside clicks
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Keyboard ESC close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
});
