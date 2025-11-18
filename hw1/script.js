/**
 * Personal Resume - Interactive Features
 * Implements expand/collapse functionality for project items
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectToggle();
    initializeSmoothScroll();
    logPerformanceMetrics();
});

/**
 * Initialize project expand/collapse functionality
 */
function initializeProjectToggle() {
    const projectHeaders = document.querySelectorAll('.project-header');

    projectHeaders.forEach(header => {
        // Add keyboard accessibility
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'true');

        // Click handler
        header.addEventListener('click', function(e) {
            // Prevent toggle when clicking on links
            if (e.target.tagName === 'A') {
                return;
            }
            toggleProjectItem(this);
        });

        // Keyboard handler for accessibility
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleProjectItem(this);
            }
        });
    });
}

/**
 * Toggle project item expand/collapse state
 * @param {HTMLElement} header - The project header element
 */
function toggleProject(header) {
    toggleProjectItem(header);
}

/**
 * Toggle project item with animation
 * @param {HTMLElement} header - The project header element
 */
function toggleProjectItem(header) {
    const projectItem = header.closest('.project-item');
    const content = projectItem.querySelector('.project-content');
    const isCollapsed = projectItem.classList.contains('collapsed');

    if (isCollapsed) {
        // Expand
        projectItem.classList.remove('collapsed');
        header.setAttribute('aria-expanded', 'true');

        // Animate expansion
        content.style.display = 'block';
        content.style.opacity = '0';
        content.style.transform = 'translateY(-10px)';

        requestAnimationFrame(() => {
            content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        });

        // Clean up inline styles after animation
        setTimeout(() => {
            content.style.display = '';
            content.style.opacity = '';
            content.style.transform = '';
            content.style.transition = '';
        }, 300);

        console.log('Project expanded:', projectItem.querySelector('h3').textContent);
    } else {
        // Collapse
        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        content.style.opacity = '0';
        content.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            projectItem.classList.add('collapsed');
            header.setAttribute('aria-expanded', 'false');

            // Reset all inline styles
            content.style.display = '';
            content.style.opacity = '';
            content.style.transform = '';
            content.style.transition = '';
        }, 300);

        console.log('Project collapsed:', projectItem.querySelector('h3').textContent);
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Log performance metrics for debugging
 */
function logPerformanceMetrics() {
    // Check if Performance API is available
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const timing = window.performance.timing;
                const metrics = {
                    'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
                    'TCP Connection': timing.connectEnd - timing.connectStart,
                    'DOM Content Loaded': timing.domContentLoadedEventEnd - timing.navigationStart,
                    'Page Load Complete': timing.loadEventEnd - timing.navigationStart,
                    'DOM Interactive': timing.domInteractive - timing.navigationStart
                };

                console.group('Page Performance Metrics');
                for (const [key, value] of Object.entries(metrics)) {
                    console.log(`${key}: ${value}ms`);
                }
                console.groupEnd();
            }, 0);
        });
    }

    // Log resource loading
    if (window.performance && window.performance.getEntriesByType) {
        window.addEventListener('load', function() {
            const resources = window.performance.getEntriesByType('resource');

            console.group('Resource Loading');
            resources.forEach(resource => {
                console.log(`${resource.name.split('/').pop()}: ${Math.round(resource.duration)}ms`);
            });
            console.groupEnd();
        });
    }
}

/**
 * Utility function to expand all projects
 */
function expandAllProjects() {
    document.querySelectorAll('.project-item.collapsed').forEach(item => {
        const header = item.querySelector('.project-header');
        toggleProjectItem(header);
    });
    console.log('All projects expanded');
}

/**
 * Utility function to collapse all projects
 */
function collapseAllProjects() {
    document.querySelectorAll('.project-item:not(.collapsed)').forEach(item => {
        const header = item.querySelector('.project-header');
        toggleProjectItem(header);
    });
    console.log('All projects collapsed');
}

// Export functions for debugging in console
window.resumeUtils = {
    expandAllProjects,
    collapseAllProjects,
    toggleProject
};
