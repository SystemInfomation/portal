// Controls for game/utility iframes - adds fullscreen and external link buttons
(function() {
    'use strict';

    // Add overflow handling for the control bar
    const style = document.createElement('style');
    style.textContent = `
        html {
            height: 100%;
        }
        
        body {
            height: 100%;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            overflow: hidden;
        }
        
        body > * {
            max-height: calc(100vh - 60px);
            overflow: auto;
        }
    `;
    document.head.appendChild(style);

    // Create control bar
    const controlBar = document.createElement('div');
    controlBar.className = 'iframe-control-bar';
    
    // Create fullscreen button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'iframe-control-btn fullscreen-btn';
    fullscreenBtn.title = 'Toggle Fullscreen';
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    
    // Create external link button
    const externalBtn = document.createElement('button');
    externalBtn.className = 'iframe-control-btn external-btn';
    externalBtn.title = 'Open in About:Blank Tab';
    externalBtn.innerHTML = '<i class="fas fa-external-link-alt"></i>';
    
    // Add buttons to control bar
    controlBar.appendChild(fullscreenBtn);
    controlBar.appendChild(externalBtn);
    
    // Add control bar to page when DOM is ready
    if (document.body) {
        document.body.appendChild(controlBar);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(controlBar);
        });
    }
    
    let isFullscreen = false;
    
    fullscreenBtn.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        
        if (isFullscreen) {
            // Hide navbar
            window.parent.postMessage({type: 'toggleNavbar', hidden: true}, '*');
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            fullscreenBtn.title = 'Exit Fullscreen';
            controlBar.classList.add('fullscreen-active');
        } else {
            // Show navbar
            window.parent.postMessage({type: 'toggleNavbar', hidden: false}, '*');
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.title = 'Toggle Fullscreen';
            controlBar.classList.remove('fullscreen-active');
        }
    });
    
    externalBtn.addEventListener('click', () => {
        // Get the current iframe URL from parent
        const currentUrl = window.location.href;
        
        // Remove the login.live.com query parameter if present
        const cleanUrl = currentUrl.split('?')[0];
        
        // Post message to parent to open in about:blank tab
        window.parent.postMessage({
            type: 'openExternal',
            url: cleanUrl
        }, '*');
    });
    
    // Listen for navbar state changes from parent
    window.addEventListener('message', (e) => {
        if (e.data.type === 'navbarStateChange') {
            // Update button state if navbar visibility changes externally
            if (e.data.hidden) {
                isFullscreen = true;
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenBtn.title = 'Exit Fullscreen';
                controlBar.classList.add('fullscreen-active');
            } else {
                isFullscreen = false;
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenBtn.title = 'Toggle Fullscreen';
                controlBar.classList.remove('fullscreen-active');
            }
        }
    });
})();
