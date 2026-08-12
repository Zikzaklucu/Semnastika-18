(() => {
  const initLinimasaReveal = () => {
    const items = Array.from(document.querySelectorAll(".linimasa-item"));
    if (!items.length || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("js-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    items.forEach((item) => observer.observe(item));
  };

  initLinimasaReveal();

  const syncDotState = (dots, activeIndex) => {
    dots.forEach((dot, index) => {
      const isCurrent = index === activeIndex;
      dot.classList.toggle("is-active", isCurrent);
      if (isCurrent) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };

  const installSwipeGesture = (surface, onSwipe, options = {}) => {
    if (!surface) return;

    const minimumDistance = options.minimumDistance ?? 56;
    const maximumDuration = options.maximumDuration ?? 650;
    const axisBias = options.axisBias ?? 1.25;
    let touchId = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let startTime = 0;
    let startContext = null;

    const reset = () => {
      touchId = null;
      startTime = 0;
      startContext = null;
    };

    surface.addEventListener("touchstart", (event) => {
      if (event.touches.length !== 1) {
        reset();
        return;
      }

      const touch = event.touches[0];
      touchId = touch.identifier;
      startX = touch.clientX;
      startY = touch.clientY;
      lastX = startX;
      lastY = startY;
      startTime = performance.now();
      startContext = options.captureStart?.(event) ?? null;
    }, { passive: true });

    surface.addEventListener("touchmove", (event) => {
      if (touchId === null) return;
      const touch = Array.from(event.touches).find((item) => item.identifier === touchId);
      if (!touch) return;
      lastX = touch.clientX;
      lastY = touch.clientY;
    }, { passive: true });

    surface.addEventListener("touchend", (event) => {
      if (touchId === null) return;

      const touch = Array.from(event.changedTouches).find((item) => item.identifier === touchId);
      const endX = touch?.clientX ?? lastX;
      const endY = touch?.clientY ?? lastY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const duration = performance.now() - startTime;
      const gestureContext = startContext;
      reset();

      if (duration > maximumDuration) return;
      if (Math.abs(deltaX) < minimumDistance) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY) * axisBias) return;
      if (options.shouldSwipe && !options.shouldSwipe({ deltaX, deltaY, duration, startContext: gestureContext })) return;
      onSwipe(deltaX < 0 ? 1 : -1);
    }, { passive: true });

    surface.addEventListener("touchcancel", reset, { passive: true });
  };

  const aboutCarousel = document.querySelector("[data-about-carousel]");
  if (aboutCarousel) {
    const slides = Array.from(aboutCarousel.querySelectorAll("[data-about-slide]"));
    const previous = aboutCarousel.querySelector("[data-about-prev]");
    const next = aboutCarousel.querySelector("[data-about-next]");
    const pagerItems = Array.from(document.querySelectorAll("[data-about-dot]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = 0;
    let isTransitioning = false;

    const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

    const updatePager = () => {
      syncDotState(pagerItems, activeIndex);
    };

    const moveTo = async (index, direction) => {
      if (isTransitioning || slides.length < 2) return;
      const nextIndex = (index + slides.length) % slides.length;
      if (nextIndex === activeIndex) return;
      isTransitioning = true;

      const current = slides[activeIndex];
      const incoming = slides[nextIndex];
      const duration = reducedMotion.matches ? 0 : 180;

      current.style.setProperty("--about-exit-x", `${direction * -12}px`);
      incoming.style.setProperty("--about-enter-x", `${direction * 12}px`);
      current.classList.add("is-exiting");
      await wait(duration);

      current.classList.remove("is-active", "is-exiting");
      current.setAttribute("aria-hidden", "true");
      incoming.classList.add("is-entering", "is-active");
      incoming.removeAttribute("aria-hidden");
      activeIndex = nextIndex;
      updatePager();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => incoming.classList.remove("is-entering"));
      });

      await wait(duration);
      isTransitioning = false;
    };

    previous?.addEventListener("click", () => moveTo(activeIndex - 1, -1));
    next?.addEventListener("click", () => moveTo(activeIndex + 1, 1));
    pagerItems.forEach((dot, index) => {
      dot.addEventListener("click", () => moveTo(index, index > activeIndex ? 1 : -1));
    });
    installSwipeGesture(aboutCarousel.querySelector(".framed-copy--wide"), (direction) => {
      moveTo(activeIndex + direction, direction);
    });
    updatePager();
  }

  const analysisCarousel = document.querySelector("[data-analisis-carousel]");
  if (analysisCarousel) {
    const slides = Array.from(analysisCarousel.querySelectorAll("[data-analisis-slide]"));
    const previous = analysisCarousel.querySelector("[data-analisis-prev]");
    const next = analysisCarousel.querySelector("[data-analisis-next]");
    const pagerItems = Array.from(document.querySelectorAll("[data-analisis-dot]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = 0;
    let isTransitioning = false;

    const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

    const updatePager = () => {
      syncDotState(pagerItems, activeIndex);
    };

    const moveTo = async (index, direction) => {
      if (isTransitioning || slides.length < 2) return;
      const nextIndex = (index + slides.length) % slides.length;
      if (nextIndex === activeIndex) return;
      isTransitioning = true;

      const current = slides[activeIndex];
      const incoming = slides[nextIndex];
      const duration = reducedMotion.matches ? 0 : 180;

      current.style.setProperty("--analisis-exit-x", `${direction * -12}px`);
      incoming.style.setProperty("--analisis-enter-x", `${direction * 12}px`);
      current.classList.add("is-exiting");
      await wait(duration);

      current.classList.remove("is-active", "is-exiting");
      current.setAttribute("aria-hidden", "true");
      incoming.classList.add("is-entering", "is-active");
      incoming.removeAttribute("aria-hidden");
      activeIndex = nextIndex;
      updatePager();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => incoming.classList.remove("is-entering"));
      });

      await wait(duration);
      isTransitioning = false;
    };

    previous?.addEventListener("click", () => moveTo(activeIndex - 1, -1));
    next?.addEventListener("click", () => moveTo(activeIndex + 1, 1));
    pagerItems.forEach((dot, index) => {
      dot.addEventListener("click", () => moveTo(index, index > activeIndex ? 1 : -1));
    });
    installSwipeGesture(analysisCarousel.querySelector(".analysis-state-frame"), (direction) => {
      moveTo(activeIndex + direction, direction);
    });
    updatePager();
  }

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const viewport = carousel.querySelector("[data-carousel-viewport]");
    const track = carousel.querySelector("[data-track]");
    const previous = carousel.querySelector("[data-prev]");
    const next = carousel.querySelector("[data-next]");
    const status = carousel.querySelector("[data-carousel-status]");
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    if (!viewport || !track || !previous || !next) return;

    const cards = Array.from(track.children);
    const focusStackMode = carousel.dataset.carouselMode === "focus-stack";
    const singleActiveMode = carousel.hasAttribute("data-carousel-single-active");
    const loops = carousel.hasAttribute("data-carousel-loop");
    if (focusStackMode || singleActiveMode) carousel.classList.add("is-carousel-ready");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dragThreshold = 5;
    let activeIndex = 0;
    let scrollFrame = 0;
    let dragging = false;
    let dragCommitted = false;
    let suppressNextClick = false;
    let suppressClickTimer = 0;
    let activePointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let isTransitioning = false;

    const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

    const updateFullBleedMetrics = () => {
      const clientWidth = document.documentElement.clientWidth;
      carousel.style.setProperty("--carousel-client-width", `${clientWidth}px`);
      carousel.style.setProperty("--carousel-client-offset", `${clientWidth / -2}px`);
    };

    const getVisibleCount = () => {
      if (focusStackMode) return 1;

      const configuredCount = Number.parseInt(
        getComputedStyle(carousel).getPropertyValue("--carousel-visible-count"),
        10,
      );
      return Math.max(1, Math.min(configuredCount || 1, cards.length));
    };

    const getMaxStartIndex = () => Math.max(0, cards.length - getVisibleCount());

    const measureTrack = () => {
      const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
      const trackStyle = getComputedStyle(track);
      const gap = Number.parseFloat(trackStyle.columnGap) || 0;
      const inlineStartPadding = Number.parseFloat(trackStyle.paddingInlineStart) || 0;
      const snapOffset = inlineStartPadding - ((viewport.clientWidth - cardWidth) / 2);
      return {
        cardWidth,
        gap,
        snapOffset,
        step: cardWidth + gap,
      };
    };

    const updateSingleActiveHeight = () => {
      if (!singleActiveMode) return;
      const activeCard = cards[activeIndex];
      if (!activeCard) return;
      const shadowSpace = Number.parseFloat(
        getComputedStyle(carousel).getPropertyValue("--carousel-shadow-space"),
      ) || 0;
      viewport.style.height = `${activeCard.offsetHeight + shadowSpace}px`;
    };

    const updateState = () => {
      syncDotState(dots, activeIndex);

      if (focusStackMode) {
        const previousIndex = loops
          ? (activeIndex - 1 + cards.length) % cards.length
          : activeIndex - 1;
        const nextIndex = loops
          ? (activeIndex + 1) % cards.length
          : activeIndex + 1;

        cards.forEach((card, index) => {
          const isCurrent = index === activeIndex;
          let state = "hidden";
          if (isCurrent) state = "active";
          else if (index === previousIndex) state = "previous";
          else if (index === nextIndex) state = "next";

          card.dataset.carouselState = state;
          card.toggleAttribute("inert", !isCurrent);
          card.setAttribute("aria-hidden", String(!isCurrent));
          if (isCurrent) card.setAttribute("aria-current", "true");
          else card.removeAttribute("aria-current");
        });

        previous.setAttribute("aria-disabled", String(!loops && activeIndex === 0));
        next.setAttribute("aria-disabled", String(!loops && activeIndex === cards.length - 1));

        if (status) {
          const label = cards[activeIndex].getAttribute("aria-label")?.replace(/^\d+ dari \d+:\s*/, "") || "";
          status.textContent = `Kartu ${activeIndex + 1} dari ${cards.length}: ${label}`;
        }
        return;
      }

      const visibleCount = getVisibleCount();
      const maxStartIndex = getMaxStartIndex();
      const lastVisibleIndex = Math.min(activeIndex + visibleCount - 1, cards.length - 1);

      cards.forEach((card, index) => {
        const isLeadingCard = index === activeIndex;
        const isVisible = index >= activeIndex && index <= lastVisibleIndex;
        card.toggleAttribute("data-visible", isVisible);
        if (singleActiveMode) {
          card.toggleAttribute("inert", !isLeadingCard);
          card.setAttribute("aria-hidden", String(!isLeadingCard));
        }
        if (isLeadingCard) {
          card.setAttribute("aria-current", "true");
        } else {
          card.removeAttribute("aria-current");
        }
      });

      previous.setAttribute("aria-disabled", String(activeIndex === 0));
      next.setAttribute("aria-disabled", String(activeIndex === maxStartIndex));

      if (status) {
        if (visibleCount === 1) {
          const label = cards[activeIndex].getAttribute("aria-label")?.replace(/^\d+ dari \d+:\s*/, "") || "";
          status.textContent = `Kartu ${activeIndex + 1} dari ${cards.length}: ${label}`;
        } else {
          status.textContent = `Kartu ${activeIndex + 1}–${lastVisibleIndex + 1} dari ${cards.length}`;
        }
      }
      updateSingleActiveHeight();
    };

    const scrollToIndex = (index, behavior = "smooth") => {
      if (focusStackMode) {
        activeIndex = loops
          ? (index + cards.length) % cards.length
          : Math.max(0, Math.min(index, cards.length - 1));
        updateState();
        return;
      }

      const { snapOffset, step } = measureTrack();
      activeIndex = Math.max(0, Math.min(index, getMaxStartIndex()));
      updateState();
      viewport.scrollTo({
        left: snapOffset + (activeIndex * step),
        behavior: reducedMotion.matches ? "auto" : behavior,
      });
    };

    const navigateToIndex = async (index) => {
      if (!singleActiveMode) {
        scrollToIndex(index);
        return;
      }

      const nextIndex = Math.max(0, Math.min(index, getMaxStartIndex()));
      if (isTransitioning || nextIndex === activeIndex) return;
      isTransitioning = true;

      const current = cards[activeIndex];
      const incoming = cards[nextIndex];
      const direction = nextIndex > activeIndex ? 1 : -1;
      const duration = reducedMotion.matches ? 0 : 180;

      current.style.setProperty("--speaker-exit-x", `${direction * -12}px`);
      incoming.style.setProperty("--speaker-enter-x", `${direction * 12}px`);
      current.classList.add("is-exiting");
      await wait(duration);

      incoming.classList.add("is-entering");
      activeIndex = nextIndex;
      updateState();
      scrollToIndex(activeIndex, "auto");
      current.classList.remove("is-exiting");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => incoming.classList.remove("is-entering"));
      });

      await wait(duration);
      isTransitioning = false;
    };

    const syncIndexFromScroll = () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const { snapOffset, step } = measureTrack();
        if (!step) return;
        const nextIndex = Math.max(0, Math.min(Math.round((viewport.scrollLeft - snapOffset) / step), getMaxStartIndex()));
        if (nextIndex !== activeIndex) {
          activeIndex = nextIndex;
          updateState();
        }
      });
    };

    const finishMouseDrag = (event) => {
      if (event.pointerType !== "mouse") return;
      if (!dragging || event.pointerId !== activePointerId) return;

      const shouldSnap = dragCommitted;
      dragging = false;
      dragCommitted = false;
      activePointerId = null;
      viewport.classList.remove("is-mouse-dragging");

      if (!shouldSnap) return;

      const { snapOffset, step } = measureTrack();
      const nearestIndex = step ? Math.round((viewport.scrollLeft - snapOffset) / step) : 0;
      scrollToIndex(nearestIndex, "smooth");
      window.clearTimeout(suppressClickTimer);
      suppressClickTimer = window.setTimeout(() => {
        suppressNextClick = false;
      }, 0);
    };

    if (!focusStackMode) {
      viewport.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "mouse") return;
        if (event.button !== 0) return;
        dragging = true;
        dragCommitted = false;
        activePointerId = event.pointerId;
        startX = event.clientX;
        startScrollLeft = viewport.scrollLeft;
      });

      viewport.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        if (!dragging || event.pointerId !== activePointerId) return;

        const deltaX = event.clientX - startX;
        if (!dragCommitted && Math.abs(deltaX) > dragThreshold) {
          dragCommitted = true;
          suppressNextClick = true;
          viewport.classList.add("is-mouse-dragging");
        }

        if (!dragCommitted) return;
        event.preventDefault();
        viewport.scrollLeft = startScrollLeft - deltaX;
      }, { passive: false });

      ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
        viewport.addEventListener(eventName, finishMouseDrag);
      });

      viewport.addEventListener("click", (event) => {
        if (!suppressNextClick) return;
        suppressNextClick = false;
        window.clearTimeout(suppressClickTimer);
        event.preventDefault();
        event.stopPropagation();
      }, true);

      viewport.addEventListener("scroll", syncIndexFromScroll, { passive: true });
      viewport.addEventListener("keydown", (event) => {
        if (event.target !== viewport) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          navigateToIndex(activeIndex - 1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          navigateToIndex(activeIndex + 1);
        }
      });
    }

    previous.addEventListener("click", () => {
      if (loops || activeIndex > 0) navigateToIndex(activeIndex - 1);
    });
    next.addEventListener("click", () => {
      if (loops || activeIndex < getMaxStartIndex()) navigateToIndex(activeIndex + 1);
    });
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => navigateToIndex(index));
    });
    if (focusStackMode) {
      const prioritizesMapPan = carousel.hasAttribute("data-carousel-map-pan-priority");
      const swipeOptions = prioritizesMapPan
        ? {
            minimumDistance: Number(carousel.dataset.carouselSwipeDistance) || 96,
            maximumDuration: Number(carousel.dataset.carouselSwipeDuration) || 360,
            axisBias: Number(carousel.dataset.carouselSwipeAxisBias) || 1.7,
            captureStart: (event) => {
              const panRegion = event.target.closest(".venue-slide__pan");
              if (!panRegion || !carousel.contains(panRegion)) return null;
              return { insidePanRegion: true };
            },
            shouldSwipe: ({ startContext }) => !startContext?.insidePanRegion,
          }
        : undefined;
      installSwipeGesture(viewport, (direction) => {
        const nextIndex = activeIndex + direction;
        if (loops || (nextIndex >= 0 && nextIndex < cards.length)) navigateToIndex(nextIndex);
      }, swipeOptions);
    }

    if (!focusStackMode) updateFullBleedMetrics();
    if (singleActiveMode && "ResizeObserver" in window) {
      const activeCardObserver = new ResizeObserver((entries) => {
        if (entries.some((entry) => entry.target === cards[activeIndex])) {
          updateSingleActiveHeight();
        }
      });
      cards.forEach((card) => activeCardObserver.observe(card));
    }
    requestAnimationFrame(() => scrollToIndex(activeIndex, "auto"));
    window.addEventListener("resize", () => {
      if (!focusStackMode) updateFullBleedMetrics();
      requestAnimationFrame(() => scrollToIndex(activeIndex, "auto"));
    });
  });
})();
